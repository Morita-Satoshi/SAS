<template>
  <v-layout>
    <v-flex class="text-center">
      <!-- 画像表示領域 [S] -->
      <div class="image">
        <v-img v-bind:src="image.url" width="320px" height="320px" />
      <!-- 画像表示領域 [E] -->
      <!-- ログインユーザーの画像リスト表示領域 [S] -->
        <select
          style="border: 2px solid blue"
          v-model="selected.image"
          @change="getImageInfo($event)"
        >
        <option disabled value>{{message.selectImage}}</option>
        <option
          v-for="(item, index) in uiDisplay"
          :key="index"
          :value="item.imageName"
        >{{item.imageName}}</option>
        </select>
      </div>
      <!-- ログインユーザーの画像リスト表示領域 [E] -->
      <!-- お手本表示領域 [S] -->
      <div class="align-center">
        <v-subheader>{{"君はこの選手に似ている"}}</v-subheader>
        <v-row>
          <v-col cols="6">
            <v-card>
              <img :src="models[0].image" v-show="models[0].similar==true" class="resize-for-mobile similar" />
              <img :src="models[0].image" v-show="models[0].similar==false" class="resize-for-mobile" />
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card>
              <img :src="models[1].image" v-show="models[1].similar==true" class="resize-for-mobile similar" />
              <img :src="models[1].image" v-show="models[1].similar==false" class="resize-for-mobile" />
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card>
              <img :src="models[2].image" v-show="models[2].similar==true" class="resize-for-mobile similar" />
              <img :src="models[2].image" v-show="models[2].similar==false" class="resize-for-mobile" />
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card>
              <img :src="models[3].image" v-show="models[3].similar==true" class="resize-for-mobile similar" />
              <img :src="models[3].image" v-show="models[3].similar==false" class="resize-for-mobile" />
            </v-card>
          </v-col>
        </v-row>
      </div>
      <!-- お手本表示領域 [E] -->
    </v-flex>
  </v-layout>
