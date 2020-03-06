<template>
  <v-layout>
    <v-flex class="text-center">
      <!-- 1つ目のMovieの表示領域 [S] -->
      <div>
        <video id="video1" class="video_size" :src="movieData[0].url" preload="none" muted playsinline controls></video>
        <div>
          <select v-model="selected.movie1" @change="getMovie($event, 0)">
            <option disabled value="">{{message.selectMovie1}}</option>
            <option v-for="(item, index) in uiDisplay" :key="index" :value="item.movieName">{{item.movieName}}</option>
          </select>
        </div>
      </div>
      <!-- 1つ目のMovieの表示領域 [E] -->
      <!-- 2つ目のMovieの表示領域 [S] -->
      <div>
<<<<<<< HEAD
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
=======
        <video id="video2" class="video_size" :src="movieData[1].url" preload="none" muted playsinline controls></video>
        <div>
          <select v-model="selected.movie2" @change="getMovie($event, 1)">
            <option disabled value="">{{message.selectMovie2}}</option>
            <option v-for="(item, index) in uiDisplay" :key="index" :value="item.movieName">{{item.movieName}}</option>
          </select>
        </div>
      </div>
      <!-- 2つ目のMovieの表示領域 [E] -->
      <!-- 再生/停止ボタン表示領域 [S] -->
      <div v-show="(movieData[0].url != null && movieData[1].url != null) == true">
        <button type="button" class="v-btn vv-btn--contained v-size--large theme-light" @click="playMovie">動画再生</button>
        <button type="button" class="v-btn vv-btn--contained v-size--large theme-light" @click="pauseMovie">動画停止</button>
      </div>
      <!-- 再生/停止ボタン表示領域 [E] -->
>>>>>>> compare
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
<<<<<<< HEAD
      moviePath: "",
=======
      // S3動画情報
      s3Movie: [
        { 
          // フォルダ名 folderName
          // 動画パス path
        },
      ],
      // UI表示情報
      uiDisplay: [
        {
          // ユーザー名 userName
          // 動画名 movieName
        },
      ],
      // 選択動画のキー
      selected: {
        movie1: '',
        movie2: '',
      },
      // AWS S3情報
      awsS3: {
        bucket: 'sas-noboru-upload',
        region: 'ap-northeast-1',
      },
      // 見本の情報
      models: [
        { userName: 'Eguchi' , folderName: 'eguchi'  },
        { userName: 'Morita' , folderName: 'morita'  },
        { userName: 'Yaguchi', folderName: 'yaguchi' },
      ],
      // ログインユーザー名
      loginUserName: null,
      // 動画ファイル拡張子(小文字で定義)
      movieExtension: '.mov',
      // メッセージリスト
>>>>>>> compare
      message: {
        selectMovie1: "1つ目の動画を選んでください",
        selectMovie2: "2つ目の動画を選んでください",
        getMovie: "動画取得",
        playMovie: "動画再生"
      },
<<<<<<< HEAD
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
=======
      movieData: [
        { url: null },
        { url: null },
      ],
    }
>>>>>>> compare
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
<<<<<<< HEAD
    // LoginUser情報取得
    getLoginUser: function() {
      console.log("getLoginUser");
=======
    // 初期化処理
    initialize: function() {
      console.log('initialize');
      var self = this;
      self.s3Movie = [];
      self.uiDisplay = [];
      self.convertUIToS3 = [];
    },
    // LoginUser名情報取得
    getLoginUserName: function() {
      console.log('getLoginUser');
      var self = this;
      const store = window.$nuxt.$store;
      self.loginUserName = store.getters['user/username'];
>>>>>>> compare
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
<<<<<<< HEAD
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
=======
          Bucket: self.awsS3.bucket,
          Region: self.awsS3.region,
        }
      });
    },
    // S3動画リスト生成
    createS3MovieList: function() {
      console.log('createS3MovieList');
      var self = this;
      var s3 = self.getS3Instance();
      // S3内オブジェクトリスト取得
      s3.listObjects(function(error, data) {
        if (error) {
          console.log('listObjects error: ', error);
        }
        else {
          console.log('listObjects success: ' + JSON.stringify(data));
          var objectList = data.Contents;
          objectList.forEach(item => {
            var filepath = item.Key;
            console.log('filepath: ' + filepath);
            if (filepath.toLowerCase().indexOf(self.movieExtension) !== -1) {
              // ファイルパスに動画ファイルの拡張子が含まれている
              self.pushS3MovieList(filepath);
>>>>>>> compare
            }
          });
        }
      });
    },
