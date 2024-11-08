<script setup>
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
import Header from '../common/header.vue'


</script>

<template>
  <el-container>
      <el-header class="headColor">
          <Header></Header>
      </el-header>
        <el-container class="header">  
          <!-- <el-aside class="asideWidth">
            <Aside @collapse="isCollapse" ref="aside"></Aside>
          </el-aside> -->
          <el-main style="background-color: #ededed; padding: 0; height: 100%">
              <RouterView />
          </el-main>
        </el-container>
  </el-container>
</template>
<style>
    html, body, #app, .home, .el-container {
      margin: 0 !important;
      padding: 0 !important;
      height: 100% !important;
    }
  </style>
  <style scoped>
    .headColor {
      height: 70px;
      background-color: #5a8bff;
      padding: 0;
      margin: 0;
    }
    .asideWidth {
      /*background-image: linear-gradient(rgba(90,139,255,1), white);*/
      border-right: 1px solid #e6e6e6;
      width: 240px;
      transition: 0.2s;
      height: 100%
    }
    .el-card__body {
      padding: 0;
    }
    .copyright {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 24px;
      line-height: 20px;
      text-align: center;
      width: 100%;
      font-size: 12px;
      color: #666;
    }
  </style>
  