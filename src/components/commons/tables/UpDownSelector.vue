<template>
  <div class="flex flex-col">
    <img
      src="../../../assets/icons/table/arrow-up.svg"
      alt=""
      class="mb-1 cursor-pointer"
      @click="select('down')"
    />
    <img
      src="../../../assets/icons/table/arrow-up.svg"
      alt=""
      class="transform rotate-180 cursor-pointer"
      @click="select('up')"
    />
  </div>
</template>

<script setup>

const emit = defineEmits(["updated"]);

const select = (type) => {
  emit("updated", type);
};
</script>