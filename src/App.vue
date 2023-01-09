<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
  .content-nav {
    height: 40px;
    background: #f5f7fa;
    margin: 0 0 10px 0;
    display: flex;
  }

    .content-nav .breadcrumb {
        height: 40px;
        line-height: 40px;
        flex: 1;
        color: #8492A6;
    }

    .content-nav .operation-nav {
        width: auto;
        display: flex;
        align-items: center;
    }

    .content-main {
        padding: 20px;
        background: #fff;
    }
</style>