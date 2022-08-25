<template>
  <litepie-datepicker
    v-model="dateValue"
    :placeholder="t('main_toolbar.${props.placeholder}')"
    :as-single="props.isSingle"
    :use-range="props.isRanged"
    :formatter="formatter"
  ></litepie-datepicker>
</template>

<script>
import LitepieDatepicker from "litepie-datepicker";
import { ref, watch } from "vue";
import { useTranslation } from "../../../../../composables/lang";

export default {
  components: {
    LitepieDatepicker,
  },
  props: {
    placeholder: String,
    isRanged: Boolean,
    isSingle: Boolean,
    payload: String,
    modelValue: Array,
  },
  emits: ["selected", "update:modelValue"],
  setup(props, { emit }) {
    const { t, locale } = useTranslation();
    const dateValue = ref();

    if (props.payload) {
      dateValue.value = props.payload;
    }

    const formatter = ref({
      date: "YYYY-MM-DD",
      month: "MMM",
    });

    if (props.modelValue) {
      dateValue.value = props.modelValue;
    }

    watch(
      () => props.modelValue,
      (val) => {
        if (!val) {
          dateValue.value = val;
        }
      }
    );

    watch(dateValue, (dateValue) => {
      emit("update:modelValue", dateValue);
    });
    return { props, dateValue, formatter, t, locale };
  },
};
</script>

<style lang="scss">
#litepie {
  position: relative;

  input {
    width: 180px;

    @apply rounded border-gray text-xs;

    height: 38px;
  }
}
</style>