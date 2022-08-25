
import { reactive, readonly } from "vue";

const state = reactive({
    device: null
});

const searchDevice = async (uid) => {
    try {
        //const resp = await search(uid)
        if (resp.count > 0) {
            state.device = resp.data[0]
            if (resp.data && resp.data[0]) {
                return resp.data[0]
            }
        } else {
            throw new Error("There is no device corresponding to this identifier.")
        }
    } catch (err) {
        throw err
    }
}

export default {
    state: readonly(state),
};
