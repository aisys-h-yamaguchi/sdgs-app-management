<template>
  <v-container>
    <PageHeadComponent :page-head-title="pageHeadTitle" />
    <v-divider class="mx-4" inset vertical></v-divider>
    <!-- 検索メニュー -->
    <v-menu
      v-model="searchUserMenu"
      :close-on-content-click="false"
      :nudge-width="600"
      left
      offset-y
    >
      <!-- 検索ボタンを表示 -->
      <template v-slot:activator="{ on }">
        <v-btn absolute right outlined small v-on="on"
          >検索
          <v-icon right>mdi-magnify </v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <div>検索</div>
          <v-spacer></v-spacer>
          <v-btn @click="resetSearch" absolute right outlined>
            <v-icon>mdi-close </v-icon>
            検索リセット
          </v-btn>
        </v-card-title>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-list>
            <v-list-item>
              <v-row class="ma-0">
                <v-col>
                  <v-list-item-subtitle>
                    <div>メールアドレス</div>
                  </v-list-item-subtitle>
                  <v-text-field
                    v-model="editedItem.email"
                    placeholder="xxx.xxx@email.com"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-list-item-subtitle>
                    <div>名前</div>
                  </v-list-item-subtitle>
                  <v-text-field v-model="editedItem.name"></v-text-field>
                </v-col>
              </v-row>
            </v-list-item>
            <v-list-item>
              <v-row class="ma-0">
                <v-col>
                  <v-list-item-subtitle>
                    <div>表示するユーザーを選択</div>
                  </v-list-item-subtitle>
                  <v-radio-group v-model="userChoice" row mandatory>
                    <v-radio label="すべてのユーザー" :value="2"></v-radio>
                    <v-radio label="登録済ユーザー" :value="1"></v-radio>
                    <v-radio label="削除ユーザー" :value="0"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
          <v-card-actions>
            <v-btn color="primary" @click="searchUserList" class="text-capitalize"> 検索 </v-btn>
            <v-btn
              text
              outlined
              color="primary"
              class="text-capitalize"
              @click="searchUserMenu = false"
            >
              キャンセル
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-menu>
    <v-spacer></v-spacer>
    <v-col cols="3">
      <!-- CSVインポート -->
      <v-file-input
        @change="csvImport"
        type="file"
        label="CSVファイルを選択"
        prepend-icon="mdi-paperclip"
      />
    </v-col>
    <v-data-table :headers="headers" :items="appUserList" sort-by="userId" class="elevation-1">
      <!-- ユーザーID -->
      <template v-slot:[`item.userId`]="{ item }">
        <div>
          {{ item.userId }}
        </div>
      </template>
      <!-- 名前 -->
      <template v-slot:[`item.name`]="{ item }">
        <div>
          {{ item.name }}
        </div>
      </template>
      <!-- メールアドレス -->
      <template v-slot:[`item.email`]="{ item }">
        <div>
          {{ item.email }}
        </div>
      </template>
      <!-- ステータス -->
      <template v-slot:[`item.status`]="{ item }">
        <div>
          {{ item.status }}
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
      <v-col cols="9">
        <v-btn color="primary" @click="editNewItem">
          <v-icon left> mdi-plus </v-icon>
          新規登録
        </v-btn>
      </v-col>
      <v-col cols="3">
        <v-btn @click="csvExport()" color="grey">
          <v-icon left> mdi-download </v-icon>
          CSVダウンロード
        </v-btn>
      </v-col>
    </v-row>

    <v-spacer></v-spacer>

    <v-dialog v-model="dialogEdit" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-text-field v-model="editedItem.email" label="メールアドレス"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="editedItem.name" label="名前"></v-text-field>
              </v-col>
            </v-row>
            <v-row v-if="editedItem.status">
              <v-col>
                <v-checkbox v-model="editedItem.status" label="削除されているユーザー"></v-checkbox>
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
import downloadCsv from "download-csv";
export default {
  components: {
    PageHeadComponent,
  },
  data: () => ({
    // 検索用メニュー
    searchUserMenu: false,
    valid: true,
    userChoice: 2,

    pageHeadTitle: "アプリ利用ユーザー登録",
    dialogCsvImport: false,
    dialogCsvExport: false,
    dialogEdit: false,

    headers: [
      { text: "ユーザーID", value: "userId", align: "start" },
      { text: "名前", value: "name", align: "start" },
      { text: "メールアドレス", value: "email", align: "start" },
      { text: "ステータス", value: "status", align: "start" },
      { text: "編集・削除", value: "updDel", sortable: false, width: "100px", align: "start" },
    ],
    appUserList: [],
    editedIndex: -1,

    editedItem: {
      userId: "",
      name: "",
      email: "",
      status: false,
    },
    defaultItem: {
      userId: "",
      name: "",
      email: "",
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
      this.appUserList = [
        {
          userId: 1,
          name: "たろう",
          email: "aaa@gmail.com",
          status: false,
        },
        {
          userId: 2,
          name: "じろう",
          email: "bbb@gmail.com",
          status: true,
        },
        {
          userId: 3,
          name: "まさむね",
          email: "ccc@gmail.com",
          status: false,
        },
        {
          userId: 4,
          name: "さぶろう",
          email: "ddd@gmail.com",
          status: true,
        },
        {
          userId: 5,
          name: "山田史郎",
          email: "sss@gmail.com",
          status: true,
        },
        {
          userId: 6,
          name: "Eclair",
          email: "oooo@gmail.com",
          status: false,
        },
        {
          userId: 7,
          name: "Eclair",
          email: "hhh@gmail.com",
          status: false,
        },
        {
          userId: 8,
          name: "Eclair",
          email: "daad@gmail.com",
          status: false,
        },
        {
          userId: 9,
          name: "Eclair",
          email: "kkk@gmail.com",
          status: false,
        },
        {
          userId: 10,
          name: "Eclair",
          email: "iii@gmail.com",
          status: false,
        },
        {
          userId: 11,
          name: "Eclair",
          email: "ooo@gmail.com",
          status: false,
        },
      ];
      for (let i = 0; i < this.appUserList.length; i++) {
        if (this.appUserList[i].status) {
          this.appUserList[i].status = "削除済";
        } else {
          this.appUserList[i].status = "";
        }
      }
    },
    editItem(item) {
      this.editedIndex = this.appUserList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogEdit = true;
    },

    deleteItem(item) {
      this.editedIndex = this.appUserList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      const msg = "このデータを削除してよろしいですか？ \n ユーザー名 : " + item["name"];
      if (confirm(msg)) {
        // TODO: レコードごと削除か、フラグを立てるだけか、要確認
        // this.appUserList.splice(this.editedIndex, 1);
        item["status"] = true;
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
        Object.assign(this.appUserList[this.editedIndex], this.editedItem);
      } else {
        this.appUserList.push(this.editedItem);
      }
      this.close();
    },
    editNewItem() {
      this.dialogEdit = true;
    },
    // 検索条件を初期化
    resetSearch() {
      this.initialize();
    },
    // 検索条件にあったデータにフィルタリング
    searchUserList() {
      this.email = this.editedItem.email;
      this.name = this.editedItem.name;
      let searchUserLists = this.appUserList.filter((searchUsers) => {
        if (this.name && searchUsers.name && !searchUsers.name.includes(this.name)) {
          return false;
        }
        if (this.email && searchUsers.email !== this.email) {
          return false;
        }
        return true;
      });
      console.log(this.userChoice);
      if (this.userChoice === 0) {
        // 削除されたユーザーのみ表示
        this.appUserList = searchUserLists.filter((searchUsers) => searchUsers.status === true);
      } else if (this.userChoice === 1) {
        // 削除されたユーザーは表示しない
        this.appUserList = searchUserLists.filter((searchUsers) => searchUsers.status === false);
      } else {
        // すべてのユーザーを表示
        this.appUserList = searchUserLists;
      }
      this.searchUserMenu = false;
    },
    // csvエクスポート処理
    csvExport: function () {
      // 各テーブルヘッダーと現在表示されている項目がCSV出力される
      downloadCsv(this.appUserList);
      this.close();
    },
    // csvインポート処理
    csvImport: function (e) {
      const file = e;
      const reader = new FileReader();
      const csvLists = [];
      const Encoding = require("encoding-japanese");
      const loadFunc = () => {
        const lines = reader.result.split("\n");
        lines.forEach((element) => {
          const csvListData = element.split(",");
          // if (csvListData.length != 3) return;
          for (let i = 0; i <= csvListData.length; i++) {
            // 文字列から文字コード値の配列に変換
            const unicodeArray = Encoding.stringToCode(csvListData[i]);
            csvListData[i] = Encoding.convert(unicodeArray, {
              to: "UNICODE",
              from: "UTF8",
              type: "string",
            });
          }
          var csvList = {
            userId: csvListData[0],
            name: csvListData[1],
            email: csvListData[2],
          };

          csvLists.push(csvList);
        });
        this.appUserList = csvLists;
      };

      reader.onload = loadFunc;
      reader.readAsBinaryString(file);

      alert("CSV取り込みが完了しました。");
    },
  },
};
</script>
