import { post } from "../axios.js"

const change_password = async (data) => {

    if (data && data.username && data.access_token && data.old_password && data.new_password && data.pool_id) {

        const url = `${import.meta.env.VITE_API_BASE_URL}auth/users/${data.username}/reset-password`

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

export default change_password
