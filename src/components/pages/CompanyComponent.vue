<template>
  <v-container fluid pa-0 ma-0>
    <div style="max-width: 500px">
      <!-- 共通ヘッダー -->
      <PageHeadComponent :page-head-title="pageHeadTitle" />
      <v-card class="pa-4">
        <v-form ref="test_form" v-model="valid" lazy-validation>
          <h5 class="font-weight-bold mt-2 mb-4">会社情報</h5>
          <v-row class="pa-0 ma-0">
            <v-col cols="12" class="pa-0">会社名</v-col>
            <v-col cols="12" class="pa-1">
              <v-text-field
                v-model="name"
                background-color="grey lighten-4"
                dense
                filled
                placeholder="例）株式会社〇〇"
                autocomplete="off"
                counter="50"
                :rules="[required, maxlength50]"
                hint="50文字まで設定できます"
                maxlength="50"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="pa-0 ma-0">
            <v-col cols="12" class="pa-0">業種</v-col>
            <v-col cols="12" class="pa-1">
              <v-select
                v-model="business_type"
                :items="business_type_list"
                background-color="grey lighten-4"
                item-text="text"
                item-value="value"
                dense
                filled
                :rules="[required]"
              ></v-select>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <h5 class="font-weight-bold mt-2 mb-4">連絡先情報</h5>
          <v-row class="pa-0 ma-0">
            <v-col cols="12" class="pa-0">電話番号</v-col>
            <v-col cols="12" class="pa-1">
              <v-text-field
                v-model="phone_number"
                background-color="grey lighten-4"
                dense
                filled
                placeholder="例）09012345678"
                autocomplete="off"
                counter="11"
                :rules="[required, maxlength11, integer]"
                hint="ハイフンなしの半角数字で入力してください"
                style="max-width: 220px"
                maxlength="11"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="pa-0 ma-0">
            <v-col cols="12" class="pa-0">FAX番号</v-col>
            <v-col cols="12" class="pa-1">
              <v-text-field
                background-color="grey lighten-4"
                v-model="fax_number"
                filled
                dense
                placeholder="例）00012345678"
                autocomplete="off"
                counter="11"
                :rules="[required, maxlength11, integer]"
                hint="ハイフンなしの半角数字で入力してください"
                style="max-width: 220px"
                maxlength="11"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <h5 class="font-weight-bold mt-2 mb-4">会社所在地</h5>
          <v-row class="pa-0 ma-0">
            <v-col cols="12" class="pa-0">都道府県</v-col>
            <v-col cols="12" class="pa-1">
              <v-select
                v-model="address_pref"
                :items="address_pref_list"
                background-color="grey lighten-4"
                item-text="value"
                item-value="value"
                dense
                filled
                :rules="[required]"
                style="max-width: 180px"
              ></v-select>
            </v-col>
          </v-row>

          <v-row class="pa-0 ma-0">
            <v-col cols="12" class="pa-0">市区町村</v-col>
            <v-col cols="12" class="pa-1">
              <v-text-field
                background-color="grey lighten-4"
                v-model="address_city"
                filled
                dense
                placeholder="例）〇〇市△△区"
                autocomplete="off"
                counter="12"
                :rules="[required, maxlength12]"
                hint="12文字まで入力できます"
                maxlength="12"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="pa-0 ma-0">
            <v-col cols="12" class="pa-0">地名・番地</v-col>
            <v-col cols="12" class="pa-1">
              <v-text-field
                background-color="grey lighten-4"
                v-model="address_other1"
                filled
                dense
                placeholder="例）□□□1-1-1"
                autocomplete="off"
                counter="250"
                :rules="[maxlength250]"
                hint="250文字まで入力できます"
                maxlength="250"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="pa-0 ma-0">
            <v-col cols="12" class="pa-0">建物名</v-col>
            <v-col cols="12" class="pa-1">
              <v-text-field
                background-color="grey lighten-4"
                v-model="address_other2"
                filled
                dense
                placeholder="例）〇〇マンション101"
                autocomplete="off"
                counter="250"
                :rules="[maxlength250]"
                hint="250文字まで入力できます"
                maxlength="250"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="pa-0 ma-0">
            <v-col cols="12" class="pa-0">ホームページURL</v-col>
            <v-col cols="12" class="pa-1">
              <v-text-field
                background-color="grey lighten-4"
                v-model="url"
                filled
                dense
                placeholder="例）https://xxxxxx.com"
                autocomplete="off"
                counter="250"
                :rules="[maxlength250, url_rule]"
                hint="250文字まで入力できます"
                maxlength="250"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="pa-4">
            <v-btn width="100px" color="primary" @click="save()"> 保存 </v-btn>
          </v-row>
        </v-form>
      </v-card>
    </div>
    <!-- 情報通知用スナックバー（URLコピー時） -->
    <v-snackbar v-model="snackbar" timeout="2000">
      <div style="text-align: center">{{ snackbarText }}</div>
    </v-snackbar>
    <v-overlay :value="isOverlay" :absolute="true" :opacity="0.25">
      <v-progress-circular :size="70" :width="7" indeterminate></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import PageHeadComponent from "../parts/PageHeadComponent.vue";
