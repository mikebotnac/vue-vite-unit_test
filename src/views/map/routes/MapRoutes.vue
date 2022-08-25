<template>
  <div class="h-full flex flex-col">
    <Card class="mb-4">
      <template v-slot:content>
        <MapRouteSearchForm :payload="params" :error="error" :loading="loading" />
      </template>
    </Card>
    <div class="flex-1 flex flex-col">
      <Gmap dynamicSizedPin :markers="markers" renderer="tracking" />
      <GmapLegend />
    </div>
  </div>
</template>

<script setup>
import trackingTelemetry from "../../../api/tracking-telemetry";
import { useRoute } from "vue-router";
import { computed, ref, watch, inject } from "vue";
import { convertOverspeed } from "../../../utils/notifications";
import { convertZonedToUTC } from "../../../utils/dates";
import { set } from "date-fns";
import tzlookup from "tz-lookup";

const route = useRoute();
//NOTIFICATION STORE
const notificationsStore = inject("notificationsStore");

const params = computed(() => {
  return { ...route.query, uuid: route.params.uuid || null };
});

const error = ref("");
const loading = ref(false);

const filters = ref({});

const markers = ref([]);

const userStore = inject("userStore");
const userUnits = computed(() => {
  if (!userStore.state.user.units.loading) {
    return userStore.state.user.units.data;
  }
  return [];
});

const getTelemetry = async (data) => {
         
  
  loading.value = true;
  error.value = "";
  const response = await trackingTelemetry(data);
  //If there is no data inside the response
  if (response.count === 0) {
    notificationsStore.addNotification({
      type: "error",
      title: `Can't find device telemetry`,
      content: "Please try later or contact support.",
    });
  }
  //If there is data
  else {
    const activePositions = response.data.filter((p) => p.active || true);
    if (activePositions.length === 0) {
      notificationsStore.addNotification({
        type: "error",
        title: `Can't find device telemetry`,
        content: "Please try later or contact support.",
      });
    } else {
      notificationsStore.addNotification({
        type: "success",
        title: `Telemetry success`,
      });
      activePositions.forEach((p) => {
        const marker =
          computedMarkerType(p) === "overspeed"
            ? convertOverspeed({ from: "telemetry", data: p })
            : {
              position: {
                lat: p.gnss_latitude,
                long: p.gnss_longitude,
              },
              type: computedMarkerType(p),
              time: p.time,
              local_time: p.local_time,
              data: {
                time: p.time,
                vehicle_speed: p.road_speed,
                posted_speed_limit: p.esmart_algo_speed_limit,
                allowed_speed: p.applied_speed_limit,
                raw_data: p,
                isActive: p.active,
                timezone: tzlookup(p.gnss_latitude, p.gnss_longitude)?.replace("_", " "),
                unit_name: userUnits.value.find(
                  (u) => u.unit_uuid === p.unit_uuid
                ).unit_name,
              },
            };
        markers.value.push(marker);
      });
    }
  }
  loading.value = false;
};

const computedMarkerType = (p) => {
  if (p.notification_type_code === 1) {
    return "overspeed";
  } else if (p.notification_type_code === 4) {
    return "bridge";
  } else {
    return p.road_speed < 0
      ? "stopped"
      : p.road_speed === 0
        ? "idle"
        : "running";
  }
};

if (
  params.value.uuid &&
  params.value.date &&
  params.value.start &&
  params.value.end
) {

  const start = params.value.start.split(":");
  const end = params.value.end.split(":");
  const dateGood = new Date(params.value.date).toISOString().split('T')[0]
  const data = {
    unit: params.value.uuid,
    start: convertZonedToUTC(
      set(new Date(), {
        year: dateGood.split("-")[0],
        month: dateGood.split("-")[1] - 1,
        date: dateGood.split("-")[2],
        hours: start[0],
        minutes: start[1],
        seconds: start[2],
      })
    ),
    end: convertZonedToUTC(
      set(new Date(), {
        year: dateGood.split("-")[0],
        month: dateGood.split("-")[1] - 1,
        date: dateGood.split("-")[2],
        hours: end[0],
        minutes: end[1],
        seconds: end[2],
      })
    ),
  };
  getTelemetry(data);
}
</script>