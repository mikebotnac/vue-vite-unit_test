<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-4">
      <div>
        <Button
          text="Edit"
          class="mr-2"
          :isDisabled="usersSelected.length !== 1"
        />
        <Button text="Delete" :isDisabled="usersSelected.length === 0" />
      </div>
      <div>
        <Button text="New user" />
      </div>
    </div>
    <div class="flex-1">
      <AdminUserListTable :users="users" />
    </div>
    <div class="flex items-center justify-between mb-4">
      <div>
        <Button text="Edit" class="mr-2" />
        <Button text="Delete" />
      </div>
      <div>
        <TablePagination />
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { ref, computed } from "vue";
export default {
  setup() {
    const users = ref([
      {
        company: "Apple",
        fullname: "Damien",
        email: "damien@apply.com",
        emailConfirmed: true,
        lastConnection: moment().format(),
        selected: false,
      },
      {
        company: "Apple",
        fullname: "Aurélien",
        email: "aurelien@apply.com",
        emailConfirmed: false,
        lastConnection: moment().format(),
        selected: false,
      },
      {
        company: "Apple",
        fullname: "Dorine",
        email: "dorine@apply.com",
        emailConfirmed: false,
        lastConnection: moment().format(),
        selected: false,
      },
    ]);
    const usersSelected = computed(() => {
      return users.value.filter((u) => u.selected);
    });
    return { users, usersSelected };
  },
};
</script>