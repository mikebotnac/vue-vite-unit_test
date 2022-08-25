<template>
  <div class="h-full flex flex-col">
    <Card class="mb-4">
      <template v-slot:content>
        <div class="flex items-center md:justify-between py-2">
          <MapVehiculesSearchForm
            :unitName="unit_name"
            :loading="loading"
            :error="error"
            @reload-location="reloadLocation()"
          />
          <Toggle
            class="hidden md:flex"
            :text="'Traffic'"
            v-model="isTrafficShown"
          />
        </div>
      </template>
    </Card>

    <div class="flex-1 flex flex-col">
      <div class="h-full rounded-lg overflow-hidden">
        <Gmap :markers="markers" />
      </div>
      <GmapLegend />
    </div>
  </div>
</template>

<script>
/*
If this page is loaded without an id parameter (unit_name), do nothing.
If this page is loaded with an id parameter (unit_name), check if this unit belongs to
the logged user. If it's ok, get the corresponding vehicle.
*/
import { computed, ref, inject } from "vue";
import { useRoute } from "vue-router";
import forEach from "lodash/forEach";
import searchDevice from "../../../api/search-device";
// Because setup won't have access to component method
import buidlMarker from "../../../utils/map";
import { isTrafficShown } from "../../../composables/gmap";
export default {
  setup() {
    //GMAP
    const trafficOnMap = ref(isTrafficShown.value);

    const markers = ref([]);

    const userStore = inject("userStore");
    const user = computed(() => {
      return userStore.state;
    });

    //NOTIFICATION STORE
    const notificationsStore = inject("notificationsStore");

    //ROUTER
    const route = useRoute();
    const routeParams = computed(() => {
      return route.params;
    });

    //DEVICE
    const unit_name = routeParams.value.id;
    const company_number = userStore?.state?.user?.company?.number;
    const device = ref();

    /*
      This fucntion is used to reload the position 
      of the device if we already are on it
    */
    const reloadLocation = () => {
      search(unit_name);
    };

    const loading = ref(false);
    const error = ref("");

    const search = async (unit_names) => {
      error.value = "";
      loading.value = true;
      markers.value = [];
      let params = {};
      if (unit_names) {
        params = { search: unit_names };
      } else {
        params = { advanced_search: [`client_number = ${company_number}`], limit: 1500 };
      }
      try {
        const response = await searchDevice(params);
        if (response.count > 0) {
          forEach(response?.data, (data) => {
            buidlMarker(data, device, markers);
          });
          notificationsStore.addNotification({
            type: "success",
            title: `${unit_name ? unit_name : ''} successfully located`,
            content: "",
          });
        }
        //If there is no data in the response
        else {
          error.value = `Can't retrieve: ${unit_name}`;
          notificationsStore.addNotification({
            type: "error",
            title: `Can't retrieve device ${unit_name}`,
            content: "Please try later or contact support.",
          });
        }
        loading.value = false;
      } catch (err) {
        loading.value = false;
        error.value = "No device corresponding";
      }
    };

    //If there is a unit_name inside the route
    if (unit_name) {
      search([unit_name]);
    } else {
      search();
    }

    return {
      routeParams,
      trafficOnMap,
      unit_name,
      loading,
      error,
      device,
      markers,
      reloadLocation,
      user,
      isTrafficShown,
    };
  },
};
</script>