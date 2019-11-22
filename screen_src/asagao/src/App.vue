<template>
  <div id="app">
    <img
      alt="today"
      src="https://asagao-automation.s3-ap-northeast-1.amazonaws.com/images/download.jpg"
    />
    <HelloWorld msg="今日の朝顔の様子です！" />
    <APIcall
      class="APIcall"
      @loadStart="onLoadStart"
      @loadComplete="onLoadComplete"
    />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import APIcall from "./components/APICall.vue";

export default {
  name: "app",
  data() {
    return {
      items: [],
      loadProgress: false
    };
  },
  method: {
    onLoadStart() {
      this.loadProgress = true;
    },
    onLoadComplete({ results }) {
      this.items = results;
      this.loadProgress = false;
    }
  },
  components: {
    HelloWorld,
    APIcall
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
