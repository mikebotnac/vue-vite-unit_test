import { get } from "../axios.js"

const fetchShadow = async (data) => {

    //If there is all required datas
    if (data && data.serials && data.states) {

        const serials = data.serials.join(",")
        const states = data.states.join(",")

        const url = `${import.meta.env.VITE_API_BASE_URL}shadows/${serials}/states/${states}`

        try {
            const response = await get({ url })
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

export default fetchShadow