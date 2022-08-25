<template>
  <div class="flex justify-between items-center">
    <div class="flex-1 flex items-center">
      <div class="w-full mr-2 md:w-[200px]">
        <AutocompleteField
          ref="unitSelector"
          placeholder="Find a vehicle"
          :payload="unit_selected"
          :options="units"
          @selected="(e) => (unit_selected = e)"
        />
      </div>
      <Button
        class="md:ml-2 w-[100px]"
        :isDisabled="!unit_selected"
        :isLoading="props.isLoading"
        @click="search()"
      >
        <span>Search</span>
      </Button>
      <p class="text-orange text-xs">{{ props.error }}</p>
    </div>
    <div v-if="unit_selected" class="hidden md:block">
      <ResetFilters text="Reset limits" @clicked="reset()" />
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed } from "vue";
import router from "../../../../../router";

const props = defineProps({
  isLoading: Boolean,
  error: String,
  unitName: String,
});
const emit = defineEmits(["reset-limits"]);

const userStore = inject("userStore");
const error = ref("");

const units = computed(() => {
  return userStore.state.user.units.data.map((u) => u.unit_name) || [];
});
const unit_selected = ref("");

if (props.unitName) {
  unit_selected.value = props.unitName;
}

const search = () => {
  router.push({
    name: "VehiclesSettingsOne",
    params: {
      id: unit_selected.value,
    },
  });
};
/* 
const unitSelector = ref(null); */
const reset = () => {
  /* 
  unitSelector.value.reset(); */
  emit("reset-limits");
};
</script>