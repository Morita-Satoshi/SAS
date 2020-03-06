<template>
  <v-layout>
    <v-flex class="text-center">
      <!-- 1つ目のMovieの表示領域 [S] -->
      <div>
        <video
          id="video1"
          class="video_size"
          :src="movieData[0].url"
          preload="none"
          muted
          playsinline
          controls
        ></video>
        <div>
          <select
            style="border: 2px solid blue"
            v-model="selected.movie1"
            @change="getMovie($event, 0)"
          >
            <option disabled value>{{message.selectMovie1}}</option>
            <option
              v-for="(item, index) in uiDisplay"
              :key="index"
              :value="item.movieName"
            >{{item.movieName}}</option>
          </select>
        </div>
      </div>
      <!-- 1つ目のMovieの表示領域 [E] -->
      <!-- 2つ目のMovieの表示領域 [S] -->
      <div>
        <video
          id="video2"
          class="video_size"
          :src="movieData[1].url"
          preload="none"
          muted
          playsinline
          controls
        ></video>
        <div>
          <select
            style="border: 2px solid blue"
            v-model="selected.movie2"
            @change="getMovie($event, 1)"
          >
            <option disabled value>{{message.selectMovie2}}</option>
            <option
              v-for="(item, index) in uiDisplay"
              :key="index"
              :value="item.movieName"
            >{{item.movieName}}</option>
          </select>
        </div>
      </div>
      <!-- 2つ目のMovieの表示領域 [E] -->
      <!-- 再生/停止ボタン表示領域 [S] -->
      <div v-show="(movieData[0].url != null && movieData[1].url != null) == true">
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
      <!-- 採点パート -->
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
      // S3動画情報
      s3Movie: [
        {
          // フォルダ名 folderName
          // 動画パス path
        }
      ],
      // UI表示情報
      uiDisplay: [
        {
          // ユーザー名 userName
          // 動画名 movieName
        }
      ],
      // 選択動画のキー
      selected: {
        movie1: "",
        movie2: ""
      },
      // AWS S3情報
      awsS3: {
        bucket: "sas-noboru-upload",
        region: "ap-northeast-1"
      },
      // 見本の情報
      models: [
        { userName: "Eguchi", folderName: "eguchi" },
        { userName: "Morita", folderName: "morita" },
        { userName: "Yaguchi", folderName: "yaguchi" }
      ],
      // ログインユーザー名
      loginUserName: null,
      // 動画ファイル拡張子(小文字で定義)
      movieExtension: ".mov",
      // メッセージリスト
      message: {
        selectMovie1: "1つ目の動画を選んでください",
        selectMovie2: "2つ目の動画を選んでください",
        getMovie: "動画取得",
        playMovie: "動画再生"
      },
      movieData: [{ url: null }, { url: null }]
    };
  },
  created() {
    console.log("created");
    var self = this;
    self.initialize();
    self.getLoginUserName();
    self.getCredentials();
    self.createS3MovieList();
  },
  computed: {},
  methods: {
    compareImage(e) {
      this.$store.commit("compare/compare");
    },
    // 初期化処理
    initialize: function() {
      console.log("initialize");
      var self = this;
      self.s3Movie = [];
      self.uiDisplay = [];
      self.convertUIToS3 = [];
    },
    // LoginUser名情報取得
    getLoginUserName: function() {
      console.log("getLoginUser");
      var self = this;
      const store = window.$nuxt.$store;
      self.loginUserName = store.getters["user/username"];
    },
    // Credential情報取得
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
    // S3アクセス用インスタンス取得
    getS3Instance: function() {
      var self = this;
      return new AWS.S3({
        params: {
          Bucket: self.awsS3.bucket,
          Region: self.awsS3.region
        }
      });
    },
    // S3動画リスト生成
    createS3MovieList: function() {
      console.log("createS3MovieList");
      var self = this;
      var s3 = self.getS3Instance();
      // S3内オブジェクトリスト取得
      s3.listObjects(function(error, data) {
        if (error) {
          console.log("listObjects error: ", error);
        } else {
          console.log("listObjects success: " + JSON.stringify(data));
          var objectList = data.Contents;
          objectList.forEach(item => {
            var filepath = item.Key;
            console.log("filepath: " + filepath);
            if (filepath.toLowerCase().indexOf(self.movieExtension) !== -1) {
              // ファイルパスに動画ファイルの拡張子が含まれている
              self.pushS3MovieList(filepath);
            }
          });
        }
      });
    },
    pushS3MovieList: function(filepath) {
      console.log("pushS3MovieList: " + filepath);
      var self = this;
      // 見本の動画リストをチェック
      self.models.forEach(item => {
        if (filepath.indexOf(item.folderName) !== -1) {
          console.log("filepath: " + filepath);
          var movieName = self.getMovieName(item.userName, filepath);
          console.log("movieName: " + movieName);
          // 動画パスを格納
          self.s3Movie.push({ folderName: item.folderName, path: filepath });
          self.uiDisplay.push({
            userName: item.userName,
            movieName: movieName
          });
          var index = self.getIndexFromObjectArray(
            self.s3Movie,
            "path",
            filepath
          );
        }
      });
      console.log("loginUserName: " + self.loginUserName);
      // ログインユーザーのチェック
      if (filepath.indexOf(self.loginUserName) !== -1) {
        console.log("filepath: " + filepath);
        var movieName = self.getMovieName(self.loginUserName, filepath);
        console.log("movieName: " + movieName);
        self.s3Movie.push({ folderName: self.loginUserName, path: filepath });
        self.uiDisplay.push({
          userName: self.loginUserName,
          movieName: movieName
        });
        var index = self.getIndexFromObjectArray(
          self.s3Movie,
          "path",
          filepath
        );
      }
      console.log("s3Movie: " + JSON.stringify(self.s3Movie));
      console.log("uiDisplay: " + JSON.stringify(self.uiDisplay));
    },
    getIndexFromObjectArray: function(objArray, targetKey, targetValue) {
      console.log("getIndexFromObjectArray");
      var self = this;
      var index = -1;
      for (var i = 0; i < objArray.length; i++) {
        if (objArray[i][targetKey] == targetValue) {
          index = i;
          break;
        }
      }
      console.log("return index: " + index);
      return index;
    },
    // 動画名取得
    getMovieName: function(userName, filepath) {
      console.log("getMovieName filepath: " + filepath);
      var self = this;
      var unixTime = self.getUnixTime(filepath);
      console.log("unixTime: " + unixTime);
      var time = self.convertUnixTimeToTime(unixTime);
      console.log("time: " + time);
      return userName + "_" + time;
    },
    // Unix時間の取得
    getUnixTime: function(filepath) {
      console.log("getTime filepath: " + filepath);
      return filepath.match(/\d+/);
    },
    // Unix時間 <-> 時刻変換
    convertUnixTimeToTime: function(targetUnixTime) {
      console.log("convertUnixTimeToTime targetUnixTime: " + targetUnixTime);
      var unixTime = new Date(parseInt(targetUnixTime, 10) * 1000);
      var year = ("0" + unixTime.getFullYear()).slice(-4);
      var month = ("0" + (unixTime.getMonth() + 1)).slice(-2);
      var day = ("0" + unixTime.getDate()).slice(-2);
      var hour = unixTime.getHours();
      var minute = ("0" + unixTime.getMinutes()).slice(-2);
      var second = ("0" + unixTime.getSeconds()).slice(-2);
      //var time = year + '年' + month + '月' + day + '日' + hour + '時' + minute + '分' + second + '秒';
      var time =
        year +
        "/" +
        month +
        "/" +
        day +
        "_" +
        hour +
        ":" +
        minute +
        ":" +
        second;
      return time;
    },
    // 動画取得
    getMovie: function(event, which) {
      //console.log('getMovie item: ' + JSON.stringify(item));
      console.log(
        "getMovie event: " + JSON.stringify(event) + " which: " + which
      );
      var self = this;
      var selected = which == 0 ? self.selected.movie1 : self.selected.movie2;
      console.log("getMovie selected: " + selected);
      var index = self.getIndexFromObjectArray(
        self.uiDisplay,
        "movieName",
        selected
      );
      var s3 = self.getS3Instance();

      const signedUrl = s3.getSignedUrl(
        "getObject",
        {
          Bucket: self.awsS3.bucket,
          Key: self.s3Movie[index].path,
          Expires: 60
        },
        (err, signedUrl) => {
          if (err) {
            console.log("getSignedUrl err: " + err);
          } else {
            console.log("getSignedUrl success: " + signedUrl);
            self.movieData[which].url = signedUrl;
            console.log(
              "self.movieData[" + which + "].url: " + self.movieData[which].url
            );
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

video.video_size {
  width: 320px;
  height: 240px;
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
