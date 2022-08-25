<template>
  <div class="flex flex-col h-full space-y-4">
    <Card>
      <template v-slot:content>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-[200px]">
              <AutocompleteField
                ref="unitSelector"
                placeholder="Find a vehicle"
                :payload="filters.unit"
                :options="userUnits.map((u) => u.unit_name)"
                @selected="(e) => (filters.unit = e)"
              />
            </div>
            <div class="w-[200px]">
              <DropdownSimple
                placeholder="Select a time"
                :options="[
                  t('DropdownSimple.Last Day'),
                  t('DropdownSimple.Last 7 days'),
                  t('DropdownSimple.Last 30 days'),
                ]"
                v-model="filters.range"
              />
            </div>
            <Button :isLoading="isLoading" @clicked="search()">
              <span>Search</span>
            </Button>
          </div>
          <div class="flex">
            <TotalNumber :count="count" />
            <ResetFilters @clicked="resetFilters()" />
          </div>
        </div>
      </template>
    </Card>
    <div class="flex-1">
      <Gmap :markers="markers" clustering renderer="bridge" />
    </div>
  </div>
</template>

<script setup>
import { computed, inject, reactive, watch, ref } from "vue-demi";
import { useGeofence } from "../../../../../stores/geofences";
import { useTranslation } from "../../../../../composables/lang";
import { format, sub } from "date-fns";
import tzlookup from "tz-lookup";
const { t } = useTranslation();
const userStore = inject("userStore");
const userUnits = computed(() => {
  return userStore.state.user.units.data || [];
});
const geofenceStore = useGeofence();
const geofences = computed(() => geofenceStore.map.geofences);

const markers = ref([]);
const count = ref(0);

const isLoading = computed(() => {
  return geofenceStore.map.loading;
});

const filters = reactive({
  unit: null,
  range: t("DropdownSimple.Last Day"),
  date_range: {
    start: null,
    end: null,
  },
});
watch(
  () => filters.range,
  (val) => {
    setDateRange(val);
  }
);
const createMarker = (geofence) => {
  markers.value.push({
    id: geofence.unit_name,
    type: "bridge",
    position: {
      lat: geofence.latitude,
      long: geofence.longitude,
    },
    timezone: tzlookup(geofence.latitude, geofence.longitude)?.replace("_", " "),
    local_time: geofence.local_time,
    data: {
      time: geofence.time,
      unit_name: geofence.unit_name,
      unit_uuid: geofence.unit_uuid,
      raw_data: geofence,
    },
  });
};

const setDateRange = (e) => {
  filters.date_range.end = new Date();
  switch (e) {
    case t("DropdownSimple.Last Day"):
      filters.date_range.start = sub(new Date(), { days: 1 });
      break;
    case t("DropdownSimple.Last 7 days"):
      filters.date_range.start = sub(new Date(), { weeks: 1 });
      break;
    case t("DropdownSimple.Last 30 days"):
      filters.date_range.start = sub(new Date(), { months: 1 });
      break;
    default:
      break;
  }
};

const resetFilters = () => {
  emit("reset");
  filters.unit = null;
  unitSelector.value.reset();
  filters.range = t("DropdownSimple.Last Day");
  filters.speed_delta_in_kmh = null;
  filters.date_range = {
    start: sub(new Date(), { days: 1 }),
    end: new Date(),
  };
};
setDateRange(filters.range);

const search = async () => {
  markers.value = [];
  setDateRange(filters.range);
  const payload = {
    start: format(filters.date_range.start, "yyyy-MM-dd'T'hh:mm:ss"),
    end: format(filters.date_range.end, "yyyy-MM-dd'T'hh:mm:ss"),
    limit: 2500,
    unit: filters.unit
      ? userUnits.value.filter((u) => u.unit_name === filters.unit)[0].unit_uuid
      : null,
  };
  await geofenceStore.fetchGeofences(payload, "map");
  geofences.value.forEach((geofence) => {
    createMarker(geofence);
  });
  count.value = geofences.value.length;
};

if (geofenceStore.map.selectedGeofence) {
  const geofence = geofenceStore.map.selectedGeofence;
  createMarker(geofence);
  geofenceStore.setSelectedGeofence(null);
  geofenceStore.map.loading = false;
  count.value = 1;
} else {
  geofenceStore
    .fetchGeofences(
      {
        limit: 2500,
        start: format(sub(new Date(), { days: 1 }), "yyyy-MM-dd'T'hh:mm:ss"),
        end: format(new Date(), "yyyy-MM-dd'T'hh:mm:ss"),
        unit: filters.unit
          ? userUnits.value.filter((u) => u.unit_name === filters.unit)[0]
              .unit_uuid
          : null,
      },
      "map"
    )
    .then(() => {
      geofences.value.forEach((geofence) => {
        createMarker(geofence);
      });
      count.value = geofences.value.length;
    });
}
</script>

<style lang='scss' scoped>
.left-50 {
  margin-left: 50%;
}
</style>