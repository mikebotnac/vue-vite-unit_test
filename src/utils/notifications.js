import userStore from "../store/user"
import { computed } from "vue"
import { differenceInDays } from "date-fns"

const userUnits = computed(() => {
    return userStore.state.user.units.data || [];
});

const convertOverspeed = ({ from, data }) => {
    if (from === 'telemetry') {
        return {
            type: "overspeed",
            position: {
                lat: data.matched_latitude,
                long: data.matched_longitude
            },
            time: data.time,
            unit_name: userUnits.value.find(u => u.unit_uuid === data.unit_uuid).unit_name,
            unit_uuid: data.unit_uuid,
            is_speed_enabled: data.active,
            vehicle_speed:
                data.notification_content.speed_limit_at_peak +
                data.notification_content.speed_delta_at_peak,
            posted_speed_limit: data.esmart_algo_speed_limit,
            over_allowed: data.notification_content.speed_delta_at_peak,
            duration: data.notification_content.duration,
            allowed_speed_limit: data.applied_speed_limit,
            isActive: data.active,
            speed_limit_to_apply_kmh: data.notification_content.speed_limit_at_peak,
            raw_data: data,
            local_time: data.local_time

        }
    } else if (from === 'map' || from === 'report') {
        return {
            type: "overspeed",
            position: {
                lat: data.latitude,
                long: data.longitude
            },
            time: data.time,
            unit_name: data.unit_name,
            unit_uuid: data.unit_uuid,
            is_speed_enabled: data.is_speed_enabled,
            vehicle_speed: data.speed_limit_in_kmh + data.speed_delta_in_kmh,
            posted_speed_limit: data.esmart_algo_speed_limit,
            over_allowed: data.speed_delta_in_kmh,
            duration: data.duration_in_s,
            allowed_speed_limit: data.speed_limit_in_kmh,
            isActive: differenceInDays(new Date(), new Date(data.time)) < 2,
            local_time: data.local_time,
            raw_data: data,
        }
    }
}

export { convertOverspeed }