<template>
  <div class="APIcall_container">
    <input class="text" type="text" v-model="qu" @keyup.enter="exe" />
    <input class="submit" type="submit" value="APIcall" @click="exe" />
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      qu: ""
    };
  },
  methods: {
    async exe() {
      this.$emit("loadStart");
      const { data } = await axios.get(
        `https://wvgpmj09ce.execute-api.ap-northeast-1.amazonaws.com/dev/students/morita/plants/${this.qu}`
      );
      this.$emit("loadDone", { results: data });
    }
  }
};
</script>

<style scoped>
div {
  border: 1px solid red;
}
h2 {
  color: red;
}
p {
  color: red;
}
</style>
