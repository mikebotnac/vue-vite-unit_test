import { post } from "./axios.js"

const trackingTelemetry = async (data) => {

    //If there is all required datas
    if (data && data.unit && data.start && data.end) {

        let tokens = JSON.parse(localStorage.getItem('esmart_tokens'));
        const id_token = tokens.id_token
        const pool_id = import.meta.env.VITE_MFA_POOL_ID

        const url = `${import.meta.env.VITE_API_BASE_URL}search/tracking/telemetry`

        const headers = {
            "x-aws-id": `Bearer ${id_token}`
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
    //If there is not all the required datas
    else {
        throw new Error("A required data is missing.")
    }
}

export default trackingTelemetry
