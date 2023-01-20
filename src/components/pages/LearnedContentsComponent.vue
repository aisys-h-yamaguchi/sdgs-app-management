<template>
  <v-container>
    <PageHeadComponent :page-head-title="pageHeadTitle" />
    <v-divider class="mx-4" inset vertical></v-divider>

    <v-spacer></v-spacer>
    <v-data-table :headers="headers" :items="newsList" sort-by="title" class="elevation-1">
      <!-- ニュースタイトル -->
      <template v-slot:[`item.title`]="{ item }">
        <div>
          {{ item.title }}
        </div>
      </template>
      <!-- URL -->
      <template v-slot:[`item.url`]="{ item }">
        <div>
          {{ item.url }}
        </div>
      </template>
      <!-- 投稿日時 -->
      <template v-slot:[`item.postedDateTime`]="{ item }">
        <div>
          {{ item.postedDateTime }}
        </div>
      </template>
      <!-- ステータス -->
      <template v-slot:[`item.status`]="{ item }">
        <div v-if="item.status">
          {{ "削除済" }}
        </div>
      </template>

      <!-- 編集・削除アイコン -->
      <template v-slot:[`item.updDel`]="{ item }">
        <v-icon medium class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon medium @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>

      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>

    <v-row class="pa-4">
      <v-col cols="10">
        <v-btn color="primary" @click="editNewItem">
          <v-icon left> mdi-plus </v-icon>
          新規登録
        </v-btn>
      </v-col>
      <v-col cols="2">
        <v-btn color="primary" @click="csvUpload">
          <v-icon left> mdi-upload </v-icon>
          CSVとして書き込む
        </v-btn>
      </v-col>
    </v-row>

    <v-spacer></v-spacer>

    <v-dialog v-model="dialogEdit" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field v-model="editedItem.title" label="ニュースタイトル"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="editedItem.url" label="URL"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import PageHeadComponent from "../parts/PageHeadComponent.vue";
export default {
  components: {
    PageHeadComponent,
  },
  data: () => ({
    // 検索用メニュー
    searchUserMenu: false,
    valid: true,
    userChoice: 2,

    pageHeadTitle: "学習コンテンツ（サステナビリティニュース）",
    dialogEdit: false,

    headers: [
      { text: "ニュースタイトル", value: "title", width: "40%", align: "start" },
      { text: "URL", value: "url", width: "30%", align: "start" },
      { text: "投稿日時", value: "postedDateTime", width: "20%", align: "start" },
      { text: "編集・削除", value: "updDel", sortable: false, width: "10%", align: "start" },
    ],
    newsList: [],
    editedIndex: -1,

    editedItem: {
      url: "",
      title: "",
      isPdf: false,
      postedDateTime: "",
      status: false,
    },
    defaultItem: {
      url: "",
      title: "",
      isPdf: false,
      postedDateTime: "",
      status: false,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "新規" : "編集";
    },
  },

  watch: {
    dialogEdit(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.newsList = [
        {
          title:
            "【セブン‐イレブン・ジャパン】世界初！非接触・空中ディスプレイ技術をPOSレジに採用 『デジPOS』の実証実験をセブン-イレブン店舗にて開始",
          url: "https://www.sej.co.jp/company/news_release/news/2022/165442.html",
          isPdf: false,
          postedDateTime: "2022/11/18",
          status: false,
        },
        {
          title:
            "【セブン‐イレブン・ジャパン】鹿児島県産の食材を使用した3品を発売 『鹿児島県限定寄附金付きnanaco』を発行",
          url: "https://www.sej.co.jp/company/news_release/news/2022/202201201000.html",
          isPdf: false,
          postedDateTime: "2022/11/30",
          status: false,
        },
        {
          title:
            "【イトーヨーカドー】フードチェーン3領域における食品ロス削減の実証実験について～ダイナミックプライシングや購買・消費データ活用等による企業・消費者への効果を検証～",
          url: "https://www.7andi.com/library/sustainability/news/pdf/2022/20220111_01.pdf",
          isPdf: true,
          postedDateTime: "2022/12/30",
          status: false,
        },
      ];
    },

    editItem(item) {
      this.editedIndex = this.newsList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogEdit = true;
    },

    deleteItem(item) {
      this.editedIndex = this.newsList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      const msg = "このデータを削除してよろしいですか？ \n ユーザー名 : " + item["title"];
      if (confirm(msg)) {
        this.newsList.splice(this.editedIndex, 1);
      }
      this.closeDelete();
    },

    close() {
      this.dialogEdit = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        // 編集押下されたとき
        Object.assign(this.newsList[this.editedIndex], this.editedItem);
      } else {
        // 新規登録が押下されたとき
        console.log(this.editedItem);
        const date = new Date();
        this.editedItem.postedDateTime = this.formatDateYmd(date);
        console.log(this.editedItem.postedDateTime);
        this.newsList.push(this.editedItem);
      }
      this.close();
    },
    editNewItem() {
      this.dialogEdit = true;
    },

    // TODO: 整形関数が増えるようであればファイルを別だしで作成
    // DateオブジェクトをYYYY/MM/DD形式に変換
    formatDateYmd(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dateStr =
        year + "/" + String(month).padStart(2, "0") + "/" + String(day).padStart(2, "0");
      return dateStr;
    },

    // TODO: 表示されてるデータをCSV形式でS3の指定箇所に保存する
    csvUpload() {
      alert("csv形式でs3に保存");
    },
  },
};
</script>
