<template>
  <div id="app" class="family">
    ファイルを選択
    <input @change="changeFile" ref="rfafile" type="file" />
    <input @click="uploadData" type="button" value="Upload" />
  </div>
  <!-- <section class="container">
    <div>
      <h1>動画をアップロードしよう</h1>
      <div class="image">
        <label v-show="!uploaded_image" class="input-item__label"
          >画像を選択
          <input type="file" @change="onFileChange" />
        </label>

        <div class="preview-item">
          <img
            v-show="uploaded_image"
            class="preview-item-file"
            :src="uploaded_image"
            alt=""
          />
          <div v-show="uploaded_image" class="preview-item-btn" @click="remove">
            <p class="preview-item-name">{{ img_name }}</p>
            <e-icon class="preview-item-icon">close</e-icon>
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
      >
        アップロード
      </button>
    </div>
  </section> -->
</template>

<script>
export default {
  data() {
    return {
      uploadfile: {}
    };
  },
  methods: {
    uploadData(e) {
      var AWS = require("aws-sdk");
      var s3_client = function() {
        const store = window.$nuxt.$store;
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
      // this.$store.commit("upload/upload");
      // パラメータ生成
      // API実行
      s3_client().putObject(
        {
          Key: "test.mov",
          ContentType: "video/quicktime",
          Body: this.uploadfile,
          ACL: "private"
        },
        function(err, data) {
          // if failed, alert
          if (data !== null) {
            alert("アップロード成功!");
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
      alert(this.uploadfile);
    }

    // onFileChange(e) {
    //   const files = e.target.files || e.dataTransfer.files;
    //   this.createImage(files[0]);
    //   this.img_name = files[0].name;
    // },
    // // アップロードした画像を表示
    // createImage(file) {
    //   const reader = new FileReader();
    //   reader.onload = e => {
    //     this.uploadedImage = e.target.result;
    //   };
    //   reader.readAsDataURL(file);
    // },
    // remove() {
    //   this.uploadedImage = false;
    // }
  }
};
</script>
