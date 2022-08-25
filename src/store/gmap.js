import { reactive, readonly, toRefs } from "vue";

const state = reactive({
    traffic: false,
    markers: [],
    selectedMarker: null
});

const toggleTraffic = (value) => {
    state.traffic = value
}

const selectMarker = (marker) => {
    state.selectedMarker = marker
}

const addMarker = (marker) => {
    state.markers.push(marker);
}

const clearMarkers = () => {
    state.markers = []
}

export default {
    state: readonly(state),
    ...toRefs(state),
    toggleTraffic,
    selectMarker,
    clearMarkers,
    addMarker
};
