<template>
  <el-table
    :data="activities"
    :default-sort="{ prop: 'startDate', order: 'descending' }"
    stripe
    style="width: 100%"
  >
    <el-table-column prop="name" label="Name" width="250" />
    <el-table-column prop="startDate" label="Date" sortable width="180">
      <template #default="scope">
        <div style="display: flex; align-items: right">
          <span style="margin-left: 10px">{{
            new Date(scope.row.startDate).toLocaleDateString()
          }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="distance" label="Distance">
      <template #default="scope">
        <div style="display: flex; align-items: right">
          <span style="margin-left: 10px"
            >{{ formatdecimal(scope.row.distance / 1000) }} km</span
          >
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="averageSpeed" label="Average speed">
      <template #default="scope">
        <div style="display: flex; align-items: right">
          <span style="margin-left: 10px"
            >{{ formatdecimal(scope.row.averageSpeed * 3.6) }} km/h</span
          >
        </div>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="" width="120">
      <template #default="scope">
        <el-button
          link
          type="primary"
          size="small"
          @click.prevent="toActivityPage(scope.row.id)"
        >
          Show
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
const props = defineProps({
  activities: {
    type: Array,
    required: true,
  },
});

const toActivityPage = (id) => {
  console.log("toActivityPage", id);
  return navigateTo(`/activity/${id}`);
};

const formatdecimal = (value) => {
  return value.toFixed(2);
};
</script>

<style></style>
