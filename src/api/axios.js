//This is a simple axios wrapper for queries
//@damien

import axios from "axios"
import refresh_token from "./auth/refresh_token"
import userStore from "../store/user"
import notificationsStore from "../store/notifications"
import router from "../router"

//Request interceptor
axios.interceptors.request.use(
    config => {
        const tokens = JSON.parse(localStorage.getItem('esmart_tokens'))
        if (tokens) {
            const access_token = tokens.access_token
            const id_token = tokens.id_token
            config.headers['Authorization'] = `Bearer ${access_token}CLIENT`
            config.headers['x-aws-id'] = `Bearer ${id_token}`
        }
        config.headers['Content-type'] = "application/json"
        return config
    },
    error => {
        Promise.reject(error)
    });

//Response interceptor
axios.interceptors.response.use((response) => {
    return response
},
    async (error) => {
        const originalRequest = error.config;
        if (error.response) {
            if (error && error.response && error.response.status === 403 && !originalRequest._retry) {

                originalRequest._retry = true;

                const resp = await userStore.refreshToken()
                axios.defaults.headers.common['Authorization'] = `Bearer ${resp}CLIENT`
                return axios(originalRequest);

            } else {
                router.replace({
                    name: 'Login'
                })
            }
        }

        return Promise.reject(error);
    });


const post = async ({ data, url }) => {
    try {
        const response = await axios.post(url, data)
        return response
    } catch (err) {
        throw err
    }
}

const put = async ({ data, url }) => {
    try {
        const response = await axios.put(url, data)
        return response
    } catch (err) {
        throw err
    }
}

const get = async ({ data, url }) => {
    const config = {
        params: {
            ...data
        }
    }
    try {
        const response = await axios.get(url, config)
        return response
    } catch (err) {
        throw err
    }
}

export { post, put, get }
