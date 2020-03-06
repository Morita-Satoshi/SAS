<template>
  <v-layout>
    <v-flex class="text-center">
      <!--
      <div>
        <v-card color="blue" dark>
          <v-card-text>
            {{message.selectMovie1}}
            <v-sheet color="rgba(0, 0, 0, .12)">
            </v-sheet>
          </v-card-text>
        </v-card>
        <v-card width="160" height="120" v-for="item in sample" :key="item.name">{{item.name}}
        </v-card>
      </div>
      -->
      <div>
        <button
          type="button"
          v-for="item in sample"
          :key="item.name"
          class="v-btn vv-btn--contained v-size--large theme-light"
          @click="getMovie(item)"
        >{{item.name + message.getMovie}}</button>
        <button
          type="button"
          class="v-btn vv-btn--contained v-size--large theme-light"
          @click="playMovie"
        >動画再生</button>
        <button
          type="button"
          class="v-btn vv-btn--contained v-size--large theme-light"
          @click="pauseMovie"
        >動画停止</button>
      </div>
      <video
        id="video1"
        :src="movieData.url1"
        width="320"
        height="240"
        preload="none"
        autoplay
        muted
        playsinline
        controls
      ></video>
      <video
        id="video2"
        :src="movieData.url2"
        width="320"
        height="240"
        preload="none"
        autoplay
        muted
        playsinline
        controls
      ></video>
      <div class="align-center">
        <v-subheader>100点満点でふりかえろう。(右が100点だよ！)</v-subheader>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6" class="pr-4">
              <v-slider v-model="slider" class="align-center" :max="100" :min="0" hide-details>
                <template v-slot:append>
                  <v-text-field
                    id="userScore"
                    v-model="slider"
                    class="mt-0 pt-0"
                    hide-details
                    single-line
                    type="number"
                    style="width: 60px"
                  ></v-text-field>
                </template>
              </v-slider>
            </v-col>
          </v-row>
        </v-card-text>
        <v-col cols="12" md="6">
          <v-textarea id="userEvaluate" outlined name="input-7-4" label="今日の感想を書こう"></v-textarea>
        </v-col>
        <div cols="12" md="6" class="my-2">
          <v-btn small @click="postEvaluation">とうろく</v-btn>
        </div>
      </div>
    </v-flex>
  </v-layout>
  <!-- 点数づけ -->
</template>

<script>
import api from "../store/api";
export default {
  data() {
    return {
      moviePath: "",
      message: {
        selectMovie1: "1つ目の動画を選んでください",
        selectMovie2: "2つ目の動画を選んでください",
        getMovie: "動画取得",
        playMovie: "動画再生"
      },
      sample: [
        { name: "Eguchi", s3BucketPath: "eguchi" },
        { name: "Morita", s3BucketPath: "morita" },
        { name: "Yaguchi", s3BucketPath: "yaguchi" }
      ],
      awsS3Info: {
        bucket: "sas-noboru-upload",
        region: "ap-northeast-1"
      },
      s3BucketList: {},
      s3MovieList: {},
      movieData: {
        url1: "",
        url2: ""
      },
      counter: 0,
      movieFormat: ".mov" // 動画ファイル拡張子 -> 小文字で定義すること
    };
  },
  created() {
    console.log("created");
    var self = this;
    self.s3BucketList = {};
    self.s3MovieList = {};
    self.getCredentials();
    self.getS3BucketList();
  },
  computed: {},
  methods: {
    compareImage(e) {
      this.$store.commit("compare/compare");
    },
    // LoginUser情報取得
    getLoginUser: function() {
      console.log("getLoginUser");
    },
    // Credential情報取得
    getCredentials: function() {
      console.log("getCredentials");
      var self = this;
      var AWS = require("aws-sdk");
      const store = window.$nuxt.$store;
      AWS.config.region = self.awsS3Info.region;
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: store.getters["user/identityID"]
      });
    },
    getS3Instance: function() {
      var self = this;
      return new AWS.S3({
        params: {
          Bucket: self.awsS3Info.bucket,
          Region: self.awsS3Info.region
        }
      });
    },
    // S3バケットの中身を取得
    getS3BucketList: function() {
      console.log("getS3BucketList");
      var self = this;
      var s3 = self.getS3Instance();
      s3.listObjects(function(err, data) {
        if (err) {
          console.log("listObjects err: " + err);
        } else {
          console.log("listObjects success: " + JSON.stringify(data.Contents));
          self.s3BucketList = data.Contents;
          data.Contents.forEach(item => {
            var key = item.Key;
            console.log("key: " + key);
            if (key.toLowerCase().indexOf(self.movieFormat) !== -1) {
              self.pushMovieList(key);
            }
          });
        }
      });
    },
    // 動画リスト
    pushMovieList: function(key) {
      console.log("pushMovieList key: " + key);
      var self = this;
      self.sample.forEach(item => {
        if (key.indexOf(item.s3BucketPath) !== -1) {
          self.s3MovieList[item.name] = key;
        }
      });
      console.log("S3 Movie List: " + JSON.stringify(self.s3MovieList));
    },
    // 動画取得
    getMovie: function(item) {
      console.log("getMovie item: " + JSON.stringify(item));
      var self = this;
      console.log("key: " + JSON.stringify(self.s3MovieList));

      var s3 = self.getS3Instance();
      const signedUrl = s3.getSignedUrl(
        "getObject",
        {
          Bucket: self.awsS3Info.bucket,
          Key: self.s3MovieList[item.name],
          Expires: 60
        },
        (err, signedUrl) => {
          if (err) {
            console.log("getSignedUrl err: " + err);
          } else {
            console.log("getSignedUrl success: " + signedUrl);
            if (!(self.counter % 2)) {
              self.movieData.url1 = signedUrl;
              self.counter++;
            } else {
              self.movieData.url2 = signedUrl;
              self.counter--;
            }
          }
        }
      );
    },
    // 一括動画再生
    playMovie: function() {
      console.log("playMovie");
      var self = this;
      var v1 = document.getElementById("video1");
      var v2 = document.getElementById("video2");
      v1.play();
      v2.play();
    },
    // 一括動画停止
    pauseMovie: function() {
      console.log("pauseMovie");
      var self = this;
      var v1 = document.getElementById("video1");
      var v2 = document.getElementById("video2");
      v1.pause();
      v2.pause();
    },
    postEvaluation: function() {
      const store = window.$nuxt.$store;
      api
        .post("/user/self-evaluate", {
          username: store.getters["user/username"],
          score: document.getElementById("userScore")._value,
          comment: document.getElementById("userEvaluate")._value
        })
        .then(() => {
          // async authentication
          // logged in
          // if a user logged in successfully then redirect to root page (pages/index.vue).
          alert("記録ありがとう");
        })
        .catch(error => {
          // login error
          if (error.response) {
            if (error.response.status == 401) this.error = "401エラー:";
            else if (error.response.status == 500)
              this.error = "500エラー:サーバーエラー";
            else if (error.response.status == 501)
              this.error = "501エラー:サーバーエラー";
          } else this.error = error;
          this.loggingin = false;
        });
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
