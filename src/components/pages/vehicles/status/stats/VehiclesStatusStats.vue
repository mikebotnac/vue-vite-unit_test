<template>
  <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card>
      <template v-slot:title>
        <span>{{ t(`Vehicle Status.Units`) }}</span>
      </template>
      <template v-slot:content>
        <div class="flex flex-row justify-between">
          <div class="flex flex-col space-y-3 justify-center m-auto">
            <span class="text-xs"
              >{{ t(`Vehicle Status.Total vehicle`) }}: {{ vehicleData.totalVehicle }}
            </span>
            <span class="text-xs">
              {{ t(`Vehicle Status.Connected vehicle`) }}:
              {{ vehicleData.activeVehicles }}
            </span>
            <span class="text-xs">
              {{ t(`Vehicle Status.Not connected vehicle`) }}:
              {{ vehicleData.inactiveVehicles }}
            </span>
          </div>
          <div class="relative">
            <span class="inside_legend flex-col flex items-center text-xs font-bold">
              {{ t(`Vehicle Status.Active`) }}
              <span class="bold text-blue text-[24px] font-bold mt-3">
                {{
                  Math.round(
                    (vehicleData.activeVehicles / vehicleData.totalVehicle) *
                      100
                  )
                }}
                %
              </span>
            </span>
            <canvas
              id="activeUnitsChart"
              ref="activeUnitsChartCtx"
              width="250"
              height="250"
            >
            </canvas>
          </div>
        </div>
      </template>
    </Card>
    <Card>
      <template v-slot:title>
        <span>{{ t(`Vehicle Status.E-smart Speed Limiter`) }}</span>
      </template>
      <template v-slot:content>
        <div class="flex flex-row justify-between">
          <div class="flex flex-col space-y-3 justify-center m-auto">
            <span class="text-xs"
              >{{ t(`Vehicle Status.Connected vehicle`) }}: {{ vehicleData.activeVehicles }}</span
            >
            <span class="text-xs">
              {{ t(`Vehicle Status.Active Speed Limiter`) }}:
              {{ vehicleData.speedLimiterActive }}
            </span>
            <span class="text-xs">
              {{ t(`Vehicle Status.Inactive Speed Limit`) }}:
              {{ vehicleData.speedLimiterInactive }}
            </span>
          </div>
          <div class="relative">
            <span class="inside_legend flex-col flex items-center text-center text-xs font-bold">
              {{ t(`Vehicle Status.Active`) }} <br />
              {{ t(`Vehicle Status.Speed Limiter`) }}
              <span class="bold text-blue text-[24px] font-bold mt-3">
                {{
                  Math.round(
                    (vehicleData.speedLimiterActive /
                      vehicleData.activeVehicles) *
                      100
                  )
                }}
                %
              </span>
            </span>
            <canvas
              id="activeSpeedsChart"
              ref="activeSpeedsChartCtx"
              width="250"
              height="250"
            ></canvas>
          </div>
        </div>
      </template>
    </Card>
  </div>
  <div v-else>
    <span>{{ t(`messages.Loading`) }}...</span>
  </div>
</template>

<script setup>
import { nextTick, ref } from "vue";
import Chart from "chart.js/auto";
import vehicle_stats from "../../../../../api/vehicle.stats";
import { useTranslation } from "../../../../../composables/lang";
const { t, locale } = useTranslation();
const loading = ref(false);
const activeUnitsChartCtx = ref(null);
const activeSpeedsChartCtx = ref(null);
const vehicleData = ref({});

const getStats = async () => {
  loading.value = true;
  const { data } = await vehicle_stats();
  loading.value = false;
  nextTick(() => {
    initCharts(data);
  });
};

const initCharts = (data) => {
  vehicleData.value.totalVehicle = data.total_count;
  vehicleData.value.activeVehicles = data.active_count;
  vehicleData.value.inactiveVehicles = data.inactive_count;
  vehicleData.value.speedLimiterActive = data.speed_limit_active_count;
  vehicleData.value.speedLimiterInactive = data.speed_limit_inactive_count;
  const ctxActives = activeUnitsChartCtx.value.getContext("2d");
  new Chart(ctxActives, {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [data.active_count, data.inactive_count],
          backgroundColor: ["#006bff", "#399cff"],
        },
      ],
    },
  });
  const ctxSpeeds = activeSpeedsChartCtx.value.getContext("2d");
  new Chart(ctxSpeeds, {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [
            data.speed_limit_active_count,
            data.speed_limit_inactive_count,
          ],
          backgroundColor: ["#006bff", "#399cff"],
        },
      ],
    },
  });
};

getStats();
</script>

<style lang="scss" scoped>
.inside_legend {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
