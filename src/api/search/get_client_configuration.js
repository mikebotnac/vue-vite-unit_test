import { get } from "../axios.js"

const getClienConfiguration = async (clientNumber) => {

    const pool_id = import.meta.env.VITE_MFA_POOL_ID
    const url = `${import.meta.env.VITE_API_BASE_URL}search/clients/${clientNumber}`

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

export default getClienConfiguration