<<<<<<< HEAD
    // 動画リスト
    pushMovieList: function(key) {
      console.log("pushMovieList key: " + key);
=======
    pushS3MovieList: function(filepath) {
      console.log('pushS3MovieList: ' + filepath);
>>>>>>> compare
      var self = this;
      // 見本の動画リストをチェック
      self.models.forEach(item => {
        if (filepath.indexOf(item.folderName) !== -1) {
          console.log('filepath: ' + filepath);
          var movieName = self.getMovieName(item.userName, filepath);
          console.log('movieName: ' + movieName);
          // 動画パスを格納
          self.s3Movie.push( { folderName: item.folderName, path: filepath } );
          self.uiDisplay.push( { userName: item.userName, movieName: movieName } );
          var index = self.getIndexFromObjectArray(self.s3Movie, 'path', filepath);
        }
      });
<<<<<<< HEAD
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
=======
      console.log('loginUserName: ' + self.loginUserName);
      // ログインユーザーのチェック
      if (filepath.indexOf(self.loginUserName) !== -1) {
        console.log('filepath: ' + filepath);
        var movieName = self.getMovieName(self.loginUserName, filepath);
        console.log('movieName: ' + movieName);
        self.s3Movie.push( { folderName: self.loginUserName, path: filepath } );
        self.uiDisplay.push( { userName: self.loginUserName, movieName: movieName }
        );
        var index = self.getIndexFromObjectArray(self.s3Movie, 'path', filepath);
      }
      console.log('s3Movie: ' + JSON.stringify(self.s3Movie));
      console.log('uiDisplay: ' + JSON.stringify(self.uiDisplay));
    },
    getIndexFromObjectArray: function(objArray, targetKey, targetValue) {
      console.log('getIndexFromObjectArray');
      var self = this;
      var index = -1;
      for (var i = 0; i < objArray.length; i++) {
        if (objArray[i][targetKey] == targetValue) {
          index = i;
          break;
        }
      }
      console.log('return index: ' + index);
      return index;
    },
    // 動画名取得
    getMovieName: function(userName, filepath) {
      console.log('getMovieName filepath: ' + filepath);
      var self = this;
      var unixTime = self.getUnixTime(filepath);
      console.log('unixTime: ' + unixTime);
      var time = self.convertUnixTimeToTime(unixTime);
      console.log('time: ' + time);
      return userName + '_' + time;
    },
    // Unix時間の取得
    getUnixTime: function(filepath) {
      console.log('getTime filepath: ' + filepath);
      return filepath.match(/\d+/);
    },
    // Unix時間 <-> 時刻変換
    convertUnixTimeToTime: function(targetUnixTime) {
      console.log('convertUnixTimeToTime targetUnixTime: ' + targetUnixTime);
      var unixTime = new Date(parseInt(targetUnixTime, 10) * 1000);
      var year = ("0" + unixTime.getFullYear()).slice(-4);
      var month = ("0" + (unixTime.getMonth() + 1)).slice(-2);
      var day = ("0" + unixTime.getDate()).slice(-2);
      var hour = unixTime.getHours();
      var minute = ("0" + unixTime.getMinutes()).slice(-2);
      var second = ("0" + unixTime.getSeconds()).slice(-2);
      //var time = year + '年' + month + '月' + day + '日' + hour + '時' + minute + '分' + second + '秒';
      var time = year + '/' + month + '/' + day + '_' + hour + ':' + minute + ':' + second;
      return time;
    },
    // 動画取得
    getMovie: function(event, which) {
      //console.log('getMovie item: ' + JSON.stringify(item));
      console.log('getMovie event: ' + JSON.stringify(event) + ' which: ' + which);
      var self = this;
      var selected = (which == 0) ? self.selected.movie1 : self.selected.movie2;
      console.log('getMovie selected: ' + selected);
      var index = self.getIndexFromObjectArray(self.uiDisplay, 'movieName', selected);
      var s3 = self.getS3Instance();

      const signedUrl = s3.getSignedUrl('getObject', {
        Bucket: self.awsS3.bucket,
        Key: self.s3Movie[index].path,
        Expires: 60,
      }, (err, signedUrl) => {
        if (err) {
          console.log('getSignedUrl err: ' + err);
        }
        else {
          console.log('getSignedUrl success: ' + signedUrl);
          self.movieData[which].url = signedUrl;
          console.log('self.movieData[' + which + '].url: ' + self.movieData[which].url);
>>>>>>> compare
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
