import { post } from "../axios.js"

const resetpassword_second_step = async (data) => {

    if (data && data.username && data.app_id && data.confirmation_code && data.password) {

        const url = `${import.meta.env.VITE_API_BASE_URL}auth/users/${data.username}/forgot-password`

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

export default resetpassword_second_step