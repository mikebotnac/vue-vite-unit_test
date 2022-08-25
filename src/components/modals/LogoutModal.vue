<template>
  <div class="logout-modal">
    <div class="logout-modal-container">
      <Card>
        <template v-slot:title>
          <span>Logout</span>
        </template>
        <template v-slot:content>
          <div class="p-2 md:p-8 flex flex-col items-center">
            <span class="font-bold">Are you sure you want to Log Out</span>
            <div class="mt-6 w-full flex flex-col justify-around md:flex-row">
              <Button class=" w-full md:w-[160px]" @clicked="close"
                ><span>No, keep me log in</span></Button
              >
              <Button class="mt-2 md:mt-0 w-full md:w-[160px]" @clicked="logout"
                ><span>Yes, log out now</span></Button
              >
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["close", "logout"],
  setup(_, { emit }) {
    const close = () => {
      emit("close");
    };
    const logout = () => {
      emit("logout");
    };
    return { close, logout };
  },
};
</script>

<style lang="scss" scoped>
.logout-modal {
  background-color: #eaf4ff86;

  @apply top-0 left-0 absolute w-full h-full bg-opacity-50 flex items-center justify-center;

  .logout-modal-container {
    @apply w-[90%] md:w-[490px];
  }
}
</style>