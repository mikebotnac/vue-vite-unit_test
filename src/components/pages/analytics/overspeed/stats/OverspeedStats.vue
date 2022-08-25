<template>
  <Card>
    <template v-slot:content>
      <div class="overspeed__stats__top">
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center space-x-2">
            <div class="w-[200px]">
              <AutocompleteField
                ref="unitSelector"
                placeholder="Find a vehicle"
                :payload="filters.unitSelected"
                :options="userUnits.map((u) => u.unit_name)"
                @selected="(e) => (filters.unitSelected = e)"
              />
            </div>
            <div>
              <DropdownSimple
                placeholder="Select range"
                :options="[
                  t('DropdownSimple.Last 7 days'),
                  t('DropdownSimple.Last 14 days'),
                  t('DropdownSimple.Last 30 days'),
                ]"
                v-model="filters.range"
              />
            </div>

            <Button :isLoading="loading" @clicked="search">
              <span>Search</span>
            </Button>
          </div>
          <div class="flex space-x-6">
            <Toggle
              class="hidden md:flex"
              :text="'Device active'"
              v-model="Device_Status"
            />
            <ResetFilters @clicked="reset" />
          </div>
        </div>
      </div>
    </template>
  </Card>

  <!-- <div
    class="
      overspeed__stats__bottom
      p-[20px]
      h-[38px]
      bg-blue
      flex
      items-center
      justify-between
    "
  >
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center space-x-2">
        <div class="space-x-2">
          <span class="text-xs text-white font-bold">Vehicle </span>
          <span class="text-xs text-white font-bold"
            >{{ filters.unitSelected }}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <img
            class="mr-2"
            src="../../../../../assets/icons/arrow-right.png"
            alt=""
          />
        </div>
        <div>
          <span class="text-xs text-white font-bold">Mileage</span>
          <span class="text-xs text-white font-bold"
            >&nbsp;&nbsp;{{ distance }}</span
          >
        </div>
      </div>
    </div>
  </div> -->
  <div class="overspeed__stats__table">
    <OverspeedStatsTable v-if="stats.length" :statistics="stats" />
    <p class="mt-5 text-center font-bold" v-if="!loading && !stats.length">
      There is no data corresponding
    </p>
  </div>
</template>

<script setup>
import { inject, computed, ref, reactive, watch } from "vue";
import { useOverspeed } from "../../../../../stores/overspeeds.js";
import { useTranslation } from "../../../../../composables/lang";
const Device_Status = ref(true);
const { t } = useTranslation();
const userStore = inject("userStore");
const user = computed(() => userStore.state.user);
const userUnits = computed(() => user.value.units.data);
const overspeedStore = useOverspeed();
const loading = computed(() => overspeedStore.stats.loading);
const stats = computed(() => overspeedStore.stats.stats);
const distance = computed(() => overspeedStore.stats.distance);
import { sub } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
const filters = reactive({
  unitSelected: null,
  range: t("DropdownSimple.Last 7 days"),
});

const roundMinutes = (date) => {
  date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
  date.setMinutes(0, 0, 0); // Resets also seconds and milliseconds

  return date;
};
const search = async () => {
  let data = {
    unit: filters.unitSelected
      ? userUnits.value.filter((u) => u.unit_name === filters.unitSelected)[0]
          .unit_uuid
      : null,
    speed_unit: userStore.speedUnit.value,
    speed_enabled: Device_Status.value,
  };
  if (filters.range) {
    data = {
      ...data,
      start: formatInTimeZone(
        roundMinutes(setDateRange(filters.range).start),
        "America/New_York",
        `yyyy-MM-dd'T'HH:mm:ss`
      ),
      end: formatInTimeZone(
        roundMinutes(setDateRange(filters.range).end),
        "America/New_York",
        `yyyy-MM-dd'T'HH:mm:ss`
      ),
    };
  }
  overspeedStore.fetchOverspeedsStats(data);
};

const unitSelector = ref(null);
const reset = () => {
  filters.unitSelected = null;
  filters.range = t("DropdownSimple.Last 7 days");
  unitSelector.value.reset();
  overspeedStore.fetchOverspeedsStats({
    speed_unit: userStore.speedUnit.value,
    start: formatInTimeZone(
      roundMinutes(setDateRange(filters.range).start),
      "America/New_York",
      `yyyy-MM-dd'T'HH:mm:ss`
    ),
    end: formatInTimeZone(
      roundMinutes(setDateRange(filters.range).end),
      "America/New_York",
      `yyyy-MM-dd'T'HH:mm:ss`
    ),
  });
};
const setDateRange = (e) => {
  switch (e) {
    case t("DropdownSimple.Last 7 days"):
      return {
        start: sub(new Date(), { days: 7 }),
        end: new Date(),
      };
    case t("DropdownSimple.Last 14 days"):
      return {
        start: sub(new Date(), { days: 14 }),
        end: new Date(),
      };
    case t("DropdownSimple.Last 30 days"):
      return {
        start: sub(new Date(), { days: 30 }),
        end: new Date(),
      };
    default:
      break;
  }
};

overspeedStore.fetchOverspeedsStats({
  speed_unit: user.value.settings.speedUnit === "KPH" ? "kmh" : "mph",
  start: formatInTimeZone(
    roundMinutes(setDateRange(t("DropdownSimple.Last 7 days")).start),
    "America/New_York",
    `yyyy-MM-dd'T'HH:mm:ss`
  ),
  end: formatInTimeZone(
    roundMinutes(setDateRange(t("DropdownSimple.Last 7 days")).end),
    "America/New_York",
    `yyyy-MM-dd'T'HH:mm:ss`
  ),
});
</script>


<style lang="scss" scoped>
.overspeed__stats {
  @apply shadow bg-white rounded-lg;
}

.overspeed__stats__top {
  @apply flex items-center justify-between;
}

.overspeed__stats__stats {
  @apply bg-blue px-6 py-3;
}
</style>