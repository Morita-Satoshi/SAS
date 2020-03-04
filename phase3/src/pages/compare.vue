<template>
  <v-layout>
    <v-flex class="text-center">
      <div>
        <button type="button" v-for="item in sample" :key="item.name" class="v-btn vv-btn--contained v-size--large theme-light" @click="playMovie(item)">{{item.name + message.playMovie}}</button>
      </div>
      <video :src="moviePath" width="320" height="240" preload="none" controls>
      </video>  
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      debugFlag: true,
      moviePath: '',
      message: {
        playMovie: '動画再生',
      },
      sample: [
        { name: 'Eguchi' , s3BucketPath: 'eguchi',  localpath: '/eguchi/1583215200.mov'  },
        { name: 'Morita' , s3BucketPath: 'morita',  localpath: '/morita/1583215200.mov'  },
        { name: 'Yaguchi', s3BucketPath: 'yaguchi', localpath: '/yaguchi/1583215200.mov' },
      ],
      awsS3Info: {
        bucket: 'sas-noboru-upload',
        region: 'ap-northeast-1',
      },
      s3BucketList: {},
      s3MovieList: {},
      movieFormat: '.mov',
    }
  },
  created() {
    console.log('created');
    var self = this;
    self.s3BucketList = {};
    self.s3MovieList = {};
    self.getCredentials();
    self.getS3BucketList();
  },
  computed: {
  },
  methods: {
    compareImage(e) {
      this.$store.commit("compare/compare");
    },
    // LoginUser情報取得
    getLoginUser: function() {
      console.log('getLoginUser');
    },
    // Credential情報取得
    getCredentials: function() {
      console.log('getCredentials');
      var self = this;
      var AWS = require('aws-sdk');
      const store = window.$nuxt.$store;
      AWS.config.region = self.awsS3Info.region;
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: store.getters['user/identityID']
      });
    },
    getS3Instance: function() {
      var self = this;
      return new AWS.S3({
        params: {
          Bucket: self.awsS3Info.bucket,
          Region: self.awsS3Info.region,
        }
      });
    },
    // S3バケットの中身を取得
    getS3BucketList: function() {
      console.log('getS3BucketList');
      var self = this;
      var s3 = self.getS3Instance();
      s3.listObjects(function(err, data) {
        if (err) {
          console.log('listObjects err: ' + err);
        }
        else {
          console.log('listObjects success: ' + JSON.stringify(data.Contents));
          self.s3BucketList = data.Contents;
          data.Contents.forEach(item => {
            var key = item.Key;
            if (key.toLowerCase().indexOf(self.movieFormat) !== -1) {
              self.pushMovieList(key);
            }
          })
        }
      });
    },
    // 動画リスト
    pushMovieList: function(key) {
      console.log('pushMovieList key: ' + key);
      var self = this;
      self.sample.forEach(item => {
        if (key.indexOf(item.s3BucketPath) !== -1) {
          self.s3MovieList[item.name] = key;
        }
      });
      console.log('S3 Movie List: ' + JSON.stringify(self.s3MovieList));
    },
    // 動画取得
    getMovie: function(item) {
      console.log('getMovie item: ' + item);
      var self = this;
      console.log('key: ' + JSON.stringify(self.s3MovieList));
      var s3 = self.getS3Instance();
      s3.getObject({
        Bucket: self.awsS3Info.bucket,
        Key: self.s3MovieList[item],
      },
      function(err, data) {
        if (err) {
          console.log('getObject err: ' + err);
        }
        else {
          console.log('getObject success: ' + JSON.stringify(data));
        }
      });
    },
    // 動画再生
    playMovie: function(item) {
      console.log('playMovie item: ' + JSON.stringify(item));
      var self = this;
      if (self.debugFlag) {
        self.moviePath = item.localpath;
      }
      else {
      }
    },
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