</template>
<script>
import Vue from "vue";
import Loading from "vue-loading-overlay";
// Import stylesheet
import "vue-loading-overlay/dist/vue-loading.css";
// Init plugin
Vue.use(Loading);
import api from "../store/api";
var $ = require('jquery');
export default {
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start();
      setTimeout(() => this.$nuxt.$loading.finish(), 500);
    });
  },
  data() {
    return {
      // S3から取得した画像情報
      s3Image: [
        {
          // フォルダ名 folderName
          // 画像パス imagePath
        }
      ],
      // UI表示情報
      uiDisplay: [
        {
          // ユーザー名 userName
          // 動画名 imageName
        }
      ],
      // 選択画像のキー
      selected: {
        image: ""
      },
      // AWS S3情報
      awsS3: {
        bucket: "sas-noboru-analysis",
        region: "ap-northeast-1"
      },
      // 見本の情報
      models: [
        { name: "OHTANI"   , folderName: "ABC", image: "/model_1.jpg", similar: false },
        { name: "EGUCHI"   , folderName: "DEF", image: "/model_2.jpg", similar: false },
        { name: "STRASBURG", folderName: "GHI", image: "/model_3.jpg", similar: false },
        { name: "MOINELO"  , folderName: "XYZ", image: "/model_4.jpg", similar: false }
      ],
      // ログインユーザー名
      loginUserName: null,
      // 画像ファイル拡張子(小文字で定義)
      imageExtension: ".jpg",
      // メッセージリスト
      message: {
        selectImage: "画像を選んでください",
        knowYourself: "君に似ているピッチャーはこれ"
      },
      image: { url: "" },
      score: 80,
      api: {
        url: "https://13bg49njm7.execute-api.ap-northeast-1.amazonaws.com/dev/classification",
      }
    };
  },
  created() {
    console.log("created");
    var self = this;
    self.initialize();
    self.getLoginUserName();
    self.getCredentials();
    self.createS3ImageList();
  },
  computed: {},
  methods: {
    compareImage(e) {
      this.$store.commit("compare/compare");
    },
    // 初期化処理
    initialize: function() {
      var self = this;
      self.s3Image = [];
      self.uiDisplay = [];
      self.convertUIToS3 = [];
    },
    // LoginUser名情報取得
    getLoginUserName: function() {
      var self = this;
      const store = window.$nuxt.$store;
      self.loginUserName = store.getters["user/username"];
    },
    // Credential情報取得
    getCredentials: function() {
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
    // S3画像リスト生成
    createS3ImageList: function() {
      var self = this;
      var s3 = self.getS3Instance();
      // S3内オブジェクトリスト取得
      s3.listObjects(function(error, data) {
        if (error) {
          console.log("listObjects error: ", error);
        } else {
          console.log("listObjects success");
          var objectList = data.Contents;
          objectList.forEach(item => {
            var filepath = item.Key;
            if (filepath.toLowerCase().indexOf(self.imageExtension) !== -1) {
              // ファイルパスに対象画像の拡張子が含まれている
              self.pushS3ImageList(filepath);
            }
          });
        }
      });
    },
    pushS3ImageList: function(filepath) {
      var self = this;
      // 見本の動画リストをチェック
      self.models.forEach(item => {
        if (
          filepath.indexOf(item.folderName) !== -1
        ) {
          var imageName = self.getImageName(item.userName, filepath);
          // 画像パスを格納
          self.s3Image.push({
            folderName: item.folderName,
            path: filepath,
          });
          self.uiDisplay.push({
            userName: item.userName,
            imageName: imageName
          });
          var index = self.getIndexFromObjectArray(
            self.s3Image,
            "path",
            filepath
          );
        }
      });
      // ログインユーザーのチェック
      if (
        filepath.indexOf(self.loginUserName) !== -1
      ) {
        var imageName = self.getImageName(self.loginUserName, filepath);
        self.s3Image.push({
          folderName: self.loginUserName,
          path: filepath,
        });
        self.uiDisplay.push({
          userName: self.loginUserName,
          imageName: imageName
        });
        var index = self.getIndexFromObjectArray(
          self.s3Image,
          "path",
          filepath
        );
      }
    },
    getIndexFromObjectArray: function(objArray, targetKey, targetValue) {
      var self = this;
      var index = -1;
      for (var i = 0; i < objArray.length; i++) {
        if (objArray[i][targetKey] == targetValue) {
          index = i;
          break;
        }
      }
      return index;
    },
    // 画像名取得
    getImageName: function(userName, filepath) {
      var self = this;
      var unixTime = self.getUnixTime(filepath);
      var time = self.convertUnixTimeToTime(unixTime);
      //return userName + "_" + time;
      return time;
    },
    // Unix時間の取得
    getUnixTime: function(filepath) {
      return filepath.match(/\d+/);
    },
    // Unix時間 <-> 時刻変換
    convertUnixTimeToTime: function(targetUnixTime) {
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
    // getSignedUrlラッパー
    getSignedUrl: function(bucket, key, expires) {
      console.log(
        "getSignedUrl bucket: " +
        bucket +
        " key: " +
        key +
        " expires: " +
        expires
      );
      var self = this;

      var s3 = self.getS3Instance();
      const signedUrl = s3.getSignedUrl(
        "getObject",
        {
          Bucket: bucket,
          Key: key,
          Expires: expires
        },
        (err, signedUrl) => {
          if (err) {
            console.log("getSignedUrl err: " + err);
          } else {
            console.log("getSignedUrl success");
            self.image.url = signedUrl;
          }
        }
      );
    },
    // 解析データ取得
    getAnalysisData: function(imagePath) {
      var self = this;
      var unixTime = self.getUnixTime(imagePath);
      var params = {
        "async": true,
        "crossDomain": true,
        "url": self.api.url + "?" + unixTime,
        "method": "GET",
      };
      $.ajax(
        params,
      ).done(function(responseData, textStatus, jqXHR) {
        self.selectSimilarImage(responseData);
      }).fail(function(jqXHR, textStatus, errorThrown) {
        console.log("error: " + textStatus);
      }).always(function() {
        console.log("complete");
    })
    },
    // 類似画像決定
    selectSimilarImage: function(responseData) {
      var self = this;
      self.models.forEach(item=> {
        item.similar = false;
      });
      var data = Object.values(responseData);
      var value = -1
      var index = 0;
      for (let i = 0; i < data.length; i++) {
        if (value < data[i]) {
          value = data[i];
          index = i;
        }
      }
      self.models[index].similar = true;
    },
    // 画像＋解析データ取得
    getImageInfo: function(event) {
      console.log(
        "getImageInfo event: " + JSON.stringify(event)
      );
      var self = this;
      var selected = self.selected.image;
      var index = self.getIndexFromObjectArray(
        self.uiDisplay,
        "imageName",
        selected
      );
      self.getSignedUrl(self.awsS3.bucket, self.s3Image[index].path, 60);
      self.getAnalysisData(self.s3Image[index].path);
    }
  }
};
</script>

<style>
/* .row.align { */
  /* text-align: center; */
  /* display: inherit; */
  /* justify-content: center; */
/* } */

div.image {
  text-align: center;
  width: 320px;
  height: 320px;
  display: inline-block;
}

img.similar {
  border: 2px red solid;
}

img.resize-for-mobile {
  width: 320px;
  height: 320px;
}
</style>
