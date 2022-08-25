import { post } from "../axios.js"

const request_password_change = async (data) => {

    if (data && data.pool_id && data.username) {

        const url = `${import.meta.env.VITE_API_BASE_URL}auth/users/${data.username}/request-password-change`

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

export default request_password_change