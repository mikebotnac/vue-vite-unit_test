<template>
  <div class="flex flex-1 md:flex-0 items-start space-x-3">
    <div class="w-full md:w-[200px]">
      <AutocompleteField
        :payload="unitSelected"
        placeholder="Find a vehicle"
        :options="userUnits"
        @selected="ici"
      />
    </div>

    <Button
      class="w-auto"
      :isDisabled="!unitSelected"
      :isLoading="props.loading"
      @clicked="search()"
    >
      <span>Locate</span>
    </Button>
    <template class="hidden md:block">
      <Button :isDisabled="!unitSelected" @clicked="openSettings()">
        <span>View vehicle settings</span>
      </Button>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, watch, inject } from "vue";
import { useRoute } from "vue-router";
import router from "../../../../router";

const props = defineProps({
  unitName: String,
  loading: Boolean,
  error: String,
});
const emit = defineEmits(["reload-location"]);

//Get the user store
const userStore = inject("userStore");
//Get units of the user
const userUnits = computed(() => {
  return (
    (userStore.state.user.units &&
      userStore.state.user.units.data.map((u) => u.unit_name)) ||
    []
  );
});

//Unit selected from the dropdwon
const unitSelected = ref("");
const route = useRoute();

const unitName = computed(() => {
  return props.unitName;
});
if (unitName.value) {
  unitSelected.value = unitName.value;
}
const search = async () => {
  if (unitSelected.value) {
    if (unitSelected.value === route.params.id) {
      emit("reload-location");
    } else {
      router.push({
        name: "MapVehicules",
        params: { id: unitSelected.value },
      });
    }
  }
};

const openSettings = () => {
  router.push({
    name: "VehiclesSettingsOne",
    params: { id: unitSelected.value },
  });
};

const ici = (e) => {
  unitSelected.value = e;
};
</script>