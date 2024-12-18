<template>
    <div>
      <div ref="chartContainer" :style="{ width: '100%', height: '400px' }"></div>
      <button v-for="(dataset, index) in datasets" :key="index" @click="switchDataset(index)">
        切换数据 {{ index + 1 }}
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue';
  import * as echarts from 'echarts';
  
  // 接收 props
  defineProps({
    datasets: {
      type: Array,
      required: true,
    },
  });
  
  const currentDatasetIndex = ref(0); // 当前数据索引
  const chartContainer = ref(null); // DOM 引用
  let chart = null; // ECharts 实例
  
  // 初始化图表
  const initChart = () => {
    if (chartContainer.value) {
      chart = echarts.init(chartContainer.value);
  
      const option = {
        title: {
          text: '学分未修满人数统计',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          bottom: '0%',
        },
        series: [
          {
            name: '未修满人数',
            type: 'pie',
            radius: '50%',
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
  
      chart.setOption(option);
    }
  };
  
  // 更新图表数据
  const updateChart = () => {
    if (datasets.length > 0) {
      const data = datasets[currentDatasetIndex.value];
      chart.setOption({
        series: [
          {
            data,
          },
        ],
      });
    }
  };
  
  // 切换数据集
  const switchDataset = (index) => {
    currentDatasetIndex.value = index;
    updateChart();
  };
  
  // 监听 props 数据变化
  watch(
    () => datasets,
    () => {
      updateChart();
    },
    { deep: true }
  );
  
  // 在组件挂载时初始化图表并设置数据
  onMounted(() => {
    initChart();
    updateChart();
  });
  </script>
  
  <style scoped>
  button {
    margin: 5px;
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  