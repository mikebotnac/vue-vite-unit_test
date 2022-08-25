import { post } from "../axios.js"

const refresh_token = async (data) => {

    const app_id = import.meta.env.VITE_MFA_APP_ID
    const pool_id = import.meta.env.VITE_MFA_POOL_ID
    let refresh_token
    const tokens = JSON.parse(localStorage.getItem('esmart_tokens'))
    if (tokens) {
        refresh_token = tokens.refresh_token
    }

    if (app_id && app_id && refresh_token) {

        const url = `${import.meta.env.VITE_API_BASE_URL}auth/users/refresh-token`

        try {
            const response = await post({ url, data })
            if (response.data) {
                return response.data
            } else {
                throw new Error("There is no data available.")
            }
        } catch (err) {
            throw err
        }
    }
    //If there is not all the required datas
    else {
        throw new Error("A required data is missing.")
    }
}

export default refresh_token