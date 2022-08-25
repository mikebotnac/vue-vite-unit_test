<template>
  <div class="button_group group">
    <img :src="getIcon(props.icon)" alt="" />
    <div class="popin__container hidden group-hover:block">
      <div
        class="popin__container__content text-xs whitespace-nowrap text-left"
      >
        <p>
          {{ props.icon === "phone" ? "Call us at:" : "Send us an email at:" }}
        </p>

        <a
          :href="
            props.icon === 'phone'
              ? 'tel:1-888-437 6278'
              : 'mailto:san@antonio.net'
          "
          class="font-bold"
        >
          {{
            props.icon === "phone"
              ? "1-888-437 6278"
              : "support@esmartcontrol.com"
          }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  props: {
    icon: String,
  },
  emits: ["clicked"],
  setup(props, { emit }) {
    const navIcons = import.meta.globEager(
      "../../../assets/icons/navigation/*.svg"
    );
    const getIcon = (icon) => {
      const iconUrl =
        navIcons["../../../assets/icons/navigation/" + icon + ".svg"].default;
      return iconUrl;
    };
    const click = () => {
      emit("clicked");
    };
    const hovered = ref(false);
    return { props, getIcon, click, hovered };
  },
};
</script>

<style lang="scss" scoped>
.button_group {
  @apply h-[38px] w-[38px] border-1 border-gray rounded-sm flex items-center justify-center duration-300 relative cursor-pointer;

  &:hover {
    @apply bg-blue;

    img {
      filter: brightness(100);
    }
  }

  .popin__container {
    @apply z-50 absolute right-0 top-full;

    .popin__container__content {
      @apply mt-2 p-4 bg-white shadow;
    }
  }
}
</style>