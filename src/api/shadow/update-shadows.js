import { post } from "../axios.js"
import userStore from "../../store/user"

const updateShadows = async (data) => {



    //If there is all required datas
    const user = userStore.state.user;

    if (data) {

        const url = `${import.meta.env.VITE_API_BASE_URL}shadows/batch-update`

        const pool_id = import.meta.env.VITE_MFA_POOL_ID
        data.email = data.user;
        data.pool_id = pool_id

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

export default updateShadows