import { get } from "./axios.js"

const vehicle_stats = async () => {

    const data = {};
    const pool_id = import.meta.env.VITE_MFA_POOL_ID;
    data.pool_id = pool_id;

    const url = `${import.meta.env.VITE_API_BASE_URL}search/unit/stats?pool_id=${pool_id}`;

    try {
        const response = await get({ data, url });
        if (response.data) {
            return response.data
        } else {
            throw new Error("There is no data available.")
        }
    } catch (err) {
        throw err
    }
}

export default vehicle_stats;
