<template>
  <div>
    <h1 class="font-bold bg-purple-900">Home</h1>
    {{ data.tracking.map((t) => t.matched_latitude) }}
  </div>
</template>

<script>
import { reactive } from "@vue/reactivity";
import { searchTracking } from "../api/tracking";
export default {
  setup() {
    let data = reactive({
      tracking: [],
    });
    searchTracking()
      .then((resp) => {
        data.tracking = resp.data.data;
      })
      .catch((err) => {
        throw err;
      });
    return { data };
  },
};
</script>
