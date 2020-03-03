<template>
  <v-app>
    <v-container>
      <v-layout align-center justify-center fill-height>
        <v-flex xs12 sm6 lg4>
          <v-card @keydown.enter="login()">
            <v-toolbar flat>
              <v-toolbar-title>子どものぼーるをはじめよう！！</v-toolbar-title>
            </v-toolbar>
            <v-container fluid>
              <v-form>
                <v-layout row wrap>
                  <v-text-field
                    type="text"
                    v-model="username"
                    label="ID"
                    required
                    autocomplete="off"
                    prepend-icon="mid-account"
                    maxlength="64"
                  ></v-text-field>
                </v-layout>
                <v-layout row wrap>
                  <v-text-field
                    type="password"
                    v-model="password"
                    label="パスワード"
                    required
                    autocomplete="off"
                    prepend-icon="midi-key-variant"
                    maxlength="128"
                  ></v-text-field>
                </v-layout>
                <v-layout row wrap>
                  <v-switch color="primary" v-model="remember" label="ログイン情報を記憶する"></v-switch>
                </v-layout>

                <v-layout row wrap>
                  <v-flex xs12>
                    <v-alert v-if="error" :value="true" type="error">
                      {{
                      error
                      }}
                    </v-alert>
                  </v-flex>
                </v-layout>

                <v-layout row wrap justify-end>
                  <v-btn
                    color="primary"
                    @keydown="login"
                    :disabled="!valid || loggingin"
                    @click="login"
                    :loading="loggingin"
                  >ログイン</v-btn>
                </v-layout>
                <v-layout row wrap justify-center>
                  <!-- TODO ロゴの挿入 -->
                </v-layout>
              </v-form>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<style scoped></style>

<script>
import config from "../assets/config.json";

export default {
  layout: "blank",
  head() {
    return {
      title: "ログイン"
    };
  },
  data() {
    return {
      ready: false,
      username: "",
      password: "",
      remember: false,
      error: null,
      loggingin: false
    };
  },
  computed: {
    valid() {
      return this.username != "" && this.password != "";
    }
  },
  methods: {
    getCookieVal: function(key) {
      const record = document.cookie.split("; ");
      for (let index in record) {
        let param = record[index].split("=");
        if (param[0] === key) {
          return param[1];
        }
      }
    },

    loadCookie: function() {
      if (document.cookie) {
        this.username = this.getCookieVal("username");
        this.password = this.getCookieVal("password");
        this.remember = this.getCookieVal("remember");
      }
    },

    setCookie: function() {
      if (this.remember) {
        const saveSecond = 60 * 60 * 24 * config.cookieRememberDay;
        document.cookie = `username=${this.username}; max-age=${saveSecond};`;
        document.cookie = `password=${this.password}; max-age=${saveSecond};`;
        document.cookie = `remember=${this.remember}; max-age=${saveSecond};`;
      } else {
        document.cookie = "username=";
        document.cookie = "password=";
        document.cookie = "remember=";
      }
    },

    login() {
      if (!this.username || !this.password) {
        return;
      }

      this.setCookie();

      this.error = null;
      this.loggingin = true;
      this.$store
        .dispatch("user/login", {
          username: this.username,
          password: this.password
        })
        .then(() => {
          // async authentication
          // logged in
          // if a user logged in successfully then redirect to root page (pages/index.vue).
          console.log("login success");
          this.$router.push("/");
        })
        .catch(error => {
          // login error
          if (error.response) {
            if (error.response.status == 401)
              this.error = "401エラー:IDまたはパスワードが誤っています";
            else if (error.response.status == 500)
              this.error = "500エラー:サーバーエラー";
            else if (error.response.status == 501)
              this.error = "501エラー:サーバーエラー";
          } else this.error = error;
          this.loggingin = false;
        });
    }
  },
  created() {
    if (this.$store.getters["user/authenticated"] == true) {
      this.$router.push("/");
    } else {
      this.loadCookie();
      if (this.$route.query.error) {
        if (this.$route.query.error == "401") {
          this.error =
            "ログイン認証が切れました。もう一度ログインしてください。";
        }
      }
      this.ready = true;
    }
  }
};
</script>
