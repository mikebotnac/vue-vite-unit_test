<template>
  <div id="gmap__container">
    <div class="map rounded-lg" ref="mapDivRef"></div>

    <div id="popup" class="hidden">
      <GmapPopin :marker="selectedMarker" @close="closePopin()" />
    </div>

    <div
      id="gmap__mobile__traffic"
      class="absolute top-0 w-full flex justify-end items-center p-4 tablet:hidden"
    >
      <Toggle text="Traffic" v-model="isTrafficShown" />
    </div>
  </div>
</template>

<script>
import { ref, toRefs, onMounted, watch } from "vue";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { isTrafficShown } from "../../composables/gmap";
import { DefaultRenderer, OverspeedRenderer, BridgeRenderer, TrackingRenderer } from "./renderer";

export default {
  name: "GMap",
  props: {
    markers: Array,
    traffic: {
      type: Boolean,
      default: false,
    },
    clustering: Boolean,
    renderer: {
      type: String,
      default: () => "default",
    },
  },
  setup(props) {
    let mapGoogle;
    let mapMarkers = [];
    let mapClusters;
    const mapDivRef = ref(null);
    const trafficLayer = ref(null);
    const selectedMarker = ref({});
    const popup = ref(null);
    const { markers } = toRefs(props);
    const styles = [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ];
    const center = ref();

    const showTraffic = ref(isTrafficShown.value);

    watch(isTrafficShown, (traffic) => {
      trafficLayer.value.setMap(traffic ? mapGoogle : null);
    });

    const fitBounds = () => {
      const markers = mapMarkers;

      if (markers && markers.length) {
        let bounds = new window.google.maps.LatLngBounds();

        for (let i = 0; i < markers.length; i++) {
          bounds.extend(markers[i].position);
        }

        mapGoogle.fitBounds(bounds);
      }
    };

    onMounted(() => {
      const initMap = () => {
        mapGoogle = new window.google.maps.Map(mapDivRef.value, {
          mapTypeId: "roadmap",
          maxZoom: 17,
          minZoom: 5,
          zoom: 4,
          disableDefaultUI: false,
          center: { lat: 41.850033, lng: -87.6500523 },
          styles: styles,
        });
      };

      const addScript = () => {
        const googleMapScript = document.createElement("SCRIPT");
        googleMapScript.setAttribute("id", "GMAP-SCRIPT");
        googleMapScript.setAttribute(
          "src",
          `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GMAP_TOKEN
          }&callback=init`
        );
        googleMapScript.setAttribute("defer", "defer");
        googleMapScript.setAttribute("async", "");

        document.head.appendChild(googleMapScript);
      };

      const init = (window.init = () => {
        initMap();
        setLayers();
        center.value = new window.google.maps.LatLng(41.850033, -87.6500523);
        if (
          markers.value &&
          markers.value.length > 0 &&
          window.google &&
          window.google.maps &&
          mapMarkers.length == 0
        ) {
          updateMap();
        }
      });

      const updateMap = () => {
        loadMarkers();
        if (markers.value.length > 1) {
          fitBounds();
        }
      };

      if (!document.getElementById("GMAP-SCRIPT")) {
        addScript();
      } else {
        init();
      }

      watch(
        () => markers,
        () => {
          clearMap();
          if (
            markers.value &&
            markers.value.length > 0 &&
            window.google &&
            window.google.maps &&
            mapMarkers.length == 0
          ) {
            updateMap();
          }
          if (!markers.value.length) {
            resetMapZoom();
          }
        },
        { deep: true }
      );
    });

    const resetMapZoom = () => {
      mapGoogle.setZoom(4);
      mapGoogle.panTo(center.value);
    };

    const setLayers = () => {
      trafficLayer.value = new window.google.maps.TrafficLayer();
    };

    const zoomToMarker = (marker) => {
      mapGoogle.setZoom(16);
      mapGoogle.panTo(marker.position);
    };

    const loadMarkers = () => {
      mapMarkers = [];

      for (const marker of markers.value) {
        const markerGoogleMap = new window.google.maps.Marker({
          position: new google.maps.LatLng(
            marker.position.lat,
            marker.position.long
          ),

          icon: {
            url: getIcon(marker.type),
            scaledSize: new google.maps.Size(15, 20),
          },
          map: mapGoogle,
        });

        if (marker.type) {
          markerGoogleMap.addListener("click", () => {
            selectedMarker.value = marker;
            createPopup(markerGoogleMap);
          });
        }

        mapMarkers.push(markerGoogleMap);
      }

      if (mapMarkers.length > 1 && props.clustering) {
        mapClusters = new MarkerClusterer({
          markers: mapMarkers,
          map: mapGoogle,
          renderer:
            props.renderer === "default"
              ? new DefaultRenderer()
              : props.renderer === "bridge"
                ? new BridgeRenderer()
                : props.renderer === "overspeed"
                  ? new OverspeedRenderer()
                  : new TrackingRenderer(),
        });
      } else if (mapMarkers.length > 1) {
        selectedMarker.value = markers.value[0];
      } else {
        setTimeout(() => {
          zoomToMarker(mapMarkers[0]);
        }, 100);
      }
    };

    const clearMap = () => {
      /* for (let i = 0; i < mapMarkers.length; i++) {
        mapMarkers[i].setMap(null);
      } */

      for (const mapMarker of mapMarkers) {
        mapMarker.setMap(null);
      }

      mapMarkers = [];
      closePopin()
      if (mapClusters) {
        mapClusters.clearMarkers(mapMarkers);
        mapClusters.markers = [];
      }
    };

    //Icons
    const mapIcon = import.meta.globEager(
      "../../assets/icons/map/pins_png/*.svg"
    );
    const getIcon = (icon) => {
      const iconUrl =
        mapIcon[`../../assets/icons/map/pins_png/icone-${icon}.svg`];
      return iconUrl.default;
    };

    const createPopup = (marker) => {
      /**
       * A customized popup on the map.
       */
      class Popup extends window.google.maps.OverlayView {
        constructor(position, content) {
          super();

          document.getElementById("popup").classList.remove("hidden");

          this.popupContainer = content;
          this.popupContainer.classList.add("popup-bubble");

          this.position = position;

          // This zero-height div is positioned at the bottom of the bubble.
          const bubbleAnchor = document.createElement("div");
          bubbleAnchor.classList.add("popup-bubble-anchor");
          bubbleAnchor.appendChild(content);
          // This zero-height div is positioned at the bottom of the tip.
          this.containerDiv = document.createElement("div");
          this.containerDiv.classList.add("popup-container");
          this.containerDiv.appendChild(bubbleAnchor);
          // Optionally stop clicks, etc., from bubbling up to the map.
          Popup.preventMapHitsAndGesturesFrom(this.containerDiv);

          clearPopins();
        }
        /** Called when the popup is added to the map. */
        onAdd() {
          this.getPanes().floatPane.appendChild(this.containerDiv);
        }
        /** Called when the popup is removed from the map. */
        onRemove() {
          this.remove();
        }

        remove() {
          this.popupContainer.classList.remove("popup-bubble");
          this.popupContainer.classList.add("hidden");

          const popup = document.getElementById("popup");
          const popupContainer =
            document.getElementsByClassName("popup-container")[0];
          document.getElementById("gmap__container").appendChild(popup);
          popupContainer.remove();
        }
        /** Called each frame when the popup needs to draw itself. */
        draw() {
          const divPosition = this.getProjection().fromLatLngToDivPixel(
            this.position
          );
          // Hide the popup when it is far out of view.
          const display =
            Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
              ? "block"
              : "none";

          if (display === "block") {
            this.containerDiv.style.left = divPosition.x + "px";
            this.containerDiv.style.top = divPosition.y - 32 + "px";
          }

          if (this.containerDiv.style.display !== display) {
            this.containerDiv.style.display = display;
          }
        }
      }

      popup.value = new Popup(
        marker.position,
        document.getElementById("popup")
      );
      popup.value.setMap(mapGoogle);
    };

    const clearPopins = () => {
      const popins = document.getElementsByClassName("popup-container");
      if (popins.length) {
        for (const p of popins) {
          p.remove();
        }
      }
    };

    const closePopin = () => {
      if (popup.value) {
        popup.value.remove();
        popup.value = null;
      }
    };

    return {
      mapMarkers,
      mapDivRef,
      selectedMarker,
      showTraffic,
      clearMap,
      closePopin,
      onclick,
      isTrafficShown,
    };
  },
};
</script>

<style lang="scss" scoped>
#gmap__container {
  width: 100%;
  height: 100%;
  background-color: azure;
  position: relative;

  .map {
    width: 100%;
    height: 100%;
  }

  #gmap__mobile__traffic {
    height: 50px;
    background-color: rgba(255, 255, 255, 0.6);
  }
}
</style>


<style lang="scss">
/* The popup bubble styling. */
.popup-bubble {
  /* Position the bubble centred-above its parent. */
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, -100%);

  /* Style the bubble. */
  font-family: sans-serif;
  overflow-y: auto;
  max-height: 500px;
  width: auto;
}

.popup-bubble-anchor {
  position: absolute;
  width: 100%;
  bottom: 20px;
  left: 0;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;

    /* Center the tip horizontally. */
    transform: translate(-50%, 0);

    /* The tip is a https://css-tricks.com/snippets/css/css-triangle/ */
    width: 0;
    height: 0;

    /* The tip is 8px high, and 12px wide. */
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 10px solid white;
  }
}

.popup-container {
  cursor: auto;
  height: 0;
  position: absolute;
  width: 500px;
}
</style>