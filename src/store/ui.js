import { reactive, readonly } from "vue";

const state = reactive({
    showPageLoader: false
});

const tooglePageLoader = (payload) => {
    state.showPageLoader = payload
}

export default {
    state: readonly(state),
    tooglePageLoader
};
