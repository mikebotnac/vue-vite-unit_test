<template>
  <div class="flex items-center group" @click="click">
    <img class="mr-2" src="../../assets/icons/reset.svg" alt="" />
    <span class="reset group-hover:text-blue">{{ t(`main_toolbar.${text}`) }}</span>
  </div>
</template>

<script setup>
import { useTranslation } from "../../composables/lang";
const { t, locale } = useTranslation();
const props = defineProps({
  text: {
    type: String,
    default: () => {
      return "Reset filters";
    },
  },
});
const emit = defineEmits(["clicked"]);
const click = () => {
  emit("clicked");
};
</script>