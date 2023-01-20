<template>
  <v-container>
    <PageHeadComponent :page-head-title="pageHeadTitle" />
    <v-divider class="mx-4" inset vertical></v-divider>

    <v-spacer></v-spacer>
    <v-data-table :headers="headers" :items="contentsList" class="elevation-1">
      <!-- アイキャッチ画像 -->
      <template v-slot:[`item.image`]="{ item }">
        <v-img width="120px" height="120px" v-bind:src="item.image"></v-img>
      </template>
      <!-- サブタイトル -->
      <template v-slot:[`item.subtitle`]="{ item }">
        <div>
          {{ item.subtitle }}
        </div>
      </template>
      <!-- タイトル -->
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
      <!-- ステータス -->
      <template v-slot:[`item.status`]="{ item }">
        <div v-if="item.status">
          {{ "削除済" }}
        </div>
      </template>
      <template v-slot:[`item.order`]="{ item }">
        <div>
          <v-col cols="2" class="d-flex align-center">
            <v-icon :disabled="!changeOrderFlag" @click="switchListItem(item, 1, 'up')"
              >mdi-chevron-up</v-icon
            >
            <v-icon :disabled="!changeOrderFlag" @click="switchListItem(item, 1, 'down')"
              >mdi-chevron-down</v-icon
            >
          </v-col>
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
        <v-btn color="grey" @click="changeOrder" v-if="!changeOrderFlag">
          <v-icon left> mdi-arrow-up-down </v-icon>
          表示順を変更する
        </v-btn>
        <v-btn color="grey" @click="orderDecision" v-else>
          <v-icon left> mdi-content-save-check </v-icon>
          表示順を確定する
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
                <v-file-input
                  type="file"
                  v-model="editedItem.image"
                  accept="image/png, image/jpeg"
                  show-size
                  counter
                  outlined
                  dense
                  placeholder="ここをクリックしてください"
                ></v-file-input>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="editedItem.subtitle" label="サブタイトル"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="editedItem.title" label="タイトル"></v-text-field>
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
    pageHeadTitle: "おすすめコンテンツ",
    // 検索用メニュー
    searchUserMenu: false,
    valid: true,
    userChoice: 2,

    dialogEdit: false,

    contentsList: [],
    editedIndex: -1,
    editedItem: {
      url: "",
      subtitle: "",
      title: "",
      image: null,
      status: false,
    },
    defaultItem: {
      url: "",
      subtitle: "",
      title: "",
      image: null,
      status: false,
    },
    // 表示順変更フラグ
    changeOrderFlag: false,
  }),

  computed: {
    headers() {
      if (this.changeOrderFlag) {
        return [
          { text: "アイキャッチ画像", value: "image", width: "15%", align: "start" },
          { text: "サブタイトル", value: "subtitle", width: "20%", align: "start" },
          { text: "タイトル", value: "title", width: "20%", align: "start" },
          { text: "URL", value: "url", width: "25%", align: "start" },
          { text: "編集・削除", value: "updDel", sortable: false, width: "10%", align: "start" },
          {
            text: "表示順序",
            value: "order",
            sortable: false,
            width: "10%",
            align: "start",
          },
        ];
      } else {
        return [
          { text: "アイキャッチ画像", value: "image", width: "15%", align: "start" },
          { text: "サブタイトル", value: "subtitle", width: "20%", align: "start" },
          { text: "タイトル", value: "title", width: "20%", align: "start" },
          { text: "URL", value: "url", width: "25%", align: "start" },
          { text: "編集・削除", value: "updDel", sortable: false, width: "10%", align: "start" },
        ];
      }
    },
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
      this.contentsList = [
        // TODO:オブジェクト URLをimageに追加
        {
          image:
            "https://amplify-sdgsappmanagement-main-91300-deployment.s3.us-east-2.amazonaws.com/basketball.jpg",
          subtitle: "エコプロ2022セブン＆愛グループ特設サイト",
          title: "環境モンスターをクイズでやっつけよう",
          url: "https://www.7andi.com/company/news/release/202210271100.html",
          status: false,
        },
        {
          image:
            "https://amplify-sdgsappmanagement-main-91300-deployment.s3.us-east-2.amazonaws.com/volleyball.png",
          subtitle: "たいせつにつくる、たいせつに食べる",
          title: "賢者のレシピ",
          url: "https://www.7andi.com/company/news/release/202210271100.html",
          status: false,
        },
      ];
    },

    editItem(item) {
      this.editedIndex = this.contentsList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogEdit = true;
    },

    deleteItem(item) {
      this.editedIndex = this.contentsList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      const msg = "このデータを削除してよろしいですか？ \n ユーザー名 : " + item["title"];
      if (confirm(msg)) {
        this.contentsList.splice(this.editedIndex, 1);
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
        Object.assign(this.contentsList[this.editedIndex], this.editedItem);
      } else {
        // 新規登録が押下されたとき
        // TODO: 選択された画像ファイルをS3の指定箇所に格納する→amplifyにいい感じの機能がありそうだから実装前に調べてみること
        // s3に格納したファイルをオブジェクトURL形式で指定のDBへ格納→リストとして取り出し、画面に表示する
        this.contentsList.push(this.editedItem);
      }
      this.close();
    },
    editNewItem() {
      this.dialogEdit = true;
    },

    // 表示されてるデータの表示順を変更する
    changeOrder() {
      // ソートができる機能をテーブルに表示する→今のとこ、マウスで操作できる仕様にしようと思ってる

      this.changeOrderFlag = true;
    },
    // 表示順を確定する
    orderDecision() {
      // TODO: 入れ替えられた順序で配列をテーブルに保存する処理
      alert("表示されてる順序でコンテンツがcsv形式でS3に登録される");
      this.changeOrderFlag = false;
    },
    // 表示順序変更
    switchListItem: function (item, i, type) {
      let array = this.contentsList;
      let index = array.indexOf(item);
      array.splice(index, 1);
      if (type == "up") {
        array.splice(index - 1, 0, item);
      }
      if (type == "down") {
        array.splice(index + 1, 0, item);
      }
    },
  },
};
</script>
