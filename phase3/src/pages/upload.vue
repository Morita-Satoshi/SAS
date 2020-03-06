<template>
  <section class="container">
    <div>
      <h1>動画をアップロードしよう</h1>
      <div class="image">
        <label v-show="!uploadfile" class="input-item_label">
          画像を選択
          <input type="file" @change="changeFile" />
        </label>
        <div class="preview-item">
          <img v-show="uploadfile" class="preview-item-file" :src="uploadfile" alt />
          <div v-show="uploadfile" class="preview-item-btn" @click="remove">
            <p class="preview-item-name">{{ img_name }}</p>
            <button class="v-btn v-btn--contained v-size--large theme--light">キャンセル</button>
          </div>
        </div>
      </div>
      <style>
  .image {
    margin-bottom: 20px;
  }
      </style>
      <button
        type="button"
        class="v-btn v-btn--contained v-size--large theme--light"
        @click="uploadData"
      >アップロード</button>
    </div>
  </section>
</template>

<script>
import Vue from "vue";
// Import component
import Loading from "vue-loading-overlay";
// Import stylesheet
import "vue-loading-overlay/dist/vue-loading.css";
// Init plugin
Vue.use(Loading);

export default {
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start();

      setTimeout(() => this.$nuxt.$loading.finish(), 500);
    });
  },
  data() {
    return {
      uploadfile: false,
      img_name: "",
      fullPage: true
    };
  },
  components: {},
  methods: {
    uploadData(e) {
      //loading start
      let loader = this.$loading.show({
        // Optional parameters
        container: this.fullPage ? null : this.$refs.formContainer,
        canCancel: false
      });
      const store = window.$nuxt.$store;
      var AWS = require("aws-sdk");
      var s3_client = function() {
        AWS.config.region = "ap-northeast-1"; // リージョン
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: store.getters["user/identityID"]
        });
        AWS.config.credentials.get(function(err) {
          if (!err) {
            console.log(
              "Cognito Identify Id: " + AWS.config.credentials.identityId
            );
          }
        });
        return new AWS.S3({
          params: {
            Bucket: "sas-noboru-upload/uploads"
          }
        });
      };
      //ファイル名作成用
      var username = store.getters["user/username"];
      var date = new Date();
      var unixTime = Math.floor(date.getTime() / 1000);
      s3_client().putObject(
        {
          Key: username + "/" + unixTime + ".MOV",
          ContentType: "video/quicktime",
          Body: this.uploadfile,
          ACL: "private"
        },
        function(err, data) {
          //loading end
          loader.hide();
          if (data !== null) {
            alert("アップロード成功!");
            //clear
            this.uploadfile = false;
            this.img_name = "";
          } else {
            alert("アップロード失敗.");
          }
        }
      );
    },
    changeFile(e) {
      const files = e.target.files || e.dataTransfer.files;
      // ファイルが選択されたら変数に入れる
      this.uploadfile = files[0];
      this.img_name = files[0].name;
    },
    // アップロードした画像を表示
    createImage(file) {
      const reader = new FileReader();
      reader.onload = e => {
        this.uploadfile = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    remove() {
      this.uploadfile = false;
      this.img_name = "";
    }
  }
};
</script>
