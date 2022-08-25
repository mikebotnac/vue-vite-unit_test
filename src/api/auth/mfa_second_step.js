import { post } from "../axios.js"

const mfa_second_step = async (data) => {

    //If there is all required datas

    if (data && data.app_id && data.pool_id && data.session && data.username && data.sms_code) {

        const url = `${import.meta.env.VITE_API_BASE_URL}auth/users/${data.username}/login`

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

export default mfa_second_step