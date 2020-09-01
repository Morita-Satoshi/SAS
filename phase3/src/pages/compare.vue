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
        <v-row justify="center">
          <v-col cols="12" sm="6">
          <select
            class="cp_ipselect cp_sl04"
            v-model="selected.movie1"
            @change="getMovie($event, 0)"
            label="動画1"
          >
            <option disabled value>{{message.selectMovie1}}</option>
            <option
              v-for="(item, index) in uiDisplay"
              :key="index"
              :value="item.movieName"
            >{{item.movieName}}</option>
          </select>
          </v-col>
        </v-row>
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
        <v-row justify="center">
          <v-col cols="12" sm="6">
          <select
            class="cp_ipselect cp_sl04"
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
          </v-col>
        </v-row>
        </div>
      </div>
      <!-- 2つ目のMovieの表示領域 [E] -->
      <!-- 再生/停止ボタン表示領域 [S] -->
      <div v-show="(movieData[0].url != null && movieData[1].url != null) == true">
        <button
          type="button"
          class="v-btn v-btn--contained v-size--large theme-light"
          @click="playMovie"
        >{{message.playMovie}}</button>
        <button
          type="button"
          class="v-btn v-btn--contained v-size--large theme-light"
          @click="pauseMovie"
        >{{message.pauseMovie}}</button>
      </div>
      <!-- 採点パート -->
      <div class="align-center">
        <v-subheader>どの部分に関しての感想か選ぼう</v-subheader>
        <v-row justify="center">
          <v-col cols="2">
            <v-card v-on:click="motion=1;setAnalysisImage(1)" height="100%">
              <v-img :src="displayImages[0].tab" class="resize-for-mobile" />
            </v-card>
          </v-col>
          <v-col cols="2">
            <v-card v-on:click="motion=2;setAnalysisImage(2)" height="100%">
              <v-img :src="displayImages[1].tab" class="resize-for-mobile" />
            </v-card>
          </v-col>
          <v-col cols="2">
            <v-card v-on:click="motion=3;setAnalysisImage(3)" height="100%">
              <v-img :src="displayImages[2].tab" class="resize-for-mobile" />
            </v-card>
          </v-col>
          <v-col cols="2">
            <v-card v-on:click="motion=4;setAnalysisImage(4)" height="100%">
              <v-img :src="displayImages[3].tab" class="resize-for-mobile" />
            </v-card>
          </v-col>
          <v-col cols="2">
            <v-card v-on:click="motion=5;clearAnalysisImage()" height="100%">
              <v-img :src="displayImages[4].tab" class="resize-for-mobile" />
            </v-card>
          </v-col>
        </v-row>
        <!-- フォームの切り出しを表示 -->
        <v-row justify>
        <v-col cols="6" v-if="analysisImage[0].url != null">
          <p v-if="analysisImageAngle[0].angle !=null" class="score-charactor">{{"フォームの点数は"+Math.round(analysisImageAngle[0].score)+"点"}} </p>
          <v-img id="sceneImage0" :src="analysisImage[0].url"/>
          <p v-if="analysisImageAngle[0].angle !=null">{{backFormComment()+ Math.round(analysisImageAngle[0].angle) + "度"}} </p>
          <!-- 骨格表示ボタン -->
          <!-- <button
            type="button"
            class="v-btn v-btn--contained v-size--large"
            @click="drawBoneLine()"
          >ほねをみよう</button> -->
        </v-col>
        <v-col cols="6" v-if="analysisImage[1].url != null">
          <p v-if="analysisImageAngle[0].angle !=null" class="score-charactor">{{"フォームの点数は"+Math.round(analysisImageAngle[1].score)+"点"}} </p>
          <v-img id="sceneImage1" :src="analysisImage[1].url"/>
          <p v-if="analysisImageAngle[1].angle !=null">{{backFormComment() + Math.round(analysisImageAngle[1].angle) + "度"}} </p>
          <!-- 骨格表示ボタン -->
          <!-- <button
            type="button"
            class="v-btn v-btn--contained v-size--large"
            @click="drawBoneLine()"
          >ほねをみよう</button> -->
        </v-col>
        </v-row>
        <!-- 差分で得点を表示 -->
        </div>
        <v-card-text>
          <v-row justify>
            <v-col cols="12" md="6" class="pr-4">
              <v-text-field label="自分が思った得点を入力しよう" type="number" v-model="userScore" />
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-col cols="12" md="6">
          <v-textarea
           id="userEvaluate"
            outlined name="input-7-4" label="今日の感想を書こう"></v-textarea>
        </v-col>
        <div cols="12" md="6">
          <v-btn large @click="postEvaluation">記録</v-btn>
        </div>
      </div>
    </v-flex>
  </v-layout>
  <!-- 点数づけ -->
