<template>
  <div style="height: 600px; width: 800px">
    <l-map
      ref="mapComponent"
      v-model:zoom="zoom"
      v-model:center="center"
      @ready="onMapReady()"
      :useGlobalLeaflet="true"
    >
      <l-control-layers position="topright"></l-control-layers>
      <l-tile-layer
        v-for="tileProvider in tileProviders"
        :key="tileProvider.name"
        :name="tileProvider.name"
        :visible="tileProvider.visible"
        :url="tileProvider.url"
        :attribution="tileProvider.attribution"
        layer-type="base"
      />
      <l-polyline
        ref="polylineComponent"
        :key="activity.id"
        :latLngs="activity.polyline.coordinates"
        :visible="activity.visible"
      />
    </l-map>
    <p>{{ center }}</p>
    <p>{{ bounds }}</p>
  </div>
</template>
<script setup>
import L from "leaflet";
import {
  LMap,
  LTileLayer,
  LPolyline,
  LControlLayers,
} from "@vue-leaflet/vue-leaflet";
import "leaflet-fullscreen";

const props = defineProps({
  activity: Object,
});

const mapComponent = ref(null);
const polylineComponent = ref(null);
const center = ref(props.activity.centroid.coordinates);
const bounds = props.activity.boundingBox.coordinates;
const zoom = ref(6);
const tileProviders = [
  {
    name: "OpenStreetMap",
    visible: true,
    attribution: "",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
  {
    name: "OpenTopoMap",
    visible: false,
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "",
  },
  {
    name: "CyclOSM",
    visible: false,
    url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
    attribution: "",
  },
  {
    name: "Esri.WorldImagery",
    visible: false,
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "",
  },
];

onBeforeMount(async () => {});
const onMapReady = async () => {
  const map = mapComponent.value.leafletObject;
  const polyline = polylineComponent.value.leafletObject;
  map.fitBounds(bounds, { padding: [50, 50] });
  polyline.on("mouseover", (e) => {
    console.log(e.target);
    e.target.setStyle({ weight: 6 });
  });
  polyline.on("mouseout", (e) => {
    e.target.setStyle({ weight: 3 });
  });
  const fullscreenControl = new L.Control.Fullscreen({});
  fullscreenControl.addTo(map);
};
</script>
<style src="leaflet/dist/leaflet.css"></style>
<style src="leaflet-fullscreen/dist/leaflet.fullscreen.css"></style>
