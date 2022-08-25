import { get } from "../../axios.js"

const get_bridge_list = async (data) => {
    const url = `${import.meta.env.VITE_API_BASE_URL}search/notification/geofence/list`;

    let tokens = JSON.parse(localStorage.getItem('esmart_tokens'));
    const id_token = tokens.id_token
    const pool_id = import.meta.env.VITE_MFA_POOL_ID

    const headers = {
        "x-aws-id": `Bearer ${id_token}`
    }

    data = {
        ...data,
        pool_id: pool_id
    }


    try {
        const response = await get({ headers, data, url })
        if (response.data) {
            return response.data
        } else {
            throw new Error("There is no data available.")
        }
    } catch (err) {
        throw err
    }
}

export default get_bridge_list