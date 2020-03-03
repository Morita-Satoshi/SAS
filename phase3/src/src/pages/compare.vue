<template>
  <v-layout>
    <v-flex class="text-center">
    <div>
      <button type="button" class="v-btn vv-btn--contained v-size--large theme-light" @click="changeImage">{{message}}</button>
    </div>
  <div class="row align">
    <div class="col-xs-6 col-md-6">
      <img :src="displayImages[0].org" class="resize_image left_image" v-show="displayBornImage==false" aspect-ratio="1">
      <img :src="displayImages[1].org" class="resize_image left_image" v-show="displayBornImage==true" aspect-ratio="1">
      <img :src="displayImages[0].model" class="resize_image right_image" v-show="displayBornImage==false" aspect-ratio="1">
      <img :src="displayImages[1].model" class="resize_image right_image" v-show="displayBornImage==true" aspect-ratio="1">
    </div>
  </div>
      </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      message: "骨にする",
      displayImages: [
        { org: '/kids_before.png', model: '/morita_before.png' },
        { org: '/kids_after.png' , model: '/morita_after.png' },
      ],
      displayBornImage: false,
    }
  },
  computed: {
  },
  methods: {
    compareImage(e) {
      this.$store.commit("compare/compare");
    },
    changeImage: function() {
      this.displayBornImage = !this.displayBornImage;
    }
  }
};
</script>

<style>
/*
// 表示領域が600px以上の場合
@media (min-width: 600px) {
}
// 表示領域が600px未満の場合
@media (max-width: 599px) {
}
*/

.row.align {
  text-align: center;
  display: inherit;
  justify-content: center;
}

img.resize_image {
  width: 266px;
  height: 200px;
  display: inline-block;
}

img.resize_image.left_image {
  margin-left: auto;
  padding: 10px;
}

img.resize_image.right_image {
  margin-right: auto;
  padding: 10px;
}

</style>