export default {
  components: {
    PageHeadComponent,
  },
  data() {
    return {
      pageHeadTitle: "会社情報",
      infoList: [],
      name: "",
      phone_number: "",
      fax_number: "",
      address_pref: "",
      address_city: "",
      address_other1: "",
      address_other2: "",
      snackbar: false,
      snackbarText: "",
      business_type: "",
      url: "",
      id: "",
      valid: true,
      isOverlay: false,

      required: (value) => !!value || "必ず入力してください", // 入力必須の制約
      maxlength50: (value) => !value || value.length <= 50 || "50文字以内で入力してください", // 文字数の制約
      maxlength11: (value) => !value || value.length <= 11 || "11文字以内で入力してください", // 文字数の制約
      integer: (value) => !value || value.match(/^[0-9]+$/) != null || "半角数字で入力してください", // 半角数字制約
      maxlength12: (value) => !value || value.length <= 12 || "12文字以内で入力してください", // 文字数の制約
      maxlength250: (value) => !value || value.length <= 250 || "250文字以内で入力してください", // 文字数の制約
      url_rule: (value) =>
        !value || value.match(/^http(|s):\/\/.+/) != null || "URL形式で入力してください", // URL形式の制約

      address_pref_list: [
        { value: "北海道", sortable: false },
        { value: "青森県", sortable: false },
        { value: "岩手県", sortable: false },
        { value: "宮城県", sortable: false },
        { value: "秋田県", sortable: false },
        { value: "山形県", sortable: false },
        { value: "福島県", sortable: false },
        { value: "茨城県", sortable: false },
        { value: "栃木県", sortable: false },
        { value: "群馬県", sortable: false },
        { value: "埼玉県", sortable: false },
        { value: "千葉県", sortable: false },
        { value: "東京都", sortable: false },
        { value: "神奈川県", sortable: false },
        { value: "新潟県", sortable: false },
        { value: "富山県", sortable: false },
        { value: "石川県", sortable: false },
        { value: "福井県", sortable: false },
        { value: "山梨県", sortable: false },
        { value: "長野県", sortable: false },
        { value: "岐阜県", sortable: false },
        { value: "静岡県", sortable: false },
        { value: "愛知県", sortable: false },
        { value: "三重県", sortable: false },
        { value: "滋賀県", sortable: false },
        { value: "京都府", sortable: false },
        { value: "大阪府", sortable: false },
        { value: "兵庫県", sortable: false },
        { value: "奈良県", sortable: false },
        { value: "和歌山県", sortable: false },
        { value: "鳥取県", sortable: false },
        { value: "島根県", sortable: false },
        { value: "岡山県", sortable: false },
        { value: "広島県", sortable: false },
        { value: "山口県", sortable: false },
        { value: "徳島県", sortable: false },
        { value: "香川県", sortable: false },
        { value: "愛媛県", sortable: false },
        { value: "高知県", sortable: false },
        { value: "福岡県", sortable: false },
        { value: "佐賀県", sortable: false },
        { value: "長崎県", sortable: false },
        { value: "熊本県", sortable: false },
        { value: "大分県", sortable: false },
        { value: "宮崎県", sortable: false },
        { value: "鹿児島県", sortable: false },
        { value: "沖縄県", sortable: false },
      ],

      business_type_list: [
        { text: "美容室", value: 1, sortable: false },
        { text: "ネイルサロン", value: 2, sortable: false },
        { text: "エステ・リラクゼーション", value: 3, sortable: false },
        { text: "マッサージ", value: 4, sortable: false },
        { text: "英会話・語学教室", value: 5, sortable: false },
        { text: "料理教室", value: 6, sortable: false },
        { text: "ヨガ教室・ピラティス教室", value: 7, sortable: false },
        { text: "フィットネス・パーソナルトレーニング", value: 8, sortable: false },
        { text: "スクール・レッスン教室", value: 9, sortable: false },
        { text: "学習塾・予備校", value: 10, sortable: false },
        { text: "学校・教育機関・研究機関", value: 11, sortable: false },
        { text: "保育施設・託児・介護", value: 12, sortable: false },
        { text: "病院・クリニック", value: 13, sortable: false },
        { text: "歯科医院", value: 14, sortable: false },
        { text: "ホテル・旅館業", value: 15, sortable: false },
        { text: "民泊", value: 16, sortable: false },
        { text: "旅行業", value: 17, sortable: false },
        { text: "貸し会議室・レンタルスペース運営", value: 18, sortable: false },
        { text: "公共施設運営", value: 19, sortable: false },
        { text: "娯楽施設運営", value: 20, sortable: false },
        { text: "その他施設運営", value: 21, sortable: false },
        { text: "官公庁・地方自治体", value: 22, sortable: false },
        { text: "士業", value: 23, sortable: false },
        { text: "金融・保険・コンサルティング", value: 24, sortable: false },
        { text: "人材紹介・人材派遣", value: 25, sortable: false },
        { text: "通信業・放送業", value: 26, sortable: false },
        { text: "イベント運営", value: 27, sortable: false },
        { text: "レンタル業", value: 28, sortable: false },
        { text: "ペット関連", value: 29, sortable: false },
        { text: "飲食業", value: 30, sortable: false },
        { text: "不動産業", value: 31, sortable: false },
        { text: "倉庫業・運輸業", value: 32, sortable: false },
        { text: "製造業", value: 33, sortable: false },
        { text: "建設業", value: 34, sortable: false },
        { text: "卸売業・小売業", value: 35, sortable: false },
        { text: "占い・カウンセリング", value: 36, sortable: false },
        { text: "農業・林業・漁業", value: 37, sortable: false },
        { text: "電気・ガス・熱供給・水道業", value: 38, sortable: false },
        { text: "ウェブ制作・システム受託・広告代理店", value: 39, sortable: false },
        { text: "その他", value: 40, sortable: false },
      ],
    };
  },

  methods: {
    // 選択されているサービスID(globalParams)に紐づくサイト情報を取得。
  },
};
</script>