</template>

<script>
import Vue from "vue";
import Loading from "vue-loading-overlay";
// Import stylesheet
import "vue-loading-overlay/dist/vue-loading.css";
// Init plugin
Vue.use(Loading);
import api from "../store/api";
export default {
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start();
      setTimeout(() => this.$nuxt.$loading.finish(), 500);
    });
  },
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
        analysisBucket:"sas-noboru-analysis",
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
      // 骨動画ファイルPostFix
      // 動画ファイル拡張子(小文字で定義)
      movieExtension: ".mov",
      // メッセージリスト
      message: {
        selectMovie1: "1つ目の動画を選んでください",
        selectMovie2: "2つ目の動画を選んでください",
        getMovie: "動画取得",
        playMovie: "動画再生",
        pauseMovie: "動画停止",
      },
      //選択されているファイル名
      chosenMovieName:{
        movie1:"",
        movie2:"",
      },
      movieData: [{ url: null }, { url: null }],
      analysisImage: [{ url: null }, { url: null }],
      analysisImageAngle: [{ angle: null,score:null }, { angle: null,score:null }],
      retry: 0,
      maxRetry: 50,
      motion: 0,
      userScore :0,
      displayImages: [
        { tab: "/scene_1.jpg" },
        { tab: "/scene_2.jpg" },
        { tab: "/scene_3.jpg" },
        { tab: "/scene_4.jpg" },
        { tab: "/scene_5.jpg" }
      ]
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
    backFormComment: function(){
      switch(this.motion){
        case 1:
          return "軸足の膝から肩の角度:"
        case 2:
          return "投球肘の角度:"
        case 3:
          return "軸足から肩にかける背中の角度:"
        case 4:
          return "投球肘の角度:"
        case 5:
        default:
          break;
      }
    },
    clearAnalysisImage: function(){
      var self = this;
      self.analysisImage[0].url = null 
      self.analysisImage[1].url = null
      self.analysisImageAngle[0].angle = null 
      self.analysisImageAngle[0].score = null 
      self.analysisImageAngle[1].angle = null
      self.analysisImageAngle[1].score = null
    },
    setAnalysisImage: function(sceneNum){
      var self = this;

      if (!self.chosenMovieName.movie1 || !self.chosenMovieName.movie2){
        return
      }

      //uploads/トリミング
      var path1 = this.chosenMovieName.movie1.split("/")
      var sceneFileName1 = path1[1]+"/"+path1[2].split(".")[0] + "_" + sceneNum + ".jpg"
      var path2 = this.chosenMovieName.movie2.split("/")
      var sceneFileName2 = path2[1]+"/"+path2[2].split(".")[0] + "_" + sceneNum + ".jpg"

      //解析画像1をセット
      self.getSignedUrlForImage(self.awsS3.analysisBucket, sceneFileName1, 60,0)
      //解析画像2をセット
      self.getSignedUrlForImage(self.awsS3.analysisBucket, sceneFileName2, 60,1)

      //解析画像の角度情報設定
      //analysisImageAngle.angleに値をセット
      //uploads/xxxx/xxxx.jpgがファイル構成
      var dir = this.chosenMovieName.movie1.split("/")
      var user = dir[1]
      var datetimeScene1 = dir[2].split(".")[0]+"_"+sceneNum
      self.getAnalysisInformation(user,datetimeScene1,0)

      var dir2 = this.chosenMovieName.movie2.split("/")
      var user2 = dir2[1]
      var datetimeScene2 = dir2[2].split(".")[0]+"_"+sceneNum
      self.getAnalysisInformation(user2,datetimeScene2,1)
    },
    drawBoneLine: function(){
      //骨格テスト
      let image = new Image;
      image.crossOrigin = "Anonymous"
      alert(document.getElementById('sceneImage0'))
      image.src=document.getElementById('sceneImage0')
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");
 
      alert("image info")
      alert(image.width)
      alert(image.height)
      canvas.width  = image.width;
      canvas.height = image.height;

      context.drawImage(image, 0, 0);
      // test
      context.fillRect(25,25,100,100)

      const file = canvas.toDataURL("image/jpeg");
      
    },
    imageLoaded:function(){
    },
    getAnalysisInformation: function(user,datetime,which) {
      var self = this;
      api.get("/scene-angle?datetime_scene="+datetime+"&user="+user).then(resp => {
        self.analysisImageAngle[which].angle = resp['data']['angle']
        self.analysisImageAngle[which].score = resp['data']['score']
      }).catch(err=> {return} );
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
        if (
          filepath.indexOf(item.folderName) !== -1
        ) {
          console.log("filepath: " + filepath);
          var movieName = self.getMovieName(item.userName, filepath);
          console.log("movieName: " + movieName);
          // 動画パスを格納
          self.s3Movie.push({
            folderName: item.folderName,
            path: filepath,
          });
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
      if (
        filepath.indexOf(self.loginUserName) !== -1 
      ) {
        console.log("filepath: " + filepath);
        var movieName = self.getMovieName(self.loginUserName, filepath);
        console.log("movieName: " + movieName);
        self.s3Movie.push({
          folderName: self.loginUserName,
          path: filepath,
        });
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
    getSignedUrlForImage:function(bucket, key, expires,which) {
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
            console.log("getSignedUrl success: " + signedUrl);
            self.analysisImage[which].url = signedUrl;
          }
        }
      );
    },
    // getSignedUrlラッパー
    getSignedUrl: function(bucket, key, expires, which) {
      console.log(
        "getSignedUrl bucket: " +
          bucket +
          " key: " +
          key +
          " expires: " +
          expires +
          " which: " +
          which
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
            console.log("getSignedUrl success: " + signedUrl);
            self.movieData[which].url = signedUrl;
          }
        }
      );
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
      //選択しているファイル名を取得
      if (which==0){
        self.chosenMovieName.movie1 = self.s3Movie[index].path
      }else if (which==1){
        self.chosenMovieName.movie2 = self.s3Movie[index].path
      }
      self.getSignedUrl(self.awsS3.bucket, self.s3Movie[index].path, 60, which);
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
      //loading start
      let loader = this.$loading.show({
        // Optional parameters
        container: this.fullPage ? null : this.$refs.formContainer,
        canCancel: false
      });
      const store = window.$nuxt.$store;
      var comment = document.getElementById("userEvaluate")._value;
      api
        .post("/user/self-evaluate", {
          username: store.getters["user/username"],
          score: this.userScore,
          comment: comment,
          motion: this.motion
        })
        .then(() => {
          //loading end
          loader.hide();
          alert("記録ありがとう");
        })
        .catch(error => {
          //loading end
          loader.hide();
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
img.resize-for-mobile {
  width: 60px;
  height: 60px;
}
.score-charactor{
  text-align:center;
  font-weight: bold;
  font-size: larger;
  color: blue;

}
.cp_ipselect {
overflow: hidden;
width: 90%;
text-align: center;
}
.cp_ipselect select {
width: 100%;
padding-right: 1em;
cursor: pointer;
text-indent: 0.01px;
text-overflow: ellipsis;
border: none;
outline: none;
background: transparent;
background-image: none;
box-shadow: none;
-webkit-appearance: none;
appearance: none;
}
.cp_ipselect select::-ms-expand {
display: none;
}
.cp_ipselect.cp_sl04 {
position: relative;
border-radius: 2px;
border: 2px solid #C0C0C0;
border-radius: 50px;
background: #ffffff;
}
.cp_ipselect.cp_sl04::before {
position: absolute;
top: 0.8em;
right: 0.8em;
width: 0;
height: 0;
padding: 0;
content: '';
border-left: 6px solid transparent;
border-right: 6px solid transparent;
pointer-events: none;
}
.cp_ipselect.cp_sl04 select {
padding: 8px 38px 8px 8px;
color: #C0C0C0;
}
</style>
