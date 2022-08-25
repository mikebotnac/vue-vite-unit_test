import { post } from "./axios.js"

const trackingNotification = async (data) => {

    //If there is all required datas
    if (data && data.identifier && data.start && data.end) {

        const url = `${import.meta.env.VITE_API_BASE_URL}search/tracking/notification`

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

export default trackingNotification
