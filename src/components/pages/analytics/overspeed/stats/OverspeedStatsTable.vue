<template>
  <table class="table-auto w-full" v-if="stats && stats.length">
    <thead>
      <tr class="bg-darkgray">
        <th scope="col" class="text-left pl-6">
          <strong>Range</strong> ({{ user.settings.settings.speedUnit }})
        </th>
        <th scope="col" v-for="range in goodRange" :key="range">
          {{ range }}
        </th>
        <th scope="col"><strong>Total</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(stat, index) in stats"
        :key="index"
        :class="index % 2 === 0 ? 'bg-white' : 'bg-gray'"
      >
        <td class="range border-r-1 border-gray">
          <template v-if="stat.end !== 'infiny'">
            {{ stat.start + "-" + stat.end }}
          </template>
          <template v-else>
            {{ stat.start + "+" }}
          </template>
        </td>
        <td
          v-for="range in goodRange"
          :key="range"
          :class="
            stat.ranges.filter((r) => r.range === range)[0].count <= 0
              ? 'empty'
              : ''
          "
        >
          {{
            stat.ranges.filter((r) => r.range === range)[0].count <= 0
              ? "-"
              : stat.ranges.filter((r) => r.range === range)[0].count
          }}
        </td>
        <td class="total border-l-1 border-gray font-bold text-blue">
          {{ stat.ranges.map((r) => r.count).reduce(reducer) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref, inject, computed } from "vue";

const props = defineProps({
  statistics: Object,
});

const userStore = inject("userStore");
const user = computed(() => {
  return userStore.state.user;
});

const buckets = [
  {
    id: "bucket_6_to_10",
    start: 6,
    end: 10,
  },
  {
    id: "bucket_11_to_14",
    start: 11,
    end: 14,
  },
  {
    id: "bucket_15_19",
    start: 15,
    end: 19,
  },
  {
    id: "bucket_20_more",
    start: 20,
    end: "infiny",
  },
];

const goodRange = [...new Set(props.statistics.map((s) => s.range))];

const reducer = (previousValue, currentValue) => {
  return parseInt(previousValue) + parseInt(currentValue);
};

const stats = computed(() => {
  if (props.statistics && props.statistics.length > 0) {
    let statsTemp = ref([]);
    buckets.forEach((bucket) => {
      bucket.ranges = [];
      goodRange.forEach((range) => {
        bucket.ranges.push({
          range: range,
          count: props.statistics.filter((stat) => stat.range === range).length
            ? props.statistics.find((stat) => stat.range === range)[bucket.id]
            : 0,
        });
      });
      statsTemp.value.push(bucket);
    });
    return statsTemp.value;
  }
  return [];
});
</script>

<style lang="scss" scoped>
th {
  height: 38px;

  @apply text-white font-normal;
}

tr {
  height: 38px;
}

td {
  @apply text-center;

  &:not(.range, .total, .empty) {
    @apply text-blue;
  }

  &:not(.range) {
    @apply font-bold;
  }

  &.range {
    @apply text-left pl-6;

    width: 200px;
  }

  &.total {
    width: 70px;
  }
}
</style>