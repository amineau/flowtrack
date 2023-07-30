<template>
  <div class="max-w-screen-lg h-[600px]">
    <l-map ref="mapComponent" @ready="onMapReady()" :useGlobalLeaflet="true">
      <l-tile-layer
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        layer-type="base"
        name="Stadia Maps"
      ></l-tile-layer>
      <l-polyline
        v-for="activity in activities"
        :key="activity.id"
        :id="activity.id"
        ref="polylineRefs"
        :latLngs="activity.summaryPolyline"
        :opacity="polylineStyle.default.opacity"
        :color="polylineStyle.default.color"
      />
    </l-map>
  </div>
</template>
<script setup lang="ts">
import * as L from "leaflet";
import { LMap, LTileLayer, LPolyline } from "@vue-leaflet/vue-leaflet";
import "leaflet-fullscreen";
import { VNodeRef } from "nuxt/dist/app/compat/capi";
import type { Activity } from "@prisma/client";

const props = defineProps<{
  activities: Activity[];
}>();
const emit = defineEmits<{
  setSelectedActivity: [activity: Activity | null];
}>();

const mapComponent = ref<{
  leafletObject: L.Map;
} | null>(null);

const polylineRefs = ref<(VNodeRef & { leafletObject: L.Polyline })[]>([]);

const polylineStyle = reactive({
  default: {
    color: "red",
    opacity: 0.2,
  },
  hover: {
    color: "blue",
    opacity: 0.8,
  },
  select: {
    color: "green",
    opacity: 1.0,
  },
});

const polylineIdSelected = ref<string | null>(null);

onBeforeMount(async () => {});
const onMapReady = async () => {
  if (!mapComponent.value) return;
  const map = mapComponent.value.leafletObject;
  const polylineGroup = L.featureGroup();
  const fullscreenControl = new L.Control.Fullscreen();
  fullscreenControl.addTo(map);
  polylineRefs.value.forEach((polylineRef) => {
    const polyline = polylineRef.leafletObject;
    polyline.on("mouseover", (e) => {
      if (polylineIdSelected.value !== polylineRef.$attrs.id) {
        e.target.setStyle(polylineStyle.hover);
        e.target.bringToFront();
      }
    });
    polyline.on("mouseout", (e) => {
      if (polylineIdSelected.value !== polylineRef.$attrs.id) {
        e.target.setStyle(polylineStyle.default);
      }
      if (polylineIdSelected.value) {
        const polylineSelected = polylineRefs.value.find(
          (polylineRef) => polylineRef.$attrs.id === polylineIdSelected.value
        );
        if (polylineSelected) {
          polylineSelected.leafletObject.bringToFront();
        }
      }
    });
    polyline.on("click", (e) => {
      polylineIdSelected.value =
        polylineIdSelected.value === polylineRef.$attrs.id
          ? null
          : polylineRef.$attrs.id;
      emit(
        "setSelectedActivity",
        polylineIdSelected.value
          ? props.activities.find(
              (activity) => activity.id === polylineIdSelected.value
            ) ?? null
          : null
      );
    });
    polyline.addTo(polylineGroup);
  });
  const bounds = polylineGroup.getBounds();
  map.fitBounds(bounds, { padding: [0, 0] });
};

watch(
  () => polylineIdSelected.value,
  (newId, oldId) => {
    if (!mapComponent.value) return;
    const map = mapComponent.value.leafletObject;
    if (oldId) {
      const polyline = polylineRefs.value.find(
        (polylineRef) => polylineRef.$attrs.id === oldId
      );
      if (polyline) {
        polyline.leafletObject.setStyle(polylineStyle.default);
      }
    }
    if (newId) {
      const polyline = polylineRefs.value.find(
        (polylineRef) => polylineRef.$attrs.id === newId
      );
      if (polyline) {
        polyline.leafletObject.setStyle(polylineStyle.select);
        map.fitBounds(polyline.leafletObject.getBounds(), { padding: [0, 0] });
      }
    }
  }
);
</script>
<style src="leaflet/dist/leaflet.css"></style>
<style src="leaflet-fullscreen/dist/leaflet.fullscreen.css"></style>
