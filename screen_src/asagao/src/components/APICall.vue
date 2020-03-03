<template>
  <div class="APIcall_container">
    <input class="submit" type="submit" value="更新" @click="exe" />
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {};
  },
  methods: {
    async exe() {
      //$emit イベントを送出するもの
      this.$emit("loadStart");
      const { data } = await axios.get(
        `https://wvgpmj09ce.execute-api.ap-northeast-1.amazonaws.com/dev/students/morita/plants/1`
      );
      this.$emit("loadComplete", { results: data.items });
    }
  }
};
</script>

<style scoped>
.APIcall_container {
  display: flex;
  justify-content: center;
  height: 70px;
  padding: 20px;
  background-color: aquamarine;
  box-sizing: border-box;
}
.text {
  width: 50%;
  max-width: 300px;
  padding: 0.5em;
  border: none;
}

.submit {
  padding: 0.5em 2em;
  margin-left: 10px;
  color: #fff;
  background-color: #42b883;
  border: none;
  border-radius: 20px;
}
</style>
