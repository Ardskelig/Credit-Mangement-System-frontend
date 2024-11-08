<template>
  <div style="color: white">
    <!-- <img src="../assets/vue.svg" alt="" width="20" height="40" style="margin: 10px 90px 10px 50px;float: left" /> -->
    <i class="el-icon-menu collapse" @click="clickCollapse" style="margin-right: 20px;float: left"></i>
    <div class="misName">学生成绩管理系统</div>
  </div>
</template>

<script>
export default {
  methods: {
    clickCollapse() {
      console.log('Menu collapsed/expanded');
    }
  }
};
</script>

<style scoped>
  /* 旋转的关闭按钮 */
  .collapse {
    font-size: 25px;
    float: right;
    line-height: 60px;
    transition: 0.2s;
    transform: rotate(-180deg);
    cursor: pointer;
  }

  .collapse:hover {
    transition: 0.2s;
    transform: rotate(180deg);
  }

  .misName {
    margin-left: 50px;
    float: left;
    font-size: 24px;
    line-height: 60px;
  }
</style>
