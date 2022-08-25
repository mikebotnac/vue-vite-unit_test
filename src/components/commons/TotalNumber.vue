<template>
  <div class="flex rounded-md h-[38px] mr-3">
    <span
      class="
        inline-flex
        items-center
        px-3
        rounded-l
        border border-r-0 border-lightgray
        bg-gray-50
        text-gray-500
        sm:text-sm
      "
    >
      {{ t(`table_header.Total Number`) }} :<strong class="ml-2">{{
        count
      }}</strong>
    </span>
  </div>
</template>

<script setup>
import { useTranslation } from "../../composables/lang";
const { t, locale } = useTranslation();
const props = defineProps({
  count:Number,
});
</script>