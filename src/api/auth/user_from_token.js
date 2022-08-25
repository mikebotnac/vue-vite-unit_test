import { get } from "../axios.js"

const user_from_token = async (data) => {

    if (data && data.pool_id && data.id_token) {

        const url = `${import.meta.env.VITE_API_BASE_URL}auth/users/damien@leeroy.ca?pool_id=${data.pool_id}`
        const headers = {
            "x-aws-id": `Bearer ${data.id_token}`
        }
        try {
            const response = await get({ headers, data: null, url })
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

export default user_from_token