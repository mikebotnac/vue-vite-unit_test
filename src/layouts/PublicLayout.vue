<template>
  <div id="public_layout">
    <div id="public_layout_left">
      <div class="background"></div>
      <div class="content">
        <img src="../assets/esmart-logo-blanc.svg" alt="" />
        <p class="text-center text-[16px] md:text-[20px] leading-[30px]">
          Get access to your fleet statistics and update your device
          configuration from anywhere!
        </p>
      </div>
    </div>
    <div id="public_layout_right">
      <div class="md:hidden bg-white h-[70px] w-full p-4 flex items-center">
        <img
          id="nav__logo"
          src="../assets/esmart-logo.svg"
          alt=""
          class="h-6"
        />
      </div>
      <div id="login__right__container">
        <main class="main relative z-10">
          <router-view />
        </main>
        <img
          src="../assets/login_register/pin-contour.svg"
          alt=""
          class="
            hidden
            md:block
            absolute
            md:right-[70px] md:bottom-[70px]
            lg:right-[40px] lg:bottom-[40px]
          "
        />
        <img
          src="../assets/login_register/rectangle-contour.svg"
          alt=""
          class="hidden md:block absolute left-0 right-0 top-0 w-full"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#public_layout {
  @apply h-screen w-screen flex flex-col-reverse;
  @apply md:flex-row;

  #public_layout_left {
    background-image: linear-gradient(to bottom, #399cff, #1b63ff);

    @apply flex items-center justify-center w-full  h-auto flex-1 text-white relative;
    @apply md:w-5/12 md:h-full p-6;
    @apply lg:w-7/12;

    .content {
      @apply flex flex-col justify-center z-10;
      @apply text-sm lg:text-lg;

      max-width: 450px;

      img {
        width: 100%;
        margin-bottom: 35px;
      }
    }

    .background {
      @apply absolute left-0 top-0 w-full h-full bg-center bg-cover;

      background-image: url("../assets/login_register/bandes-deco.svg");
    }
  }

  #public_layout_right {
    @apply bg-lightgray flex flex-col justify-center items-center md:flex-row md:items-start w-full relative overflow-hidden;
    @apply md:w-7/12 md:h-full md:items-start;
    @apply lg:w-5/12 lg:items-start;

    #login__right__container {
      @apply w-full m-6;
      @apply lg:w-6/7 md:w-5/7 md:mt-80;
    }
  }
}
</style>