<template>
  <div
    class="
      fixed
      inset-0
      h-screen
      w-screen
      z-50
      bg-darkblue bg-opacity-50
      flex
      justify-center
      items-center
      p-4
    "
  >
    <div>
      <Card>
        <template v-slot:title>
          <span>Breakpoint notice</span>
        </template>
        <template v-slot:content>
          <span
            >This page is not available on mobile and tablet for the
            moment.</span
          >
          <Button class="w-full mt-4" @clicked="goToHome">
            <span>Return to home</span>
          </Button>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import router from "../../router";
export default {
  setup() {
    const goToHome = () => {
      router.push({
        name: "MapVehicules",
      });
    };
    return { goToHome };
  },
};
</script>