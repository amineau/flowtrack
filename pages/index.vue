<template>
  <div>
    <highchart :options="chartOptions" :update="['options.series']" />
  </div>
</template>
<script setup lang="ts">
import highcharts from "highcharts/highcharts";
import type { Activity } from "@prisma/client";
const today = new Date();
const actualMonth = today.getMonth();
const actualYear = today.getFullYear();
const chartOptions = ref({
  chart: {
    type: "column",
  },
  // title: {
  //   text: "Corn vs wheat estimated production for 2020",
  //   align: "left",
  // },
  xAxis: {
    type: "datetime",
  },
  // xAxis: {
  //   categories: [
  //     "January",
  //     "February",
  //     "March",
  //     "April",
  //     "May",
  //     "June",
  //     "July",
  //   ],
  //   crosshair: true,
  //   accessibility: {
  //     description: "Months of the year",
  //   },
  // },
  // yAxis: {
  //   min: 0,
  //   title: {
  //     text: "1000 metric tons (MT)",
  //   },
  // },
  tooltip: {
    // valueSuffix: " (1000 MT)",
  },
  plotOptions: {
    series: {
      pointStart: Date.UTC(actualYear - 1, actualMonth + 1, 1),
      pointIntervalUnit: "month",
      events: {
        legendItemClick: function () {
          if (this.visible) {
            return false;
          } else {
            let series = this.chart.series,
              i = series.length,
              otherSeries;
            while (i--) {
              otherSeries = series[i];
              if (otherSeries != this && otherSeries.visible) {
                otherSeries.hide();
              }
            }
          }
        },
      },
    },
  },
  series: [],
});

const { data } = await useFetch("/api/activity", {
  query: {},
});
type Serie = {
  name: string;
  data: number[];
  visible: boolean;
};
const series = data.value.reduce((acc: Serie[], activity: Activity) => {
  const date = new Date(activity.startDateLocal);
  const month = date.getMonth();
  const relativeMonthIndex = (month - actualMonth + 11) % 12;
  [
    "distance",
    "movingTime",
    // "average_speed",
    "totalElevationGain",
  ].forEach((key) => {
    let serie: Serie | null = acc.find((s) => s.name === key) || null;
    if (!serie) {
      serie = {
        name: key,
        data: Array(12).fill(0),
        visible: key === "distance",
      };
      acc.push(serie);
    }
    serie.data[relativeMonthIndex] += activity[key];
  });
  return acc;
}, []);
chartOptions.value.series = series;
</script>
