import force_reset_password from "../api/auth/force_reset_password"
import mfa_first_step from "../api/auth/mfa_first_step"
import mfa_second_step from "../api/auth/mfa_second_step"
import user_from_token from "../api/auth/user_from_token"
import refresh_token from "../api/auth/refresh_token"
import resetpassword_first_step from "../api/auth/resetpassword_first_step"
import resetpassword_second_step from "../api/auth/resetpassword_second_step"
import getClienConfiguration from "../api/search/get_client_configuration";
import change_password from "../api/auth/change_password"
import get_units from "../api/search/get_units"
import search_devices from "../api/search/search_device"
import { reactive, readonly, computed } from "vue";
import moment from 'moment';
import { datadogRum } from '@datadog/browser-rum';
import LogRocket from 'logrocket';

const state = reactive({
    user: null,
    credentials: {
        username: null,
        password: null
    },
    mfa_username: null,
    fp_username: null,
    session: null,
    tokens: null,
    resetPasswordCredentials: {
        email: null
    }
});

const isAuthenticated = computed(() => {
    return state.user ? true : false
})

const userUnits = computed(() => {
    return state.user.units.data
})

const speedUnit = computed(() => state.user.speedUnit)

//First step of MFA : Email + Password
const login = async (data) => {
    data.app_id = import.meta.env.VITE_MFA_APP_ID
    data.pool_id = import.meta.env.VITE_MFA_POOL_ID
    const resp = await mfa_first_step(data);
    if (resp.data && resp.data.session) {
        state.credentials.username = data.username;
        state.credentials.password = data.password;
        state.session = resp.data.session
        state.mfa_username = resp.data.user_name
        return resp;
    }
}

const forceResetPassword = async (data) => {
    data.app_id = import.meta.env.VITE_MFA_APP_ID;
    const newData = {
        ...data,
        ...{
            session: state.session,
            username: state.mfa_username,
        }
    }
    const resp = await force_reset_password(newData);

    if (resp.data && resp.data.session) {
        state.session = resp.data.session
    }
}

//Second step of MFA : Sms code
const verifySmsCode = async (code) => {
    const data = {
        session: state.session,
        username: state.mfa_username,
        sms_code: code,
        app_id: import.meta.env.VITE_MFA_APP_ID,
        pool_id: import.meta.env.VITE_MFA_POOL_ID
    }
    const resp = await mfa_second_step(data);
    if (resp.data) {
        state.tokens = {
            id_token: resp.data.id_token,
            refresh_token: resp.data.refresh_token,
            access_token: resp.data.access_token,
            expiry: moment().add(3600, 'seconds').format() //Set the expiry of the token at 1h
        }
        state.user = resp.data.user_info;
        localStorage.setItem('esmart_tokens', JSON.stringify(state.tokens));
        const checking = await getUserUnits();
        await getClientConf(state.user['custom:company_name']);
        if (import.meta.env.VITE_ENVIRONMENT !== 'development') {
            datadogRum.setUser({
                name: state.mfa_username,
                email: state.credentials?.username,
                company: state.user['custom:company_name'],
                companyName: state.user?.email?.settings?.name
            });
        }
    }
}

const resendSmsCode = async () => {
    await login({ username: state.credentials.username, password: state.credentials.password })
}

const autoLogin = async () => {
    let tokens = localStorage.getItem('esmart_tokens');
    if (tokens) {
        tokens = JSON.parse(tokens);
        const access_token = tokens.access_token
        if (access_token) {
            //If there is a valid token
            if (tokens.expiry > moment().format()) {
                if (!isAuthenticated.value) {
                    await userFromToken()
                    return true
                } else {
                    return true
                }
            } else {
                try {
                    await refreshToken()
                } catch (err) {
                    localStorage.removeItem('esmart_tokens')
                }
            }
        }
    } else {
        logout()
    }
}

