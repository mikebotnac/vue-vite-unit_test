<template>
  <div v-if="!loading" class="w-full flex flex-col relative">
    <div
      v-if="loadingPage"
      class="
        absolute
        h-full
        w-full
        bg-darkblue bg-opacity-50
        z-[51]
        flex
        items-center
        justify-center
        duration-300
      "
    >
      <span class="text-2xl text-white">{{ t(`main_footer.Loading`) }}...</span>
    </div>
    <table class="flex-1 table-auto w-full mb-4 rounded-xl overflow-hidden">
      <thead class="bg-gray-500">
        <tr>
          <th scope="col" class="w-[175px]">
            <div class="header__item">
              <div class="header__item__top">
                <DateField v-model="filters.date" dateFormat="YYYY-MM-DD" />
              </div>
            </div>
          </th>
          <th scope="col" class="w-[150px]">
            <div class="header__item">
              <div class="header__item__top font-normal">
                <AutocompleteField
                  :placeholder="t('main_toolbar.Find a vehicle')"
                  :payload="filters.unit_name"
                  :options="userUnits"
                  @selected="(e) => (filters.unit_name = e)"
                />
              </div>
            </div>
          </th>
          <th scope="col">
            <div class="header__item">
              <div class="header__item__top"></div>
            </div>
          </th>
          <th scope="col" class="w-[150px]">
            <div class="header__item">
              <div class="header__item__top">
                <SignFilter
                  :options="['>']"
                  v-model:value="filters.speed_delta"
                />
              </div>
            </div>
          </th>
          <th scope="col" class="w-[150px]">
            <div class="header__item">
              <div class="header__item__top">
                <div v-if="ismaxfilter">
                  <p class="text-[#ff0000] text-[11px]">
                    * Maximum search value is 40
                  </p>
                </div>
              </div>
            </div>
          </th>
          <th scope="col" class="w-[100px]" colspan="2">
            <div class="header__item">
              <div class="header__item__top large-header">
                <ResetFilters @clicked="reset()" />
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
                <span>{{ t(`table_header.Date`) }} </span>
                <UpDownSelector
                  @updated="(e) => overspeedStore.sortOverspeeds('time', e)"
                />
              </div>
            </div>
          </th>
          <th scope="col">
            <div class="header__item">
              <div class="header__item__bottom">
                <span>{{ t(`table_header.Unit`) }}</span>
                <UpDownSelector
                  @updated="
                    (e) => overspeedStore.sortOverspeeds('unit_name', e)
                  "
                />
              </div>
            </div>
          </th>
          <th scope="col">
            <div class="header__item">
              <div class="header__item__bottom">
                <span>{{ t(`table_header.Speed Limiter`) }}</span>
                <UpDownSelector
                  @updated="
                    (e) => overspeedStore.sortOverspeeds('is_speed_enabled', e)
                  "
                />
              </div>
            </div>
          </th>

          <th scope="col" class="w-[150px]">
            <div class="header__item">
              <div class="header__item__bottom">
                <span>{{ t(`table_header.Over Allowed`) }}</span>
                <UpDownSelector
                  @updated="
                    (e) => overspeedStore.sortOverspeeds('over_allowed', e)
                  "
                />
              </div>
            </div>
          </th>
          <th scope="col" class="w-[190px]">
            <div class="header__item">
              <div class="header__item__bottom">
                <span>{{ t(`table_header.Allowed Speed Limit`) }}</span>
                <UpDownSelector
                  @updated="
                    (e) =>
                      overspeedStore.sortOverspeeds('allowed_speed_limit', e)
                  "
                />
              </div>
            </div>
          </th>
          <th scope="col" class="w-[100px] bg-darkgray">
            <div class="header__item">
              <div class="flex justify-center text-white bg-darkgray h-full">
                {{ t(`table_header.Map`) }}
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="relative">
        <template v-if="reportOverspeeds.length > 0">
          <tr
            v-for="(notif, index) in reportOverspeeds"
            :key="index"
            class="h-[38px]"
            :class="[index % 2 === 0 ? 'bg-white' : 'bg-gray']"
          >
            <td
              class="
                px-4
                py-2
                border-r-1 border-gray
                whitespace-nowrap
                font-light
              "
            >
              {{ format(new Date(notif.time), "dd/MM/yyyy") }}
              <span class="ml-5 mr-4">{{
                format(new Date(notif.time), "hh:mm:ss a")
              }}</span>
            </td>
            <td class="px-4 py-2 border-r-1 border-gray font-light">
              <span>{{ notif.unit_name }}</span>
            </td>
            <td class="px-4 py-2 border-r-1 border-gray font-light">
              <span>{{ notif.is_speed_enabled ? "Active" : "Inactive" }}</span>
            </td>
            <td class="px-4 py-2 border-r-1 border-gray">
              <KmhOrMph valueUnit="kph" :value="notif.over_allowed" />
            </td>
            <td class="px-4 py-2 border-r-1 border-gray font-light">
              <KmhOrMph valueUnit="kph" :value="notif.allowed_speed_limit" />
            </td>
            <td class="px-4 py-2 border-r-1 border-gray flex justify-center">
              <img
                src="../../../../../assets/icons/map/pins/pin-map.svg"
                class="cursor-pointer"
                @click="showOnMap(notif)"
              />
            </td>
          </tr>
        </template>
        <template v-else>
          <tr class="bg-white">
            <td colspan="6" class="p-4">
              {{ t(`messages.noOverspeed`) }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <TablePagination
      :currentPage="page"
      v-model:listLength="filters.limit"
      @prev-page="prevPage"
      @next-page="nextPage"
    />
  </div>
  <div v-else>
    <span>{{ t(`messages.Loading`) }}...</span>
  </div>
  <teleport to="#overspeed-button" v-if="displayExportButton">
    <Button @clicked="downloadCSV">
      <span>{{ t(`main_toolbar.Export Excel`) }} </span>
    </Button>
  </teleport>
</template>

<script setup>
import { computed, inject, nextTick, reactive, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useOverspeed } from "../../../../../stores/overspeeds";
import { addHours, format, fromUnixTime, set, addSeconds } from "date-fns";
import exportCSV from "../../../../../utils/export_csv";
import { debounce } from "lodash";
import { convertZonedToUTC } from "../../../../../utils/dates";
import { useTranslation } from "../../../../../composables/lang";
const { t, locale } = useTranslation();

const router = useRouter();
const overspeedStore = useOverspeed();
const loading = ref(false);
const loadingPage = ref(false);
const ismaxfilter = ref(false);
const overspeeds = computed(() => overspeedStore.overspeeds);
const sorts = computed(() => overspeedStore.report.sorts);
const reportOverspeeds = computed(() => overspeedStore.reportOverspeeds);
const pageInfos = computed(() => overspeedStore.report.pageInfos);
const displayExportButton = ref(false);

const userStore = inject("userStore");
const userUnits = computed(() => {
  return userStore.state.user.units
    ? userStore.state.user.units.data.map((u) => u.unit_name)
    : [];
});
const speedUnit = userStore.speedUnit.value;

const route = useRoute();
const fetchOverspeeds = async () => {
  await overspeedStore.fetchOverspeeds({ page: 1 });
};

const showOnMap = (overspeed) => {
  overspeedStore.setSelectedOverspeed(overspeed);
  nextTick(() => {
    router.push({
      name: "AnalyticsOverspeedMap",
    });
  });
};
const ready = ref(false);
const page = ref(1);
const filters = reactive({
  unit_name: null,
  unit_uuid: null,
  timestamp: null,
  date: null,
  speed_delta: null,
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
  filters.speed_delta = route.query.speed_delta ?? null;
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
  const end = filters.date
    ? addHours(start, 24)
    : filters.timestamp
    ? addSeconds(fromUnixTime(filters.timestamp), 1)
    : null;
  if (filters.timestamp && !filters.date) {
    filters.date = format(
      new Date(fromUnixTime(filters.timestamp)),
      "yyyy-MM-dd"
    );
  }
  await overspeedStore.fetchOverspeeds({
    unit: getUnitUUID(),
    start: start ? convertZonedToUTC(start) : null,
    end: end ? convertZonedToUTC(end) : null,
    overspeed_above: filters.speed_delta ? convertSpeedDelta() : null,
    limit: filters.limit ?? 25,
    page: page.value,
  });
  loading.value = false;
  ready.value = true;
  if (reportOverspeeds.value.length) {
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
const convertSpeedDelta = () => {
  if (filters.speed_delta < 40) {
    ismaxfilter.value = false;
    if (speedUnit === "mph") {
      return Math.round(filters.speed_delta / 0.621371);
    }
    return filters.speed_delta;
  } else {
    ismaxfilter.value = true;
    return (filters.speed_delta = 40);
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
  if (filters.speed_delta >= 40) {
    ismaxfilter.value = true;
    params.speed_delta = 40;
  }
  if (filters.speed_delta <= 40) {
    ismaxfilter.value = false;
  }
  return params;
};

const prevPage = async () => {
  router.push({
    name: "AnalyticsOverspeedReport",
    query: {
      ...processFiltersForURL(),
      page: +page.value - 1,
    },
  });
};
const nextPage = async () => {
  router.push({
    name: "AnalyticsOverspeedReport",
    query: {
      ...processFiltersForURL(),
      page: +page.value + 1,
    },
  });
};

const downloadCSV = () => {
  exportCSV(
    reportOverspeeds.value.map((o) => {
      var csvdata = {};
      csvdata.Date = o.local_time;
      csvdata.Unit = o.unit_name;
      csvdata.Speed_Limiter = o.is_speed_enabled;
      speedUnit === "kph"
        ? ((csvdata.Over_Allowed = Math.round(o.over_allowed*0.621371)),
          (csvdata.Allowed_Speed_limit = Math.round(o.allowed_speed_limit*0.621371)))
        : ((csvdata.Over_Allowed = o.over_allowed),
          (csvdata.Allowed_Speed_limit = o.allowed_speed_limit));
      return {
        ...csvdata,
      };
    }),
    "overspeed_filtered.csv"
  );
};

const fireServerEvent = async () => {
  router.push({
    name: "AnalyticsOverspeedReport",
    query: {
      ...processFiltersForURL(),
    },
  });
};
const debounced = debounce(fireServerEvent, 1000, false);
watch(filters, () => {
  if (ready.value) {
    debounced();
  }
});

const reset = () => {
  filters.unit_name = null;
  filters.unit_uuid = null;
  filters.timestamp = null;
  filters.date = null;
  filters.speed_delta = null;
  filters.limit = 25;
};

init();
</script>

<style lang="scss" scoped>
th {
  @apply text-left text-xs p-0;
}

tbody {
  overflow: scroll;
}

.header__item {
  @apply flex flex-col;

  .header__item__top {
    height: 58px;

    @apply bg-white p-2 flex justify-center items-center;
  }

  .header__item__bottom {
    height: 40px;

    @apply bg-darkgray py-3 px-4 font-bold text-white  flex justify-between items-center;

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