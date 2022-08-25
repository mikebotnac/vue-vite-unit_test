<template>
  <div>
    <div class="mt-1 relative rounded-md shadow-sm">
      <div
        class="
          absolute
          inset-y-0
          left-0
          flex
          items-center
          rounded-tl rounded-bl
          border-r-1 border-lightgray
        "
      >
        <label for="country" class="sr-only">Sign</label>
        <select
          id="country"
          name="country"
          class="
            h-full
            w-auto
            py-0
            pl-2
            pr-2
            border-transparent
            bg-transparent
            text-gray-500
            sm:text-sm
            rounded
          "
          v-model="sign"
          v-if="props.options.length > 1"
        >
          <option v-for="option in props.options" :key="option">
            {{ option }}
          </option>
        </select>
        <div v-else class="singleOption pl-2 pr-2">
          {{ props.options[0] }}
        </div>
      </div>
      <input
        type="text"
        name="phone_number"
        id="phone_number"
        class="block w-full pl-16 sm:text-sm border-lightgray rounded"
        :placeholder="t('main_toolbar.Value')"
        v-model="inputValue"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useTranslation } from "../../../composables/lang";
const { t, locale } = useTranslation();

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },

  value: {
    type: Number,
  },
});

const emit = defineEmits(["updated", "update:value"]);

const inputValue = computed({
  get: () => props.value,
  set: (value) => emit("update:value", value),
});

const sign = ref(props.options[0]);
</script>

<style lang="scss" scoped>
select {
  width: 30px;
  box-sizing: border-box;
}

.singleOption {
  width: 50px;
  box-sizing: border-box;
}
</style>