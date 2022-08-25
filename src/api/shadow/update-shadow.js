import { put } from "../axios.js"
import userStore from "../../store/user"

const updateShadow = async (data) => {

    //If there is all required datas
    const user = userStore.state.user;
    if (data && data.device_id && data.shadow && data.serial && user.email) {

        const serial = data.serial

        data.email = user.email;
        const pool_id = import.meta.env.VITE_MFA_POOL_ID

        const url = `${import.meta.env.VITE_API_BASE_URL}shadows/${serial}/restricted?pool_id=${import.meta.env.VITE_MFA_POOL_ID}`

        const id_token = JSON.parse(localStorage.getItem('esmart_tokens')).id_token || null
        const headers = {
            AuthorizationId: `Bearer ${id_token}`,
            "x-aws-id": `Bearer ${id_token}`
        }

        data.pool_id = pool_id
        delete data.device_id
        delete data.serial

        try {
            // debugger;
            const response = await put({ url, data })
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

export default updateShadow