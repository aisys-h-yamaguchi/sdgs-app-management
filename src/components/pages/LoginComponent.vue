<template>
  <v-container fluid pa-0>
    <div class="mt-3">
      <v-card class="login-v-card">
        <v-card-title><h2>ログイン</h2></v-card-title>
        <v-card-text class="px-4">
          <v-form class="login-form" ref="login_form" v-model="valid" lazy-validation>
            <v-row class="pa-3" style="max-width: 40em; margin: auto">
              <v-col cols="12" class="pa-0">メールアドレス</v-col>
              <v-col cols="12" class="pa-1">
                <v-text-field
                  v-model="email"
                  type="text"
                  name="email"
                  dense
                  required
                  outlined
                  :rules="[rules.emailRules]"
                  @keyup.enter="login()"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="pa-3" style="max-width: 40em; margin: auto">
              <v-col cols="12" class="pa-0">パスワード</v-col>
              <v-col cols="12" class="pa-1">
                <v-text-field
                  v-model="password"
                  name="password"
                  :type="confirm_pass_show ? 'text' : 'password'"
                  dense
                  required
                  outlined
                  :rules="[rules.passwordRules]"
                  @keyup.enter="login()"
                  :append-icon="confirm_pass_show ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="confirm_pass_show = !confirm_pass_show"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="text-center"
                ><v-btn color="primary" @click="login()">ログイン</v-btn></v-col
              >
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      email: "",
      password: "",
      valid: true,
      serviceId: "",
      confirm_pass_show: false,
      rules: {
        emailRules: (value) => !!value || "メールアドレスは必須です。", // 入力必須の制約
        passwordRules: (value) => !!value || "パスワードは必須です。", // 入力必須の制約
      },
      // サンプル後で消す
      items: null,
    };
  },
  created() {},
  methods: {
    login: async function () {
      // TODO:バリデーション聞いてない、validateがunknownで機能してなさそう、ライブラリ必要？
      if (this.$refs.login_form.validate()) {
        await axios({
          method: "GET", // GET,POSTなど
          url: "https://7qlm6p7sn7.execute-api.us-east-2.amazonaws.com/dev/", // APIのURL
          headers: {
            "X-Api-Key": "5ZdpyK9PrPamkguAGTeVV6wNYJhkgK5p2xvXaE5W", //リクエストヘッダー
          },
        }).then((response) => (this.items = response.data));
        console.log(this.items);
        // 管理者トップ画面へ遷移
        this.$router.push("/top");
      } else {
        alert("メールアドレスとパスワードは必須です。必ず入力してください。");
      }
    },
  },
};
</script>
<style>
.login-v-card {
  max-width: 900px !important;
  margin: 0 auto !important;
}
.login-form .v-text-field__details {
  display: none !important;
}
</style>
