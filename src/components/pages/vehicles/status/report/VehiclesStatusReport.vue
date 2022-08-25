<template>
  <div v-if="!loading" class="w-full h-full flex flex-col">
    <table class="flex-1 table-auto w-full mb-4 rounded-xl overflow-hidden">
      <thead class="bg-gray-500">
        <tr>
          <th scope="col" class="w-[210px]">
            <div class="header__item">
              <div class="header__item__top">
                <AutocompleteField
                  ref="unitSelector"
                  placeholder="Find a vehicle"
                  :payload="filters.unit"
                  :options="userUnits"
                  @selected="(e) => (filters.unit = e)"
                />
              </div>
              <div class="header__item__bottom">
                {{ t(`table_header.Unit`) }}
                <UpDownSelector @updated="setSort('unit_name')" />
              </div>
            </div>
          </th>
          <th scope="col">
            <div class="header__item">
              <div class="header__item__top"></div>
              <div class="header__item__bottom">
                {{ t(`table_header.Power`) }}
                <UpDownSelector @updated="setSort('isPowered')" />
              </div>
            </div>
          </th>
          <th scope="col">
            <div class="header__item">
              <div class="header__item__top"></div>
              <div class="header__item__bottom">
                {{ t(`table_header.Speed Limiter`) }}
                <UpDownSelector @updated="setSort('isSpeedLimited')" />
              </div>
            </div>
          </th>
          <th scope="col">
            <div class="header__item">
              <div class="header__item__top"></div>
              <div class="header__item__bottom">
                {{ t(`table_header.Immobilized`) }}
                <UpDownSelector @updated="setSort('isImmobilized')" />
              </div>
            </div>
          </th>
          <th scope="col">
            <div class="header__item">
              <div class="header__item__top"></div>
              <div class="header__item__bottom flex justify-around">
                <span v-for="range in goodRange" :key="range">
                  {{ range }}
                </span>
              </div>
            </div>
          </th>
          <th scope="col" class="border-r-1 border-gray">
            <div class="header__item">
              <div class="header__item__top">
                <ResetFilters @clicked="resetFilters" />
              </div>
              <div class="header__item__bottom">
                {{ t(`table_header.Analytics`) }}
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(device, index) in sortedDevices.filter((d) =>
            filters.unit ? filters.unit === d.unit_name : true
          )"
          :key="device.device_identifier"
          :class="[index % 2 === 0 ? 'bg-white' : 'bg-gray', 'h-[38px]']"
        >
          <td class="px-4 border-r-1 border-gray flex items-center h-[38px]">
            <router-link
              class="font-normal underline"
              :to="{
                name: 'VehiclesSettingsOne',
                params: { id: device.unit_name },
              }"
            >
              {{ device.unit_name }}
            </router-link>
          </td>
          <td class="text-left px-4 border-r-1 border-gray">
            {{ device.isPowered ? "On" : "Off" }}
          </td>
          <td class="text-left px-4 border-r-1 border-gray">
            {{ device.isSpeedLimited ? "Active" : "Inactive" }}
          </td>
          <td class="text-left px-4 border-r-1 border-gray">
            {{ device.isImmobilized ? "Yes" : "-" }}
          </td>
          <td class="border-r-1 border-gray">
            <div class="flex justify-between px-4">
              <span
                v-for="limit in device.last_shadow.custom_limit[userSpeedUnit]"
                :key="limit"
                >{{ limit }}
              </span>
            </div>
          </td>
          <td class="icons_container h-[38px]">
            <!-- Link to bridge collision report -->
            <router-link
              :to="{
                name: 'AnalyticsBridgeReport',
                query: {
                  unit_name: device.unit_name,
                  unit_uuid: device.unit_uuid,
                },
              }"
            >
              <img
                src="../../../../../assets/icons/bridge-round.png"
                alt=""
              />
            </router-link>
            <!-- Link to overspeed report -->
            <router-link
              :to="{
                name: 'AnalyticsOverspeedReport',
                query: {
                  unit_name: device.unit_name,
                  unit_uuid: device.unit_uuid,
                },
              }"
            >
              <img
                src="../../../../../assets/icons/icon-overspeed-round.png"
                alt=""
              />
            </router-link>
            <!-- Link to vehicle locator -->
            <router-link
              :to="{ name: 'MapVehicules', params: { id: device.unit_name } }"
            >
              <img src="../../../../../assets/icons/icon-map.png" alt="" />
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <span v-if="!sortedDevices.length && !loading">
      {{ t(`messages.no vehicles`) }}
      <span class="text-blue cursor-pointer" @click="resetFilters">
        {{ t(`messages.reset them`) }} </span
      >.
    </span>
    <TablePagination
      :nextDisabled="!sortedDevices.length"
      :currentPage="currentPage"
      v-model:listLength="filters.limit"
      @next-page="nextPage"
      @prev-page="prevPage"
    />
  </div>
  <div v-else>
    <span>{{ t(`messages.Loading`) }}...</span>
  </div>
