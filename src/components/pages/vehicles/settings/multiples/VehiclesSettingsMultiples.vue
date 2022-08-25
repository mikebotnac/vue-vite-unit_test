<template>
  <div class="space-y-4">
    <Card class="mb-4">
      <template v-slot:content>
        <MultiplesVehicleSettingsForm
          :isLoading="isLoading"
          @updated="updateUnitsSelected"
        />
      </template>
    </Card>

    <VehicleSettingsMultiCard
      ref="settingsCard"
      :disabled="settingsDisabled"
      :multiple="true"
      :deviceLimits="zonesLimits"
      :isSpeedLimitEnabled="isSpeedLimitEnabled"
    />

    <div class="block md:hidden">
      <Button
        class="w-[90px]"
        :isDisabled="!unitsSelected.filter((u) => u.selected).length"
        @clicked="save"
      >
        <span> {{ t(`main_toolbar.Save`) }} </span>
      </Button>
    </div>
  </div>
  <teleport
    to="#settings-btn"
    class="block text-right mt-4"
    v-if="displaySaveBtn"
  >
    <div class="hidden md:block">
      <Button
        :isDisabled="!unitsSelected.filter((u) => u.selected).length"
        :isLoading="isSaving"
        @clicked="save"
      >
        {{ t(`main_toolbar.Save`) }}
      </Button>
    </div>
  </teleport>
</template>

<script setup>
import { inject, computed, ref, nextTick, reactive } from "vue";
import updateShadows from "../../../../../api/shadow/update-shadows";
import { useTranslation } from "../../../../../composables/lang";

const { t } = useTranslation();
const userStore = inject("userStore");
const isSaving = ref(false);
const user = computed(() => userStore.state.user);
const userSpeedUnit = userStore.speedUnit.value;
const userUnits = computed(() => {
  return user.value.units.data;
});
const unitName = ref();
const zonesLimits = ref([]);
const notificationsStore = inject("notificationsStore");
const displaySaveBtn = ref(false);
const isLoading = ref(false);
const settingsCard = ref(null);
const responseData = ref();
const isSpeedLimitEnabled = ref(false);
nextTick(() => {
  displaySaveBtn.value = true;
});
const processZones = () => {
  const defaultZones =
    userSpeedUnit === "kmh"
      ? [20, 25, 30, 40, 50, 60, 70, 80, 90, 100]
      : [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
  const baseZones =
    userSpeedUnit === "kmh"
      ? user.value.settings.settings.speed_limit.kmh
      : user.value.settings.settings.speed_limit.mph;
  const zones = [];
  let i = 0;
  for (let zone in baseZones) {
    zones.push({
      value: defaultZones[i],
      label: `Zone ${zone} ${userSpeedUnit}`,
      limit: baseZones[zone],
    });
    i++;
  }
  zonesLimits.value = zones;
};
processZones();
const shadow = reactive({
  desired: {},
});

const save = async (e) => {
  const { isSpeedLimitEnabled, limits } = settingsCard.value.exportData();
  try {
    isSaving.value = true;
    const shadow_payload = {
      desired: {
        custom_limit:
          userSpeedUnit === "kmh" ? { kmh: limits } : { mph: limits },
        mcu_config: {
          speed_limiter: {
            enable: isSpeedLimitEnabled,
          },
        },
      },
    };
    await updateShadows({
      serials: unitsSelected.value.map((s) => {
        unitName.value = s;
        return userUnits.value.filter((u) => u.unit_name === s.unit)[0]
          .device_identifier;
      }),
      shadow: shadow_payload,
      user: user.value.email,
    });
    notificationsStore.addNotification({
      type: "success",
      title: `${t('vehicle.settings.success_title')}`,
      content: ` ${t('vehicle.settings.success')} ${unitName.value.unit} `,
    });
  } catch (err) {
    notificationsStore.addNotification({
      type: "error",
      title: `${t('vehicle.settings.failed_title')}`,
      content: `${t('vehicle.settings.failed')} ${unitName.value.unit}. ${err.response.data.message}`,
    });
  } finally {
    isSaving.value = false;
  }
};
const unitsSelected = ref([]);
const updateUnitsSelected = (units) => {
  unitsSelected.value = units;
};
const settingsDisabled = computed(() => {
  if (unitsSelected.value.length > 0) {
    return false;
  } else {
    return true;
  }
});
</script>