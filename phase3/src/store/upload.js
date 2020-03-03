var AWS = require("aws-sdk");
var s3_client = function () {
  // Amazon Cognito 認証情報プロバイダーを初期化します
  AWS.config.region = "ap-northeast-1"; // リージョン
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: store.getters["user/accessToken"]
  });
  AWS.config.credentials.get(function (err) {
    if (!err) {
      console.log("Cognito Identify Id: " + AWS.config.credentials.identityId);
    }
  });
  return new AWS.S3({
    params: {
      Bucket: "sas-noboru-upload/uploads"
    }
  });
};

export const mutations = {
  upload() {
    // API実行
    s3_client().putObject({
        Key: "test.mov",
        ContentType: "video/quicktime",
        Body: this.uploadfile,
        ACL: "private"
      },
      function (err, data) {
        // if failed, alert
        if (data !== null) {
          alert("アップロード成功!");
        } else {
          alert("アップロード失敗.");
        }
      }
    );
  }
};
