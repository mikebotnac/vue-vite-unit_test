<template>
  <div class="flex items-center justify-start space-x-4">
    <div class="w-[190px]">
      <SelectMultipleSearchField
        v-if="units.length"
        :placeholder="
          unitsSelected.filter((u) => u.selected).length
            ? 'Unselect vehicles'
            : 'Select many vehicles'
        "
        :options="units"
        @updated="update"
      />
    </div>
  </div>
</template>

<script>
import { inject, computed, ref, watch } from "vue";
export default {
  props: {
    isLoading: Boolean,
  },
  emits: ["updated"],
  setup(props, { emit }) {
    const userStore = inject("userStore");
    //Get units of the user
    const units = computed(() => {
      if (userStore.state.user.units)
        return (
          userStore.state.user.units.data.map((u) => {
            return { unit: u.unit_name };
          }) || []
        );
    });
    const unitsSelected = ref([]);
    const loading = ref(false);
    const update = (e) => {
      unitsSelected.value = e.value;
    };
    watch(
      () => unitsSelected.value,
      () => {
        emit(
          "updated",
          unitsSelected.value.filter((u) => u.selected)
        );
      },
      { deep: true }
    );
    return { props, units, unitsSelected, update };
  },
};
</script>