<template>
  <div class="flex flex-col">
    <div class="h-56">
      <MapActivity v-if="activity" :activity="activity" />
    </div>
    <highstock :options="chartOptions" />
  </div>
  <!-- <div>
    <el-radio-group
      v-model="selectedSerie"
      size="large"
      :onChange="updateChart"
    >
      <el-radio-button
        v-for="serieName in serieChoices"
        :key="serieName"
        :label="serieName"
        >{{ serieName }}</el-radio-button
      >
    </el-radio-group>
  </div> -->
</template>

<script setup>
import highcharts from "highcharts/highcharts";
const route = useRoute();

const id = ref(route.params.id);
const loaded = ref(false);

const chartOptions = ref({
  chart: {
    type: "line",
    zoomType: "x",
  },
  rangeSelector: {
    enabled: false,
  },
  plotOptions: {
    series: {
      animation: false,
      dataGrouping: {
        groupPixelWidth: 5,
      },
    },
  },
});

let activity = ref(null);
let chartSeries = ref(null);
let selectedSerie = ref("distance");

const getTooltipPoint = (point) =>
  `<span style="color:${point.color}">\u25CF</span> ${
    point.series.name
  }: <b>${parseInt(point.y)}</b>`;

const mapping = {
  distance: {
    name: "distance",
    // transform: (d) => d / 1000,
    axeType: "x",
    axe: {
      title: {
        text: "Distance (km)",
      },
      ordinal: false,
      labels: {
        formatter: function () {
          return `${(this.value / 1000).toFixed(2)} km`;
        },
      },
      crosshair: true,
      dataGrouping: {
        enabled: true,
        forced: true,
        approximation: "average",
        units: [
          ["meter", [1, 2, 5, 10, 50, 100, 500]][("kilometer", [1, 2, 5])],
        ],
      },
    },
    tooltip: {
      formatter: function () {
        const points = this.points;
        const tooltipArray = [`${this.x / 1000} km`];
        points.forEach((point) => {
          tooltipArray.push(getTooltipPoint(point));
        });
        return tooltipArray;
      },
    },
  },
  time: {
    name: "time",
    axeType: "x",
    transform: (d) => d * 1000,
    axe: {
      title: {
        text: "Time (s)",
      },
      ordinal: false,
      labels: {
        format: "{value:%H:%M}",
      },
      crosshair: true,
    },
    tooltip: {
      formatter: function () {
        const points = this.points;
        const tooltipArray = [highcharts.dateFormat("%H:%M:%S", this.x)];
        points.forEach((point) => {
          tooltipArray.push(getTooltipPoint(point));
        });
        return tooltipArray;
      },
    },
  },
  altitude: {
    name: "altitude",
    chart: {
      type: "area",
      lineWidth: 0,
      zIndex: 0,
      marker: {
        enabled: false,
      },
      showInNavigator: true,
    },
    axeType: "y",
    axe: {
      title: {
        text: "Altitude (m)",
      },
      softMax: 600,
      softMin: 200,
      startOnTick: false,
      height: "33%",
    },
  },
  velocity_smooth: {
    name: "speed",
    transform: (d) => d * 3.6,
    chart: {
      type: "line",
    },
    axeType: "y",
    axe: {
      title: {
        text: "Speed (km/h)",
      },
      height: "33%",
      top: "33%",
    },
  },
  cadence: {
    name: "cadence",
    chart: {
      type: "spline",
      lineWidth: 0.8,
      // cropThreshold: 1000,
    },
    axeType: "y",
    axe: {
      title: {
        text: "Cadence (rpm)",
      },
      height: "33%",
      top: "66%",
    },
  },
};

const serieChoices = ref(
  Object.values(mapping)
    .filter((d) => d.axeType === "x")
    .map((d) => d.name)
);

onBeforeMount(async () => {
  try {
    const res = await $fetch(`/api/activity/${id.value}`);
    activity.value = res;
  } catch (err) {
    console.log(err);
  }

  const res = await $fetch(`/api/activity/${id.value}/stream`);

  const typeKeys = Object.keys(mapping);
  res.forEach((elem) => {
    if (typeKeys.includes(elem.type)) {
      mapping[elem.type].data = elem.data;
    }
  });
  const xSeries = Object.values(mapping).filter((d) => d.axeType === "x");
  const ySeries = Object.values(mapping).filter((d) => d.axeType === "y");
  chartSeries.value = xSeries.reduce((acc, xSerie) => {
    const tooltip = {
      ...xSerie.tooltip,
      shared: true,
    };
    const yAxis = ySeries.map((ySerie) => ({
      id: ySerie.name,
      ...ySerie.axe,
      opposite: true,
    }));
    const xAxis = {
      id: xSerie.name,
      ...xSerie.axe,
      opposite: true,
    };
    const series = ySeries.map((ySerie) => ({
      name: ySerie.name,
      type: ySerie.chart.type,
      yAxis: ySerie.name,
      data: ySerie.data.map((d, i) => [
        xSerie.transform ? xSerie.transform(xSerie.data[i]) : xSerie.data[i],
        ySerie.transform ? ySerie.transform(d) : d,
      ]),
      ...ySerie.chart,
    }));
    acc[xSerie.name] = { series, yAxis, xAxis, tooltip };
    return acc;
  }, {});
  updateChart();
});

const updateChart = () => {
  loaded.value = false;
  chartOptions.value = {
    ...chartOptions.value,
    ...chartSeries.value[selectedSerie.value],
  };
  loaded.value = true;
};
</script>

<style></style>
