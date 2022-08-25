<template>
  <div v-if="!loading">
    <table class="flex-1 table-auto w-full mb-4 rounded-xl overflow-hidden">
      <thead class="bg-gray-500">
        <tr>
          <th scope="col" class="w-[200px]">
            <div class="header__item">
              <div class="header__item__top">
                <DateField
                  v-model="filters.date"
                  :isRanged="false"
                  dateFormat="YYYY-MM-DD"
                />
              </div>
            </div>
          </th>
          <th scope="col" class="w-[200px]">
            <div class="header__item">
              <div class="header__item__top">
                <AutocompleteField
                  ref="unitSelector"
                  :placeholder="t('main_toolbar.Find a vehicle')"
                  :payload="filters.unit_name"
                  :options="userUnits"
                  @selected="(e) => (filters.unit_name = e)"
                />
              </div>
            </div>
          </th>
          <th scope="col" class="w-[100px]" colspan="2">
            <div class="header__item">
              <div class="header__item__top cursor-pointer large-header">
                <ResetFilters @clicked="resetFilter()" />
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <thead class="bg-gray-500">
        <tr>
          <th scope="col">
            <div class="header__item">
              <div class="header__item__bottom">
                <span>{{ t(`table_header.Date`) }}</span>
                <UpDownSelector
                  @updated="(e) => geofenceStore.sortGeofences('time', e)"
                />
              </div>
            </div>
          </th>
          <th scope="col">
            <div class="header__item">
              <div class="header__item__bottom">
                <span>{{ t(`table_header.Unit`) }}</span>
                <UpDownSelector
                  @updated="(e) => geofenceStore.sortGeofences('unit_name', e)"
                />
              </div>
            </div>
          </th>
          <th scope="col">
            <div class="header__item">
              <div class="header__item__bottom">
                <span>{{ t(`table_header.Details`) }}</span>
              </div>
            </div>
          </th>
          <th scope="col" class="border-r-1 border-gray w-[80px]">
            <div class="header__item">
              <div class="header__item__bottom center">
                <span>{{ t(`table_header.Map`) }}</span>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="geofences.length > 0">
          <tr
            v-for="(notif, index) in geofences"
            :key="index"
            class="h-[38px]"
            :class="[index % 2 === 0 ? 'bg-white' : 'bg-gray']"
          >
            <td class="px-4 border-r-1 border-gray">
              {{ format(new Date(notif.time), "dd/MM/yyyy") }}
              <span class="ml-5 mr-4">{{
                format(new Date(notif.time), "hh:mm:ss a")
              }}</span>
            </td>
            <td class="px-4 border-r-1 border-gray">{{ notif.unit_name }}</td>
            <td class="px-4 border-r-1 border-gray">{{ notif.details }}</td>
            <td
              class="
                flex
                justify-center
                px-4
                h-[38px]
                items-center
                border-r-1 border-gray
                cursor-pointer
              "
              @click="showOnMap(notif)"
            >
              <img src="../../../../../assets/icons/map/pins/pin-map.svg" alt />
            </td>
          </tr>
        </template>
        <template v-else>
          <tr class="bg-white">
            <td colspan="4" class="p-4">
              {{ t(`messages.no Bridge`) }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <TablePagination
      :currentPage="page"
      :nextDisabled="!geofences.length"
      v-model:listLength="filters.limit"
      @prev-page="prevPage"
      @next-page="nextPage"
    />
  </div>
  <div v-else>{{ t(`messages.Loading`) }}...</div>
  <teleport to="#bcp-button" v-if="displayExportButton">
    <Button :disabled="!geofences.length" @clicked="downloadCSV">
      <span>{{ t(`main_toolbar.Export Excel`) }}</span>
    </Button>
  </teleport>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, computed, watch, inject, reactive } from "vue";
import { format, fromUnixTime, set, addDays } from "date-fns";
import { useGeofence } from "../../../../../stores/geofences";
import exportCSV from "../../../../../utils/export_csv";
import { debounce } from "lodash";
import { convertZonedToUTC } from "../../../../../utils/dates";
import { useTranslation } from "../../../../../composables/lang";
const { t } = useTranslation();
const router = useRouter();
const route = useRoute();
const geofenceStore = useGeofence();
const geofences = computed(() => geofenceStore.report.sortedGeofences);
const userStore = inject("userStore");
const userUnits = computed(() => {
  return userStore.state.user.units
    ? userStore.state.user.units.data.map((u) => u.unit_name)
    : [];
});
const displayExportButton = ref(false);
const loading = ref(false);

