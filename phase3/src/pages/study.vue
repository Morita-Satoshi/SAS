<template>
  <div>
    <h1>ピッチングを学ぼう!</h1>
    <div id="tabs" class="container">
      <div class="tabs">
          <a v-on:click="activetab=1" v-bind:class="[ activetab === 1 ? 'active' : '' ]" @click=getBornImage(1)>
              <img :src = "displayImages[0].tab" class="image_size tab_image1">
          </a>
          <a v-on:click="activetab=2" v-bind:class="[ activetab === 2 ? 'active' : '' ]" @click=getBornImage(2)>
              <img :src = "displayImages[1].tab" class="image_size tab_image2">
          </a>
          <a v-on:click="activetab=3" v-bind:class="[ activetab === 3 ? 'active' : '' ]" @click=getBornImage(3)>
              <img :src = "displayImages[2].tab" class="image_size tab_images">
          </a>
          <a v-on:click="activetab=4" v-bind:class="[ activetab === 4 ? 'active' : '' ]" @click=getBornImage(4)>
              <img :src = "displayImages[3].tab" class="image_size tab_images">
          </a>
          <a v-on:click="activetab=5" v-bind:class="[ activetab === 5 ? 'active' : '' ]" @click=getBornImage(5)>
              <img :src = "displayImages[4].tab" class="image_size tab_images">
          </a>
      </div>
      <div class="content">
          <div v-show="activetab === 1" class="tabcontent">
              <img :src = "displayImages[0].contents" class="image_size contents_image">
          </div>
          <div v-show="activetab === 2" class="tabcontent">
              <img :src = "displayImages[1].contents" class="image_size contents_image">
          </div>
          <div v-show="activetab === 3" class="tabcontent">
              <img :src = "displayImages[2].contents" class="image_size contents_image">
          </div>
          <div v-show="activetab === 4" class="tabcontent">
              <img :src = "displayImages[3].contents" class="image_size contents_image">
          </div>
          <div v-show="activetab === 5" class="tabcontent">
              <img :src = "displayImages[4].contents" class="image_size contents_image">
          </div>
      </div>
      <div class="content" v-show="displayBornImage !== null">
        <div class="tabcontent">
          <img :src="displayBornImage" class="image_size contents_image">
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

        awsS3: {
          bucket: 'sas-noboru-analysis',
          region: 'ap-northeast-1',
        },
        fileInfo: {
          dirname: 'images',
          prefix: '1584630000',
          extension: '.jpg',
        },
        loginUserName: null,
        displayBornImage: null,
      }
    },
    created() {
      console.log("created");
      var self = this;
      self.initialize();
    },
    methods: {
      initialize: function() {
        console.log('initialize');
        var self = this;
        self.displayBornImage = null;
        const store = window.$nuxt.$store;
        self.loginUserName = store.getters["user/username"];
        self.getCredentials();
      },
      getCredentials: function() {
        console.log("getCredentials");
        var self = this;
        var AWS = require("aws-sdk");
        const store = window.$nuxt.$store;
        AWS.config.region = self.awsS3.region;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: store.getters["user/identityID"]
        });
      },
      getS3Instance: function() {
        var self = this;
        return new AWS.S3({
          params: {
            Bucket: self.awsS3.bucket,
            Region: self.awsS3.region
          }
        });
      },
      getSignedUrl: function(bucket, key, expires) {
        console.log('getSignedUrl bucket: ' + bucket + ' key: ' + key + ' expires: ' + expires);
        var self = this;

        var s3 = self.getS3Instance();
        const signedUrl = s3.getSignedUrl(
          'getObject',
          {
            Bucket: bucket,
            Key: key,
            Expires: expires
          },
          (err, signedUrl) => {
            if (err) {
              console.log('getSignedUrl err: ' + err);
            }
            else {
              console.log('getSignedUrl success: ' + signedUrl);
              self.displayBornImage = signedUrl;
            }
          }
        );
      },
      getBornImage: function(index) {
        console.log('getBornImage index: ' + index);
        var self = this;

        var key = self.loginUserName + '/' + self.fileInfo.dirname + '/' + self.fileInfo.prefix + '_' + index + self.fileInfo.extension;
        self.getSignedUrl(self.awsS3.bucket, key, 300);
      }
    },
}
</script>

<style>

img.image_size.tab_image1{
  max-width:7%;
  height: auto;
  display: inline-block;
}

img.image_size.tab_image2 {
  max-width:15%;
  height: auto;
  display: inline-block;
}

img.image_size.tab_images{
  max-width:12%;
  height: auto;
  display: inline-block;
}

img.image_size.contents_image {
    max-width:100%;
    height: auto;
    display: inline-block;
}

</style>