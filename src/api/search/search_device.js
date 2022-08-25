import { post } from "../axios.js"

const searchDevice = async (data) => {
    //If there is all required datas
    let tokens = JSON.parse(localStorage.getItem('esmart_tokens'));
    const id_token = tokens.id_token
    const pool_id = import.meta.env.VITE_MFA_POOL_ID

    const url = `${import.meta.env.VITE_API_BASE_URL}search/device`

    const headers = {
        "x-aws-id": `Bearer ${id_token}`
    }

    if (!data) {
        data = {};
    }
    data.pool_id = pool_id

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

export default searchDevice