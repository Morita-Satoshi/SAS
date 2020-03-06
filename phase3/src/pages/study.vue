<template>
  <div>
    <h1>ピッチングを学んでみよう</h1>
    <div id="tabs" class="container">
      <div class="tabs">
          <a v-on:click="activetab=1" v-bind:class="[ activetab === 1 ? 'active' : '' ]">
              <img :src = "displayImages[0].tab" class="resize_image tab_image" aspect-ratio="1">
          </a>
          <a v-on:click="activetab=2" v-bind:class="[ activetab === 2 ? 'active' : '' ]">
              <img :src = "displayImages[1].tab" class="resize_image tab_image" aspect-ratio="1">
          </a>
          <a v-on:click="activetab=3" v-bind:class="[ activetab === 3 ? 'active' : '' ]">
              <img :src = "displayImages[2].tab" class="resize_image tab_image" aspect-ratio="1">
          </a>
          <a v-on:click="activetab=4" v-bind:class="[ activetab === 4 ? 'active' : '' ]">
              <img :src = "displayImages[3].tab" class="resize_image tab_image" aspect-ratio="1">
          </a>
          <a v-on:click="activetab=5" v-bind:class="[ activetab === 5 ? 'active' : '' ]">
              <img :src = "displayImages[4].tab" class="resize_image tab_image" aspect-ratio="1">
          </a>
      </div>
      <div class="content">
          <div v-show="activetab === 1" class="tabcontent">
              <img :src = "displayImages[0].contents" class="resize_image contents_image" aspect-ratio="1">
          </div>
          <div v-show="activetab === 2" class="tabcontent">
              <img :src = "displayImages[1].contents" class="resize_image contents_image" aspect-ratio="1">
          </div>
          <div v-show="activetab === 3" class="tabcontent">
              <img :src = "displayImages[2].contents" class="resize_image contents_image" aspect-ratio="1">
          </div>
          <div v-show="activetab === 4" class="tabcontent">
              <img :src = "displayImages[3].contents" class="resize_image contents_image" aspect-ratio="1">
          </div>
          <div v-show="activetab === 5" class="tabcontent">
              <img :src = "displayImages[4].contents" class="resize_image contents_image" aspect-ratio="1">
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    data(){
      return {
        displayImages: [
        { tab: '/study_tab_1.jpg', contents: '/study_contents_1.jpg' },
        { tab: '/study_tab_2.jpg', contents: '/study_contents_2.jpg' },
        { tab: '/study_tab_3.jpg', contents: '/study_contents_3.jpg' },
        { tab: '/study_tab_4.jpg', contents: '/study_contents_4.jpg' },
        { tab: '/study_tab_5.jpg', contents: '/study_contents_5.jpg' },
      ],
        activetab: 1,
      }
    }
}
</script>

<style>

img.resize_image.tab_image {
  max-width:20%;
  height: auto;
  display: inline-block;
}

img.resize_image.contents_image {
    max-width:100%;
    height: auto;
    display: block;
}

</style>