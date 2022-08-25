<template>
  <div v-if="!loading" class="w-full flex flex-col relative">
    <div
      v-if="loadingPage"
      class="
        absolute
        h-full
        w-full
        bg-darkblue bg-opacity-50
        z-[51]
        flex
        items-center
        justify-center
        duration-300
      "
    >
      <span class="text-2xl text-white">{{ t(`main_footer.Loading`) }}...</span>
    </div>
    <table class="flex-1 table-auto w-full mb-4 rounded-xl overflow-hidden">
      <thead class="bg-gray-500">
        <tr>
          <th scope="col" class="w-[150px]">
            <div class="header__item">
              <div class="header__item__top">
                <DateField v-model="filters.date" dateFormat="YYYY-MM-DD" />
              </div>
            </div>
          </th>
          <th scope="col" class="w-[150px]">
            <div class="header__item">
              <div class="header__item__top font-normal text-xs">
                <AutocompleteField
                  :placeholder="t('main_toolbar.Find a vehicle')"
                  :payload="filters.unit_name"
                  v-model="filters.unit_name"
                  :options="userUnits.map((u) => u.unit_name)"
                  @selected="(e) => (filters.unit_name = e)"
                />
              </div>
            </div>
          </th>
          <th scope="col" colspan="2">
            <div class="header__item">
              <div class="header__item__top"></div>
            </div>
          </th>

          <th scope="col" class="w-[100px]" colspan="2">
            <div class="header__item">
              <div class="header__item__top large-header">
                <ResetFilters @clicked="reset()" />
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <thead class="bg-gray-500">
        <tr>
          <th scope="col">
            <div class="header__item">
              <div class="header__item__bottom">
                <span>{{ t(`table_header.Date`) }} </span>
                <UpDownSelector />
              </div>
            </div>
          </th>
          <th scope="col">
            <div class="header__item">
              <div class="header__item__bottom">
                <span>{{ t(`table_header.Unit`) }}</span>
                <UpDownSelector />
              </div>
            </div>
          </th>
          <th scope="col" class="w-[150px]">
            <div class="header__item">
              <div class="header__item__bottom">
                <span>{{ t(`table_header.Status`) }}</span>
                <UpDownSelector />
              </div>
            </div>
          </th>

          <th scope="col" class="w-[150px]">
            <div class="header__item">
              <div class="header__item__bottom">
                <span>{{ t(`table_header.Created By`) }}</span>
                <UpDownSelector />
              </div>
            </div>
          </th>
          <th scope="col" class="w-[190px]">
            <div class="header__item">
              <div class="header__item__bottom">
                <span>{{ t(`table_header.Update at`) }}</span>
                <UpDownSelector />
              </div>
            </div>
          </th>
          <th scope="col" class="w-[200px] bg-darkgray">
            <div class="header__item">
              <div class="flex justify-center text-white bg-darkgray h-full">
                {{ t(`table_header.Description`) }}
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="relative">
        <tr
          v-for="(data, index) in datas"
          :key="index"
          class="h-[38px]"
          :class="[index % 2 === 0 ? 'bg-white' : 'bg-gray']"
        >
          <td
            class="
              px-4
              py-2
              border-r-1 border-gray
              whitespace-nowrap
              font-normal
              text-xs
            "
          >
            {{ format(new Date(data.time), "yyyy-MM-dd") }}
          </td>
          <td class="px-4 py-2 border-r-1 border-gray font-normal text-xs">
            {{ data.unit_name }}
          </td>
          <td
            class="
              px-4
              py-2
              border-r-1 border-gray
              font-normal
              text-xs text-[#FE9B0E]
            "
            v-if="data.status == 'pending'"
          >
            {{ data.status }}
          </td>
          <td
            class="
              px-4
              py-2
              border-r-1 border-gray
              font-normal
              text-xs text-[#47B881]
            "
            v-if="data.status == 'success'"
          >
            {{ data.status }}
          </td>
          <td
            class="
              px-4
              py-2
              border-r-1 border-gray
              font-normal
              text-xs text-[#EC2D30]
            "
            v-if="data.status == 'failed'"
          >
            {{ data.status }}
          </td>
          <td class="px-4 py-2 border-r-1 border-gray">
            {{ data.created_by }}
          </td>
          <td class="px-4 py-2 border-r-1 border-gray font-normal text-xs">
            {{ format(new Date(data.updated_at), "yyyy-MM-dd") }}
            {{ format(new Date(data.updated_at), "hh:mm:ss a") }}
          </td>
          <td
            class="
              px-4
              py-2
              border-r-1 border-gray
              flex flex-col
              font-normal
              text-xs
            "
            v-if="data.delta.custom_limit"
          >
            <div v-for="(item, key1) in data.delta.custom_limit">
              <div v-for="(el, key) in item">
                Zone &nbsp;{{ key }} &nbsp;{{ key1 }} --> &nbsp;{{
                  el
                }}
                &nbsp;<br />
              </div>
            </div>
          </td>
          <td v-else></td>
        </tr>
      </tbody>
    </table>

    <TablePagination
      :currentPage="page"
      v-model:listLength="filters.limit"
      @prev-page="prevPage"
      @next-page="nextPage"
    />
  </div>
  <div v-else>
    <span>{{ t(`messages.Loading`) }}...</span>
  </div>
</template>

<script setup>
import { computed, inject, reactive, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useTranslation } from "../../composables/lang";
import change_history from "../../api/shadow/change_history";
import { format, fromUnixTime } from "date-fns";
import { ConsoleApiName } from "@datadog/browser-core";
const { t, locale } = useTranslation();
const userStore = inject("userStore");
const router = useRouter();
const route = useRoute();
const datas = ref([]);
const filters = reactive({
  uuid: "",
  unit_name: "",
  date: "",
  limit: 50,
  start: "2021-08-05T00:00:00",
  end: "2022-08-05T00:00:00",
});
const userUnits = computed(() => {
  if (userStore.state.user.units) {
    return userStore.state.user.units.data;
  }
  return [];
});
const getHistory = async ({ page = 1 }) => {
  const date = filters.date;
  if (date === "") {
    const resp = await change_history({
      page: page,
      limit: filters.limit,
      start: filters.start,
      end: filters.end,
    });
    datas.value = resp.data;
    const unit_name = filters.unit_name;
    if (unit_name !== "") {
      datas.value = resp.data.filter(function (el) {
        return el.unit_name == unit_name;
      });
    } else {
      datas.value = resp.data;
    }
  } else {
    const resp = await change_history({
      page: page,
      limit: filters.limit,
      start: filters.start,
      end: format(
        new Date(fromUnixTime(filters.date)),
        "yyyy-MM-dd'T'hh:mm:ss"
      ),
    });
    datas.value = resp.data;
    const unit_name = filters.unit_name;
    if (unit_name !== "") {
      datas.value = resp.data.filter(function (el) {
        return el.unit_name == unit_name;
      });
    } else {
      datas.value = resp.data;
    }
  }
};
const reset = () => {
  filters.uuid = "";
  filters.unit_name = "";
  filters.date = "";
  filters.limit = 50;
  filters.start = "2021-08-05T00:00:00";
  filters.end = "2022-08-05T00:00:00";
};
const init = async () => {
  await getHistory({ page: 1 });
};
init();

watch(filters, () => {
  getHistory({ page: 1 });
});
</script>

<style lang="scss" scoped>
th {
  @apply text-left text-xs p-0;
}

tbody {
  overflow: scroll;
}

.header__item {
  @apply flex flex-col;

  .header__item__top {
    height: 58px;

    @apply bg-white p-2 flex justify-center items-center;
  }

  .header__item__bottom {
    height: 40px;

    @apply bg-darkgray py-3 px-4 font-bold text-white  flex justify-between items-center;

    span {
      @apply whitespace-nowrap;
    }
  }

  .large-header {
    justify-content: end;
    padding-right: 12px;
  }
}
</style>