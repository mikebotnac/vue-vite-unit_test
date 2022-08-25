import { post } from "./axios.js"

const searchDevice = async (data) => {

    //If there is all required datas
    if ((data?.search && data?.search[0]) || data?.advanced_search) {

        let tokens = JSON.parse(localStorage.getItem('esmart_tokens'));
        const id_token = tokens.id_token
        const pool_id = import.meta.env.VITE_MFA_POOL_ID

        const url = `${import.meta.env.VITE_API_BASE_URL}search/device`

        const headers = {
            "x-aws-id": `Bearer ${id_token}`
        }

        if (!data.limit) {
            data.limit = 10
        }
        data.page = 1

        data.pool_id = pool_id
        data.order_by = 'last_event.desc'


        try {
            const response = await post({ headers, url, data })
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

export default searchDevice
