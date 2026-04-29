<template>
    <div class="logo-loading-container">
      <div class="loading-bg"></div>
      <div class="logo-container">
        <img class="spin" src="../../public/logo-circle.png" alt="" />
        <img class="text" src="../../public/108job-logo-text.png" alt="" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts"></script>
  
  <style scoped lang="scss">
  .logo-loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 9999;
    .loading-bg {
      backdrop-filter: blur(3px);
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      z-index: 9999;
    }
    .logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 9999;
      img {
        width: 8vw;
        &.spin {
          -webkit-animation: spin 3s infinite linear;
          animation: spin 3s infinite linear;
          @keyframes spin {
            from {
              -webkit-transform: rotate(0deg);
            }
            to {
              -webkit-transform: rotate(359deg);
            }
          }
        }
        &.text {
          position: absolute;
          width: 40px;
        }
      }
    }
  }
  </style>
  