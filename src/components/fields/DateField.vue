<template>
  <DatePicker
    v-model="dateValue"
    class="w-full"
    mode="date"
    :is-range="props.isRanged"
    :masks="masks"
    :max-date="new Date()"
    :model-config="modelConfig"
  >
    <template v-slot="{ inputValue, togglePopover }">
      <div class="w-full flex items-center relative" @click="togglePopover()">
        <input
          :placeholder="placeholder ? placeholder : 'Select a date'"
          :value="valueToDisplay(inputValue)"
          class="
            bg-white
            text-black
            placeholder-black
            w-full
            py-1
            px-2
            appearance-none
            focus:outline-none focus:border-blue-500
            rounded
            border-1 border-lightgray
            text-xs
            h-[38px]
          "
          readonly
        />
        <div
          class="
            absolute
            inset-y-0
            right-0
            pr-3
            flex
            items-center
            pointer-events-none
          "
        >
          <img src="../../assets/icons/calendar.svg" class="h-5 w-5" />
        </div>
      </div>
    </template>
  </DatePicker>
</template>

<script setup>
import { DatePicker } from "v-calendar";
import { reactive, ref, watch, computed } from "vue";

const props = defineProps({
  modelValue: [Object, String],
  isRanged: Boolean,
  dateFormat: String,
  placeholder: String,
});

const emit = defineEmits(["update:modelValue"]);

const date = props.isRanged
  ? ref({
      start: "",
      end: "",
    })
  : ref("");

const dateValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

const modelConfig = {
  type: "string",
  mask: "YYYY-MM-DD",
};

const masks = reactive({
  input: "YYYY-MM-DD",
  iso: "YYYY-MM-DD",
  data: "YYYY-MM-DD",
});
//If there is already a date

const valueToDisplay = (inputValue) => {
  if (props.isRanged && inputValue.start && inputValue.end) {
    return `${inputValue.start} --> ${inputValue.end}`;
  } else if (!props.isRanged && dateValue.value) {
    return dateValue.value;
  } else {
    return props.placeholder;
  }
};
</script>
