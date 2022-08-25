import { get } from "../axios.js"

const getUnits = async () => {

    let tokens = JSON.parse(localStorage.getItem('esmart_tokens'));
    const id_token = tokens.id_token
    const pool_id = import.meta.env.VITE_MFA_POOL_ID
    const url = `${import.meta.env.VITE_API_BASE_URL}search/unit`


    const data = {}
    data.pool_id = pool_id

    try {
        const response = await get({ data, url })
        if (response.data) {
            return response.data
        } else {
            throw new Error("There is no data available.")
        }
    } catch (err) {
        throw err
    }
}

export default getUnits