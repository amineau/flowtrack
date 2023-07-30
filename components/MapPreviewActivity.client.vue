<template>
  <div class="h-full">
    <l-map
      ref="mapComponent"
      :options="mapOptions"
      @ready="onMapReady()"
      :useGlobalLeaflet="true"
    >
      <l-tile-layer
        v-for="tileProvider in tileProviders"
        :key="tileProvider.name"
        :name="tileProvider.name"
        :visible="tileProvider.visible"
        :url="tileProvider.url"
        layer-type="base"
      />
      <l-polyline
        ref="polylineComponent"
        :key="activity.id"
        :latLngs="activity.summaryPolyline"
      />
    </l-map>
  </div>
</template>
<script setup>
import L from "leaflet";
import { LMap, LTileLayer, LPolyline } from "@vue-leaflet/vue-leaflet";

const props = defineProps({
  activity: Object,
});

const mapComponent = ref(null);
const polylineComponent = ref(null);

const mapOptions = ref({
  zoomControl: false,
  attributionControl: false,
  scrollWheelZoom: false,
  scrollWheelZoom: false,
  doubleClickZoom: false,
  dragging: false,
  touchZoom: false,
  boxZoom: false,
  keyboard: false,
  tapHold: false,
});

const tileProviders = [
  {
    name: "OpenStreetMap",
    visible: true,
    attribution: "",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
];

onBeforeMount(async () => {});
const onMapReady = async () => {
  const map = mapComponent.value.leafletObject;
  const polyline = polylineComponent.value.leafletObject;
  const bounds = polyline.getBounds();
  const center = bounds.getCenter();
  map.center = center;
  map.fitBounds(bounds, { padding: [0, 0] });
};
</script>
<style src="leaflet/dist/leaflet.css"></style>
