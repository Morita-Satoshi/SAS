<template>
  <div>
    <ul class="list">
      <li class="item" v-for="item of items" :key="item.trackId">{{item}}</li>
    </ul>
    <Loading class="loading" v-show="loadProgress" />
  </div>
</template>

<script>
import Loading from "@/components/Loading";
export default {
  props: ["items", "loadProgress"],
  components: {
    Loading
  },
  methods: {},
  computed: {}
};
</script>

<style scoped>
.item {
  padding: 20px 0;
  text-decoration: none;
  -webkit-transition: 0.2s ease-in-out;
  -moz-transition: 0.2s ease-in-out;
  -o-transition: 0.2s ease-in-out;
  transition: 0.2s ease-in-out;
}
.item:nth-of-type(even) {
  background-color: #f5f5f5;
}
.item:hover {
  border: solid 5px #35495e;
}
.item-inner {
  display: flex;
  width: 90%;
  max-width: 800px;
  margin: auto;
}
.photo {
  flex: 0 0 150px;
}
.photo-img {
  width: 50%;
  display: block;
}
.content {
  flex: 1 1;
  padding-left: 20px;
}
.title {
  color: #42b883;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
}
.good {
  display: flex;
  color: #42b883;
  font-size: 4rem;
  font-weight: 900;
  justify-content: center;
  align-items: center;
  padding-left: 4rem;
}
</style>