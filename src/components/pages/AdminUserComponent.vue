<template>
  <v-container>
    <PageHeadComponent :page-head-title="pageHeadTitle" />
    <v-divider class="mx-4" inset vertical></v-divider>

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
    <v-data-table :headers="headers" :items="adminUserList" sort-by="email" class="elevation-1">
      <!-- ユーザーID -->
      <template v-slot:[`item.adminUserId`]="{ item }">
        <div>
          {{ item.adminUserId }}
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
      <!-- 所属 -->
      <template v-slot:[`item.affiliation`]="{ item }">
        <div>
          {{ item.affiliation }}
        </div>
      </template>
      <!-- 部署 -->
      <template v-slot:[`item.department`]="{ item }">
        <div>
          {{ item.department }}
        </div>
      </template>
      <!-- 権限 -->
      <template v-slot:[`item.role`]="{ item }">
        <div>
          {{ item.role }}
        </div>
      </template>

      <!-- 編集・削除アイコン -->
      <template v-slot:[`item.updDel`]="{ item }">
        <v-icon medium class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
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
    pageHeadTitle: "管理ユーザー登録",
    dialogEdit: false,

    headers: [
      { text: "ユーザーID", value: "adminUserId", align: "start" },
      { text: "名前", value: "name", align: "start" },
      { text: "メールアドレス", value: "email", align: "start" },
      { text: "所属", value: "affiliation", align: "start" },
      { text: "部署", value: "department", align: "start" },
      { text: "権限", value: "role", align: "start" },
      { text: "編集", value: "updDel", sortable: false, width: "100px", align: "start" },
    ],
    adminUserList: [],
    editedIndex: -1,

    editedItem: {
      adminUserId: "",
      name: "",
      email: "",
      affiliation: "",
      department: "",
      role: "",
    },
    defaultItem: {
      adminUserId: "",
      name: "",
      email: "",
      affiliation: "",
      department: "",
      role: "",
    },

    // 所属一覧
    affiliationList: [
      { text: "7NM", value: 1, sortable: false },
      { text: "イトヨーカドー", value: 2, sortable: false },
      { text: "ヨークベニマル", value: 3, sortable: false },
    ],
    // 部署一覧
    departmentList: [
      { text: "総務部", value: 1, sortable: false },
      { text: "企画総務部", value: 2, sortable: false },
      { text: "サービス企画部", value: 3, sortable: false },
    ],
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
      this.adminUserList = [
        {
          adminUserId: 1,
          name: "管理者A",
          email: "admin.user@gmail.com",
          affiliation: "7NM",
          department: "総務部",
          role: "1",
        },
        {
          adminUserId: 2,
          name: "管理者B",
          email: "admin2.user@gmail.com",
          affiliation: "7NM",
          department: "商品開発部",
          role: "0",
        },
        {
          adminUserId: 3,
          name: "管理者C",
          email: "admin3.user@gmail.com",
          affiliation: "株式会社イトーヨーカ堂",
          department: "企画総務部",
          role: "1",
        },
      ];

      for (let i = 0; i < this.adminUserList.length; i++) {
        if (this.adminUserList[i].role == "1") {
          // 権限（0: コンテンツ管理者 / 1: 利用企業管理者）
          this.adminUserList[i].role = "利用企業管理者";
        } else {
          this.adminUserList[i].role = "コンテンツ管理者";
        }
      }
    },
    editItem(item) {
      this.editedIndex = this.adminUserList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogEdit = true;
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
        Object.assign(this.adminUserList[this.editedIndex], this.editedItem);
      } else {
        this.adminUserList.push(this.editedItem);
      }
      this.close();
    },
    editNewItem() {
      this.dialogEdit = true;
    },
    // csvエクスポート処理
    csvExport: function () {
      // 各テーブルヘッダーと現在表示されている項目がCSV出力される
      const fileName = "adminUserList";
      downloadCsv(this.adminUserList, "", fileName);
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
          for (let i = 0; i < csvListData.length; i++) {
            // 文字列から文字コード値の配列に変換
            const unicodeArray = Encoding.stringToCode(csvListData[i]);
            csvListData[i] = Encoding.convert(unicodeArray, {
              to: "UNICODE",
              from: "UTF8",
              type: "string",
            });
          }
          var csvList = {
            adminUserId: csvListData[0],
            name: csvListData[1],
            email: csvListData[2],
            affiliation: csvListData[3],
            department: csvListData[4],
            role: csvListData[5],
          };

          csvLists.push(csvList);
        });
        this.adminUserList = csvLists;
      };

      reader.onload = loadFunc;
      reader.readAsBinaryString(file);

      alert("CSV取り込みが完了しました。");
    },
  },
};
</script>