</template>

<script setup>
import { watch, inject, computed, reactive, ref } from "vue";
import { sortByAZ, sortByZA } from "../../../../../utils/sort";
import searchDevice from "../../../../../api/search/search_device";
import { differenceInDays } from "date-fns";
import { debounce } from "lodash";
import TablePagination from "../../../../commons/tables/TablePagination.vue";
import { useTranslation } from "../../../../../composables/lang";
const { t, locale } = useTranslation();

const sortedDevices = ref([]);

const loading = ref(false);

const userStore = inject("userStore");
const user = computed(() => {
  return userStore.state.user;
});
const userSpeedUnit = userStore.speedUnit.value;
const userUnits = computed(() => {
  if (userStore.state.user.units)
    return userStore.state.user.units.data.map((u) => u.unit_name) || [];
  return [];
});

const ranges = {
  kmh: [20, 25, 30, 40, 50, 60, 70, 80, 90, 100],
  mph: [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
};

const goodRange = ranges[userSpeedUnit];

const sort = reactive({
  unit_name: "",
  isPowered: "",
  isSpeedLimited: "",
  isImmobilized: "",
});

const currentPage = ref(1);
const filters = reactive({
  unit: "",
  range: {
    limit: null,
    comp: null,
    value: null,
  },
  limit: 25,
});

const getDevices = async ({ page = 1, unit = null, advancedSearch = null }) => {
  const resp = await searchDevice({
    page: page,
    limit: filters.limit,
    search: unit ? [unit] : null,
    advanced_search: advancedSearch ? [advancedSearch] : null,
  });
  sortedDevices.value = resp.data.map((d) => {
    return {
      ...d,
      isPowered:
        differenceInDays(
          new Date(),
          new Date(d.last_tracking.timestamp * 1000)
        ) <= 2
          ? true
          : false,
      isSpeedLimited: d.last_shadow.mcu_config.speed_limiter.enable,
      isImmobilized: d.last_shadow.mcu_config.speed_limiter.immobilize,
    };
  });
  currentPage.value = page;
};

const init = async () => {
  loading.value = true;
  await getDevices({ page: 1 });
  loading.value = false;
};

init();

const nextPage = async () => {
  getDevices({
    page: currentPage.value + 1,
    advancedSearch:
      filters.range.limit && filters.range.comp && filters.range.value
        ? `custom_limit.${userSpeedUnit}.${filters.range.limit} ${filters.range.comp} ${filters.range.value}`
        : null,
  });
};
const prevPage = async () => {
  getDevices({
    page: currentPage.value - 1,
    advancedSearch:
      filters.range.limit && filters.range.comp && filters.range.value
        ? `custom_limit.${userSpeedUnit}.${filters.range.limit} ${filters.range.comp} ${filters.range.value}`
        : null,
  });
};

const unitSelector = ref(null);
const resetFilters = () => {
  filters.unit = null;
  unitSelector.value.reset();
  filters.range = {
    limit: null,
    comp: null,
    value: null,
  };
};
const setSort = (column) => {
  sort[column] = sort[column] === "AZ" ? "ZA" : "AZ";
  sortedDevices.value =
    sort[column] === "AZ"
      ? sortByAZ(sortedDevices.value, column)
      : sortByZA(sortedDevices.value, column);
};

// ? Use to filter each 500ms in debounce mode
const fireFilterEvent = async () => {
  await getDevices({
    unit: filters.unit,
    advancedSearch:
      filters.range.limit && filters.range.comp && filters.range.value
        ? `custom_limit.${userSpeedUnit}.${filters.range.limit} ${filters.range.comp} ${filters.range.value}`
        : null,
  });
};
const debounced = debounce(fireFilterEvent, 500, false);
watch(filters, () => {
  debounced();
});
</script>

<style lang='scss' scoped>
.icons_container {
  @apply flex items-center justify-around;

  img {
    height: 20px;
  }
}

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

    @apply bg-darkgray py-3 px-4 font-bold text-white  flex justify-between items-center;

    span {
      @apply whitespace-nowrap;
    }
  }
}
</style>