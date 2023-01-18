<template>
  <v-container>
    <PageHeadComponent :page-head-title="pageHeadTitle" />
    <v-divider class="mx-4" inset vertical></v-divider>

    <v-spacer></v-spacer>
    <v-data-table :headers="headers" :items="contentsList" sort-by="title" class="elevation-1">
      <!-- アイキャッチ画像 -->
      <template v-slot:[`item.image`]="{ item }">
        <v-img max-height="150" max-width="250" :src="item.image"></v-img>
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
      <v-col cols="8">
        <v-btn color="primary" @click="editNewItem">
          <v-icon left> mdi-plus </v-icon>
          新規登録
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
                  v-model="editedItem.image"
                  accept=".png"
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
    // 検索用メニュー
    searchUserMenu: false,
    valid: true,
    userChoice: 2,

    pageHeadTitle: "おすすめコンテンツ",
    dialogEdit: false,

    headers: [
      { text: "アイキャッチ画像", value: "image", width: "30%", align: "start" },
      { text: "サブタイトル", value: "subtitle", width: "20%", align: "start" },
      { text: "タイトル", value: "title", width: "20%", align: "start" },
      { text: "URL", value: "url", width: "20%", align: "start" },
      { text: "編集・削除", value: "updDel", sortable: false, width: "10%", align: "start" },
    ],
    contentsList: [],
    editedIndex: -1,

    editedItem: {
      url: "",
      subtitle: "",
      title: "",
      image: "",
      status: false,
    },
    defaultItem: {
      url: "",
      subtitle: "",
      title: "",
      image: "",
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
      this.contentsList = [
        {
          image:
            "https://s3.console.aws.amazon.com/s3/object/amplify-sdgsappmanagement-main-91300-deployment?region=us-east-2&prefix=basketball.jpg",
          subtitle: "エコプロ2022セブン＆愛グループ特設サイト",
          title: "環境モンスターをクイズでやっつけよう",
          url: "https://www.7andi.com/company/news/release/202210271100.html",
          status: false,
        },
        {
          image:
            "https://s3.console.aws.amazon.com/s3/object/amplify-sdgsappmanagement-main-91300-deployment?region=us-east-2&prefix=basketball.jpg",
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
      console.log(this.editedItem.image);
      if (this.editedIndex > -1) {
        // 編集押下されたとき
        Object.assign(this.contentsList[this.editedIndex], this.editedItem);
      } else {
        // 新規登録が押下されたとき
        this.contentsList.push(this.editedItem);
      }
      this.close();
    },
    editNewItem() {
      this.dialogEdit = true;
    },
  },
};
</script>
