import { reactive } from "vue";
import get_overspeed_list from "../api/notifications/overspeed/overspeed_list.js";

const state = reactive({
    loading: false,
    overspeeds: [],
    pageInfo: null
})

const fetchOverspeed = async (params = {}) => {
    /* params = { ...params, limit: 15 } */
    state.loading = true
    const resp = await get_overspeed_list(params)
    state.overspeeds = resp.data;
    state.pageInfo = {
        totalPage: Math.round(resp.total_count / 15),
        count: resp.count,
        totalCount: resp.total_count,
        currentPage: resp.count / 15,
    }
    state.loading = false
    return resp
}

export { state, fetchOverspeed }