const userFromToken = async () => {
    let tokens = localStorage.getItem('esmart_tokens');
    if (tokens) {
        tokens = JSON.parse(tokens);
        const access_token = tokens.access_token
        const id_token = tokens.id_token
        if (access_token && id_token) {
            const data = {
                access_token: access_token,
                id_token: id_token,
                pool_id: import.meta.env.VITE_MFA_POOL_ID
            }
            try {
                const resp = await user_from_token(data);
                if (resp.cognito_user) {

                    state.user = {
                        email: resp.cognito_user.email,
                        phone: resp.cognito_user.phone_number,
                        name: resp.cognito_user.name,
                        units: {
                            loading: true,
                            data: []
                        },
                    }

                    const tokens = JSON.parse(localStorage.getItem('esmart_tokens'));
                    state.tokens = { ...tokens }
                    localStorage.setItem('esmart_tokens', JSON.stringify(state.tokens));

                    await getUserUnits()
                    await getClientConf(resp.cognito_user['custom:company_name'])
                    //await getUserAvailableUnits()

                }
            } catch (error) {
                throw error
            }
        }
    }
}

const getUserUnits = async () => {
    state.user.units = {
        loading: true,
        data: []
    }
    const resp = await get_units()
    state.user.units = {
        loading: false,
        data: resp.data
    }
}

const getUserAvailableUnits = async () => {
    state.user.units = {
        loading: true,
        data: []
    }
    const resp = await search_devices({})
    state.user.units = {
        loading: false,
        data: resp
    }
}

const getClientConf = async (companyName) => {
    const resp = await getClienConfiguration(companyName);
    state.user.settings = resp.data;
    state.user.company = resp.data;
    state.user.speedUnit = resp.data?.settings?.speedUnit?.toUpperCase() === "KPH"
        ? "kmh"
        : "mph";
}

const refreshToken = async () => {
    let tokens = localStorage.getItem('esmart_tokens');
    if (tokens) {
        tokens = JSON.parse(tokens);
        if (tokens.refresh_token) {
            try {
                const data = {
                    app_id: import.meta.env.VITE_MFA_APP_ID,
                    pool_id: import.meta.env.VITE_MFA_POOL_ID,
                    refresh_token: tokens.refresh_token
                }
                const resp = await refresh_token(data);
                if (resp.data) {
                    let tokenExpiry = moment().add(3600, 'seconds').format();
                    tokens.id_token = resp.data.id_token
                    tokens.access_token = resp.data.access_token;
                    tokens.expiry = tokenExpiry
                    state.tokens = { ...tokens }
                    localStorage.setItem('esmart_tokens', JSON.stringify(tokens))
                    state.user = {
                        email: resp.data.user_info.email,
                        phone: resp.data.user_info.phone_number,
                        name: resp.data.user_info.name
                    }
                    await getUserUnits()
                    await getClientConf(resp.data.user_info['custom:company_name'])
                    return tokens.access_token
                }
            } catch (error) {
                throw error
            }
        } else {
            throw new Error("Can't refresh token : no refresh token.")
        }
    }
}

/* Reset user password from login screen : step 1 */
const requestResetPasswordEmail = async (username) => {
    state.fp_username = username
    try {
        const data = {
            pool_id: import.meta.env.VITE_MFA_POOL_ID,
            username: username
        }
        const resp = await resetpassword_first_step(data);
        state.resetPasswordCredentials.email = username
        return resp
    } catch (error) {
        throw error
    }
}

/* Reset user password from login screen : step 2 */
const resetPassword = async ({ confirmation_code, password }) => {
    const data = {
        app_id: import.meta.env.VITE_MFA_APP_ID,
        username: state.resetPasswordCredentials.email,
        confirmation_code,
        password
    }
    try {
        await resetpassword_second_step(data)
    } catch (error) {
        throw error
    }
}

/* When user changes his password from his account. */
const changePassword = async ({ oldPassword, newPassword }) => {
    try {
        const data = {
            access_token: state.tokens.access_token,
            old_password: oldPassword,
            new_password: newPassword,
            username: state.user.email,
            pool_id: import.meta.env.VITE_MFA_POOL_ID,
        }
        const resp = await change_password(data);
    } catch (error) {
        throw error
    }
}

const logout = () => {
    localStorage.removeItem('esmart_tokens')
    state.tokens = null
    state.user = null
}

export default {
    state: readonly(state),
    isAuthenticated: readonly(isAuthenticated),
    userUnits: readonly(userUnits),
    speedUnit: readonly(speedUnit),
    login,
    verifySmsCode,
    resendSmsCode,
    autoLogin,
    userFromToken,
    logout,
    requestResetPasswordEmail,
    resetPassword,
    changePassword,
    refreshToken,
    forceResetPassword
};
