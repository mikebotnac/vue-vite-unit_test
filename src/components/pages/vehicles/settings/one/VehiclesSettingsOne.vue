<template>
  <div class="space-y-4">
    <Card>
      <template v-slot:content>
        <SingleVehicleSettingsForm
          :unitName="unitName"
          :isLoading="isLoading"
          :error="error"
          @reset-limits="resetLimits()"
        />
      </template>
    </Card>
    <VehicleSettingsCard
      ref="settingsCard"
      :disabled="!shadow"
      :deviceLimits="deviceLimits"
      :isImmobilized="isImmobilized"
      :isSpeedLimitEnabled="isSpeedLimitEnabled"
    />

    <div class="block flex justify-between md:hidden">
      <ResetFilters text="Reset limits" @clicked="resetLimits()" />
      <Button
        class="w-[90px]"
        :isDisabled="!shadow"
        :isLoading="isSaving"
        @clicked="save()"
      >
        <span>Save</span>
      </Button>
    </div>
  </div>

  <teleport to="#settings-btn" v-if="displaySaveBtn">
    <div class="hidden md:block">
      <Button
        class="w-[90px]"
        :isDisabled="!shadow"
        :isLoading="isSaving"
        @clicked="save()"
      >
        <span>{{ t(`main_toolbar.Save`) }}</span>
      </Button>
    </div>
  </teleport>
</template>


<script setup>
import { computed, inject, nextTick, ref, watch } from "vue";
import { useRoute } from "vue-router";
import searchDevice from "../../../../../api/search-device";
import updateShadow from "../../../../../api/shadow/update-shadow";
import { useTranslation } from "../../../../../composables/lang";
import router from "../../../../../router";

const { t, locale } = useTranslation();

/* data */

const unitName = ref();
const isSaving = ref(false);
const isLoading = ref(false);
const settingsDisabled = ref(true);
const shadow = ref();
const limits = ref({});
const route = useRoute();
const error = ref();
const responseData = ref();
const displaySaveBtn = ref(false);

const userStore = inject("userStore");
const user = computed(() => userStore.state.user);
const userSpeedUnit = userStore.speedUnit.value;

const zonesLimits = ref([]);
const isImmobilized = ref(false);
const isSpeedLimitEnabled = ref(false);

const deviceLimits = ref([]);

const transformZonesForApi = () => {
  const transformedZones = {};
  zonesLimits.value.forEach((z) => {
    transformedZones[z.value] = z.limit;
  });
  return transformedZones;
};

nextTick(() => {
  displaySaveBtn.value = true;
});

const notificationsStore = inject("notificationsStore");

/* functions */
const search = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const resp = await searchDevice({ search: [unitName.value] });
    if (resp.data && resp.data[0].last_shadow) {
      shadow.value = resp.data[0].last_shadow;
      deviceLimits.value = shadow.value.custom_limit[userSpeedUnit];
      settingsDisabled.value = false;
      isSpeedLimitEnabled.value = shadow.value.mcu_config.speed_limiter.enable;
      isImmobilized.value = shadow.value.mcu_config.speed_limiter.immobilize;
    }
  } catch (err) {
    notificationsStore.addNotification({
      type: "error",
      title: `Can't retrieve device ${unitName.value}`,
      content: "Please try later or contact support.",
    });
  } finally {
    isLoading.value = false;
  }
};
const settingsCard = ref(null);

const save = async () => {
  const { isImmobilized, isSpeedLimitEnabled, limits } =
    settingsCard.value.exportData();
  try {
    isSaving.value = true;
    const shadow_payload = {
      desired: {
        custom_limit: userSpeedUnit === "kmh" ? { kmh: limits} : { mph: limits },
        mcu_config: {
          speed_limiter: {
            enable: isSpeedLimitEnabled,
            immobilize: isImmobilized,
          }
        }
      }
    }
    await updateShadow({
      device_id: unitName.value,
      shadow: shadow_payload,
      serial: shadow.value.serial,
    });

    notificationsStore.addNotification({
      type: "success",
      title: `${t("vehicle.settings.success_title")}`,
      content: ` ${t("vehicle.settings.success")} ${unitName.value} `,
    });
  } catch (err) {
    notificationsStore.addNotification({
      type: "error",
      content: `${t('vehicle.settings.success')} ${unitName.value}. ${err.message}`,
    });
  } finally {
    isSaving.value = false;
  }
};

const resetLimits = () => {
  settingsCard.value.reset();
};

if (route && route.params && route.params.id) {
  unitName.value = route.params.id;
  search();
}
</script>