const ready = ref(false);
const page = ref(1);
const filters = reactive({
  unit_name: null,
  unit_uuid: null,
  timestamp: null,
  date: {
    start: null,
  },
  limit: 25,
});

const init = async () => {
  ready.value = false;
  displayExportButton.value = false;
  loading.value = true;
  filters.unit_uuid = route.query.unit_uuid ?? null;
  filters.unit_name = route.query.unit_name ?? null;
  filters.timestamp = route.query.time ?? null;
  filters.date = route.query.date ?? null;
  filters.limit = route.query.limit ?? 25;
  page.value = route.query.page ?? 1;
  const start = filters.date
    ? set(new Date(filters.date.split("-").join(",")), {
        hours: 0,
        minutes: 0,
        seconds: 0,
      })
    : filters.timestamp
    ? fromUnixTime(filters.timestamp)
    : null;
  if (filters.timestamp && !filters.date?.start) {
    filters.date = format(new Date(fromUnixTime(filters.timestamp)), "yyyy-MM-dd");
  }
  await geofenceStore.fetchGeofences({
    unit: getUnitUUID(),
    start: start ? convertZonedToUTC(start) : null,
    end: start ? convertZonedToUTC(addDays(start, 1)) : null,
    limit: filters.limit ?? 25,
    page: page.value,
  });
  loading.value = false;
  ready.value = true;
  if (geofences.value.length) {
    setTimeout(() => {
      displayExportButton.value = true;
    });
  }
};
const getUnitUUID = () => {
  if (filters.unit_uuid) {
    return filters.unit_uuid;
  }
  if (filters.unit_name) {
    const unit = userStore.state.user.units.data.find(
      (u) => u.unit_name === filters.unit_name
    );
    return unit.unit_uuid ?? null;
  }
};
const processFiltersForURL = () => {
  const params = {};
  for (let key in filters) {
    if (filters[key]) {
      params[key] = filters[key];
    }
  }
  if (params.unit_name && !params.unit_uuid) {
    params.unit_uuid = getUnitUUID();
  }
  return params;
};

init();

const unitSelector = ref(null);
const resetFilter = () => {
  filters.unit_name = null;
  filters.unit_uuid = null;
  filters.timestamp = null;
  filters.date = null;
  filters.limit = 25;
};

const showOnMap = (geofence) => {
  geofenceStore.setSelectedGeofence(geofence);
  router.push({
    name: "AnalyticsBridgeMap",
  });
};

// ? Use to filter each 500ms in debounce mode
const fireFilterEvent = async () => {
  router.push({
    name: "AnalyticsBridgeReport",
    query: {
      ...processFiltersForURL(),
    },
  });
};
const debounced = debounce(fireFilterEvent, 500, false);
watch(filters, () => {
  if (ready.value) {
    debounced();
  }
});

const prevPage = async () => {
  router.push({
    name: "AnalyticsBridgeReport",
    query: {
      ...processFiltersForURL(),
      page: +page.value - 1,
    },
  });
};
const nextPage = async () => {
  router.push({
    name: "AnalyticsBridgeReport",
    query: {
      ...processFiltersForURL(),
      page: +page.value + 1,
    },
  });
};
const downloadCSV = () => {
  exportCSV(geofences.value, "geofences_filtered.csv");
};
</script>

<style lang="scss" scoped>
th {
  @apply text-left text-xs p-0;
}

.header__item {
  @apply flex flex-col;

  .header__item__top {
    height: 58px;

    @apply bg-white p-2 flex justify-center items-center;
  }

  .header__item__bottom {
    height: 40px;

    @apply bg-darkgray py-3 px-4 text-white  flex justify-between items-center;

    &.center {
      @apply justify-center;
    }

    span {
      @apply whitespace-nowrap;
    }
  }

  .large-header {
    justify-content: end;
    padding-right: 12px;
  }
}
</style>