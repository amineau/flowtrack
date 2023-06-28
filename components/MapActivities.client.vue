<template>
  <div style="height: 600px; width: 800px">
    <l-map
      ref="mapComponent"
      v-model:zoom="zoom"
      :center="center"
      @ready="onMapReady()"
      :useGlobalLeaflet="true"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
      <l-polyline
        v-for="activity in activities"
        :key="activity.id"
        :id="activity.id"
        ref="polylineRefs"
        :latLngs="activity.polylineSymplified.coordinates"
        :visible="activity.visible"
      />
    </l-map>
    <p v-for="activity in activities" :key="activity.id">
      {{ activity.id }}
    </p>
  </div>
</template>
<script setup>
import L from "leaflet";
import { LMap, LTileLayer, LPolyline } from "@vue-leaflet/vue-leaflet";
import "leaflet-fullscreen";
const props = defineProps({
  activities: {
    type: Object,
    required: true,
  },
  center: {
    type: Array,
    required: true,
  },
  boundingBox: {
    type: Array,
    required: true,
  },
});

const mapComponent = ref(null);
const polylineRefs = ref([]);
const zoom = ref(6);

onBeforeMount(async () => {});
const onMapReady = async () => {
  const map = mapComponent.value.leafletObject;
  map.fitBounds(props.boundingBox, {
    animate: false,
  });
  const fullscreenControl = new L.Control.Fullscreen({});
  fullscreenControl.addTo(map);
  polylineRefs.value.forEach((polylineRef) => {
    const polyline = polylineRef.leafletObject;
    polyline.on("mouseover", (e) => {
      console.log(polylineRef.$attrs["id"]);
      e.target.setStyle({ weight: 6 });
    });
    polyline.on("mouseout", (e) => {
      e.target.setStyle({ weight: 3 });
    });
  });
};
</script>
<style src="leaflet/dist/leaflet.css"></style>
<style src="leaflet-fullscreen/dist/leaflet.fullscreen.css"></style>
