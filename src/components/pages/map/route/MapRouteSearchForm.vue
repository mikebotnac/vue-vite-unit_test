<template>
  <div class="flex items-center justify-between z-10 w-full">
    <div class="flex items-center justify-start">
      <div class="mr-2 w-full md:w-[200px]">
        <AutocompleteField
          ref="unitnameSelector"
          placeholder="Find a vehicle"
          :payload="filters.unit_name"
          :options="userUnits.map((u) => u.unit_name)"
          @selected="(e) => (filters.unit_name = e)"
        />
      </div>
      <div class="mr-2 w-[200px]">
        <DateField v-model="filters.date" dateFormat="YYYY-MM-DD" :isRanged="false" />
      </div>
      <div class="mr-2 w-[125px]">
        <DropdownSimple
          placeholder="Start time"
          optionLabel="label"
          :options="timeOptions"
          v-model="filters.start"
        />
      </div>
      <div class="mr-2 w-[125px]">
        <DropdownSimple
          placeholder="End time"
          optionLabel="label"
          :options="
            filters.start
              ? timeOptions.filter((o) => o.value > filters.start.value)
              : []
          "
          :isDisabled="!filters.start"
          v-model="filters.end"
        />
      </div>
      <Button
        class="ml-2 mr-2 w-[155px]"
        :isDisabled="!filtersValid"
        :isLoading="props.loading"
        @clicked="search()"
      >
        <span>View Itinary</span>
      </Button>
      {{ props.error }}
    </div>
    <ResetFilters @clicked="resetFilters" />
  </div>
</template>

<script setup>
import { reactive, ref, computed, inject, watch } from "vue";
import router from "../../../../router";
import hours from "../../../../utils/hours.js";

const props = defineProps({
  payload: Object,
  error: String,
  loading: Boolean,
});


const timeOptions = hours;
const filters = reactive({
  uuid: "",
  unit_name: "",
  date: "",
  start: "",
  end: "",
});

//Get the user store
const userStore = inject("userStore");
//Get units of the user
const userUnits = computed(() => {
  if (userStore.state.user.units) {
    return userStore.state.user.units.data;
  }
  return [];
});
const unitSelected = ref();

if (props.payload) {
  filters.uuid = props.payload.uuid;
  filters.date = props.payload.date;
  filters.start = timeOptions.filter((h) => h.value === props.payload.start)[0];
  filters.end = timeOptions.filter((h) => h.value === props.payload.end)[0];
}

if (filters.uuid) {
  const correspondingUnit = userUnits.value.filter(
    (u) => u.unit_uuid === filters.uuid
  );
  if (correspondingUnit.length !== 0) {
    unitSelected.value = correspondingUnit[0];
    filters.unit_name = correspondingUnit[0].unit_name;
  }
}

const unitnameSelector = ref(null);
//Reset filters
const resetFilters = () => {
  router.push({
    name: "MapRoutes",
  });
};

const filtersValid = computed(() => {
  if (filters.uuid && filters.date && filters.start && filters.end) {
    return true;
  } else {
    return false;
  }
});

watch(
  () => filters.unit_name,
  (val) => {
    if (val) {
      filters.uuid = userUnits.value.filter(
        (u) => u.unit_name === filters.unit_name
      ).length
        ? (filters.uuid = userUnits.value.filter(
          (u) => u.unit_name === filters.unit_name
        )[0].unit_uuid)
        : null;
    } else {
      filters.uuid = null;
    }
  },
  { deep: true }
);
const search = () => {
  router.push({
    name: "MapRoutes",
    params: {
      uuid: filters.uuid,
    },
    query: {
      date: filters.date,
      start: filters.start.value,
      end: filters.end.value,
    },
  });
};
</script>

<style lang="scss">
.reset {
  @apply text-xs flex cursor-pointer;

  &:hover {
    @apply text-blue;

    svg {
      g {
        fill: blue;
      }
    }
  }
}
</style>