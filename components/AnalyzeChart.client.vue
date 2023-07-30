<template>
  <div>
    <highstock :options="chartOptions" v-if="loaded" />
    <!-- <el-radio-group
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
    </el-radio-group> -->

    <ul
      class="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    >
      <li
        v-for="serieName in serieChoices"
        :key="serieName"
        class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
      >
        <div class="flex items-center pl-3">
          <input
            id="horizontal-list-radio-id"
            type="radio"
            value=""
            name="list-radio"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
          />
          <label
            for="horizontal-list-radio-id"
            class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >{{ serieName }}</label
          >
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import type { Stream } from "@prisma/client";

import highcharts from "highcharts/highcharts";

type Mapping = {
  name: string;
  transform?: (d: number) => number;
  axeType: "x" | "y";
  axe?: any;
  tooltip?: any;
  chart?: any;
  zoneAxis?: "x" | "y";
  zones?: any[];
  data: number[];
};
type Serie = {
  series: any[];
  yAxis: any[];
  xAxis: any;
  tooltip: any;
};
type Series = { [key: string]: Serie };

const props = defineProps<{
  streams: Stream[];
}>();

const colorGrade = (value: number): string => {
  if (value < -1) {
    return "blue";
  } else if (value < 1) {
    return "green";
  } else if (value < 4) {
    return "yellow";
  } else if (value < 7) {
    return "orange";
  } else if (value < 10) {
    return "red";
  } else {
    return "black";
  }
};

const chartOptions = ref({
  chart: {
    type: "line",
    zoomType: "x",
    //   events: {
    //     load: function () {
    //       const zones = [];
    //       const altitudeSeries = this.series.find(
    //         (serie) => serie.name === "altitude"
    //       );
    //       const gradeSeries = this.series.find((serie) => serie.name === "grade");

    //       for (let i = 0; i < altitudeSeries.points.length; i++) {
    //         const altitudePoint = altitudeSeries.points[i];
    //         const gradePoint = gradeSeries.points[i];
    //         const nextGradePoint = gradeSeries.points[i + 1];
    //         // altitudePoint.update({
    //         //   color: gradePoint.y > 0 ? "red" : "green",
    //         //   y: altitudePoint.y + 500,
    //         // });
    //         if (
    //           !nextGradePoint ||
    //           colorGrade(gradePoint.y) != colorGrade(nextGradePoint.y)
    //         ) {
    //           zones.push({
    //             value: altitudePoint.x + 0.0001,
    //             color: colorGrade(gradePoint.y),
    //           });
    //         }
    //       }
    //       console.log(gradeSeries.points.length, altitudeSeries.points.length);
    //       altitudeSeries.update({
    //         zones,
    //       });
    //     },
    //   },
  },
  rangeSelector: {
    enabled: false,
  },
  plotOptions: {
    series: {
      animation: false,
      dataGrouping: {
        groupPixelWidth: 3,
      },
    },
  },
});

const selectedSerie = ref("distance");
const loaded = ref(false);

const getTooltipPoint = (point) =>
  `<span style="color:${point.color}">\u25CF</span> ${
    point.series.name
  }: <b>${parseInt(point.y)}</b>`;

const streamObjects: { [key: string]: any } = (() => {
  const streamObjects: { [key: string]: any } = {};
  for (const stream of props.streams) {
    streamObjects[stream.type] = stream.data;
  }
  return streamObjects;
})();

const mapping: { [key: string]: Mapping } = {
  distance: {
    name: "distance",
    // transform: (d) => d / 1000,
    axeType: "x",
    data: streamObjects.distance,
    axe: {
      title: {
        text: "Distance (km)",
      },
      ordinal: false,
      labels: {
        formatter: function (): string {
          return `${Math.round(this.value / 1000)} km`;
        },
      },
      crosshair: true,
      dataGrouping: {
        enabled: true,
        forced: true,
        approximation: "average",
        units: [
          ["meter", [1, 2, 5, 10, 50, 100, 500]],
          ["kilometer", [1, 2, 5]],
        ],
      },
    },
    tooltip: {
      formatter: function (): string[] {
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
    data: streamObjects.time,
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
      formatter: function (): string[] {
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
    data: streamObjects.altitude,
    // zones: (() => {
    //   const zones = [];
    //   const distanceSeries = streamObjects.distance;
    //   const gradeSeries = streamObjects.grade;
    //   for (let i = 0; i < distanceSeries.length; i++) {
    //     const distancePoint = distanceSeries[i];
    //     const gradePoint = gradeSeries[i] * 100;
    //     const nextGradePoint = gradeSeries[i + 1] * 100;
    //     if (
    //       !nextGradePoint ||
    //       colorGrade(gradePoint) != colorGrade(nextGradePoint)
    //     ) {
    //       zones.push({
    //         value: distancePoint + 0.001,
    //         color: colorGrade(gradePoint),
    //         fillColor: "grey",
    //       });
    //     }
    //   }
    //   return zones;
    // })(),
    zoneAxis: "x",
    chart: {
      type: "area",
      options3d: {
        enabled: true,
        alpha: 15,
        beta: 30,
        depth: 200,
      },
      lineWidth: 5,
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
      // height: "50%",
      height: "50%",
      top: "50%",
    },
  },
  grade: {
    name: "grade",
    data: streamObjects.grade,
    chart: {
      type: "line",
      lineWidth: 0,
      zIndex: 0,
      marker: {
        enabled: false,
      },
      showInNavigator: true,
    },
    transform: (d) => d * 100,
    axeType: "y",
    axe: {
      title: {
        text: "Pente (%)",
      },
      startOnTick: false,
      height: "50%",
    },
  },
  // velocity_smooth: {
  //   name: "speed",
  //   data: streamObjects.velocity_smooth,
  //   transform: (d) => d * 3.6,
  //   chart: {
  //     type: "line",
  //   },
  //   axeType: "y",
  //   axe: {
  //     title: {
  //       text: "Speed (km/h)",
  //     },
  //     height: "25%",
  //     top: "50%",
  //   },
  // },
  // cadence: {
  //   name: "cadence",
  //   data: streamObjects.cadence,
  //   chart: {
  //     type: "spline",
  //     lineWidth: 0.8,
  //     // cropThreshold: 1000,
  //   },
  //   axeType: "y",
  //   axe: {
  //     title: {
  //       text: "Cadence (rpm)",
  //     },
  //     height: "25%",
  //     top: "75%",
  //   },
  // },
};

const serieChoices = ref(
  Object.values(mapping)
    .filter((d) => d.axeType === "x")
    .map((d) => d.name)
);

const updateChart = () => {
  // loaded.value = false;
  chartOptions.value = {
    ...chartOptions.value,
    ...chartSeries.value[selectedSerie.value],
  };
  loaded.value = true;
};

const xSeries: Mapping[] = Object.values(mapping).filter(
  (d) => d.axeType === "x"
);
const ySeries: Mapping[] = Object.values(mapping).filter(
  (d) => d.axeType === "y" && d.data
);

const chartSeries: Ref<Series> = ref(
  xSeries.reduce((acc: Series, xSerie: Mapping) => {
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
      zoneAxis: ySerie?.zoneAxis,
      zones: ySerie?.zones,
      data: ySerie.data.map((d, i) => [
        xSerie.transform ? xSerie.transform(xSerie.data[i]) : xSerie.data[i],
        ySerie.transform ? ySerie.transform(d) : d,
      ]),
      ...ySerie.chart,
    }));
    acc[xSerie.name] = { series, yAxis, xAxis, tooltip };
    return acc;
  }, {})
);

updateChart();
</script>
