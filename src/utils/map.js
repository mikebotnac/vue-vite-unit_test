import tzlookup from "tz-lookup";

const buildMarker = (data, device, markers) => {
  device.value = data;

  const last_tracking = device.value.last_tracking;
  const last_shadow = device.value.last_shadow;
  const newMarker = {
    id: device.value.device_identifier,
    type:
      last_tracking.road_speed_kmh < 0
        ? "stopped"
        : last_tracking.road_speed_kmh === 0
          ? "idle"
          : "running",
    position: {
      lat: last_tracking.latitude,
      long: last_tracking.longitude,
    },
    time: last_tracking.timestamp * 1000,
    local_time: last_tracking.timestamp * 1000,
    data: {
      time: last_tracking.timestamp * 1000,
      vehicle_speed: last_tracking.road_speed_kmh,
      posted_speed_limit:
        last_tracking.esmart_algo_kmh === 0
          ? last_tracking.map_matched_kmh
          : last_tracking.esmart_algo_kmh,
      allowed_speed: last_tracking.to_apply_kmh,
      raw_data: device.value,
      unit_name: data.unit_name,
      timezone: tzlookup(last_tracking.latitude, last_tracking.longitude)?.replace("_", " "),
      isActive: last_shadow.mcu_config.speed_limiter.enable ?? 'false'
    },
  };
  markers.value.push(newMarker);
}

export default buildMarker;
