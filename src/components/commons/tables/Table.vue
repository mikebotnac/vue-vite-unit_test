<template>
  <div class="w-full rounded-lg overflow-hidden">
    <table class="table-auto w-full">
      <thead class="bg-darkgray">
        <tr>
          <th
            v-for="header in headers"
            :key="header.title"
            class="text-white px-4 py-2"
          >
            {{ header.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in 5"
          :key="index"
          :class="index % 2 === 0 ? 'bg-white' : 'bg-gray'"
        >
          <td class="px-4 py-2"></td>
          <td class="px-4 py-2"></td>
          <td class="px-4 py-2"></td>
        </tr>
      </tbody>
    </table>
    <TablePagination class="mt-4" />
  </div>
</template>

<script>
export default {
  setup() {
    const headers = [
      {
        title: "Date",
      },
      {
        title: "Unit",
      },
      {
        title: "Name",
      },
    ];
    return { headers };
  },
};
</script>