<template>
  <div class="w-full">
    <table class="flex-1 table-auto w-full mb-4 rounded-lg overflow-hidden">
      <thead class="bg-gray-500">
        <tr>
          <th scope="col" class="border-r-1 border-gray">
            <div class="header__item">
              <div class="header__item__top"></div>
              <div class="header__item__bottom"></div>
            </div>
          </th>
          <th scope="col" class="border-r-1 border-gray">
            <div class="header__item">
              <div class="header__item__top">add date picker</div>
              <div class="header__item__bottom">
                <span>Company</span>
              </div>
            </div>
          </th>
          <th scope="col" class="border-r-1 border-gray">
            <div class="header__item">
              <div class="header__item__top">add date picker</div>
              <div class="header__item__bottom">
                <span>Fullname</span>
              </div>
            </div>
          </th>
          <th scope="col" class="border-r-1 border-gray">
            <div class="header__item">
              <div class="header__item__top">add date picker</div>
              <div class="header__item__bottom">
                <span>Email</span>
              </div>
            </div>
          </th>
          <th scope="col" class="border-r-1 border-gray">
            <div class="header__item">
              <div class="header__item__top">add date picker</div>
              <div class="header__item__bottom">
                <span>Email confirmed</span>
              </div>
            </div>
          </th>
          <th scope="col" class="border-r-1 border-gray">
            <div class="header__item">
              <div class="header__item__top">add date picker</div>
              <div class="header__item__bottom">
                <span>Last connection</span>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(user, index) in props.users"
          :key="user"
          :class="index % 2 === 0 ? 'bg-white' : 'bg-gray'"
        >
          <td class="checkCol px-4 py-2 border-r-1 border-gray">
            <Check
              @checked="
                (e) => {
                  user.selected = e;
                }
              "
            />
          </td>
          <td class="px-4 py-2 border-r-1 border-gray">{{ user.company }}</td>
          <td class="px-4 py-2 border-r-1 border-gray">{{ user.fullname }}</td>
          <td class="px-4 py-2 border-r-1 border-gray">{{ user.email }}</td>
          <td class="px-4 py-2 border-r-1 border-gray">
            {{ user.emailConfirmed }}
          </td>
          <td class="px-4 py-2 border-r-1 border-gray">
            {{ user.lastConnection }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    users: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    return { props };
  },
};
</script>

<style lang="scss" scoped>
th {
  @apply text-left text-xs p-0;
}

tbody {
  height: 200px;
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
}

td {
  &.checkCol {
    width: 40px;
  }
}
</style>