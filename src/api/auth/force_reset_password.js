import { post } from "../axios.js";

const force_reset_password = async (data) => {

  if (data && data.app_id && data.session && data.password && data.username) {

    const url = `${import.meta.env.VITE_API_BASE_URL}auth/users/${data.username}/force-change-password`; // eslint-disable-line

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

export default force_reset_password