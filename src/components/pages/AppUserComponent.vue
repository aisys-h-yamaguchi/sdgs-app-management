<template>
  <v-container>
    <PageHeadComponent :page-head-title="pageHeadTitle" />
    <v-divider class="mx-4" inset vertical></v-divider>
    <v-spacer></v-spacer>
    <v-data-table :headers="headers" :items="appUserList" sort-by="mailAddress" class="elevation-1">
      <!-- メールアドレス -->
      <template v-slot:[`item.mailAddress`]="{ item }">
        <div>
          {{ item.mailAddress }}
        </div>
      </template>
      <!-- 名前 -->
      <template v-slot:[`item.name`]="{ item }">
        <div>
          {{ item.name }}
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
      <v-col>
        <v-btn color="primary" @click="editNewItem">
          <v-icon left> mdi-plus </v-icon>
          新規登録
        </v-btn>
      </v-col>
      <v-col>
        <v-btn @click="openImport()" color="grey">
          <v-icon left> mdi-upload </v-icon>
          CSVデータ取り込み
        </v-btn>
      </v-col>
      <v-col>
        <v-btn @click="execDownloadCSV()" color="grey">
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
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="editedItem.mailAddress"
                  label="メールアドレス"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="editedItem.name" label="名前"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-checkbox v-model="editedItem.status" label="ステータス"></v-checkbox>
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
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- CSVデータ取り込み用ダイアログ表示 -->
    <CsvImportDialog :showDialog="dialogCsvImport" @close="closeImport"></CsvImportDialog>
  </v-container>
</template>

<script>
import PageHeadComponent from "../parts/PageHeadComponent.vue";
import CsvImportDialog from "../dialogs/CsvImportDialog.vue";
export default {
  components: {
    PageHeadComponent,
    CsvImportDialog,
  },
  data: () => ({
    pageHeadTitle: "アプリ利用ユーザー登録",
    dialogCsvImport: false,
    dialogEdit: false,
    dialogDelete: false,
    headers: [
      { text: "メールアドレス", value: "mailAddress", align: "start" },
      { text: "名前", value: "name", align: "start" },
      { text: "ステータス", value: "status", align: "start" },
      { text: "編集・削除", value: "updDel", sortable: false, width: "100px", align: "start" },
    ],
    appUserList: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      mailAddress: "",
      status: 0,
    },
    defaultItem: {
      name: "",
      mailAddress: "",
      status: 0,
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
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.appUserList = [
        {
          mailAddress: "aaa@gmail.com",
          name: "Eclair",
          status: false,
        },
        {
          mailAddress: "aaa@gmail.com",
          name: "Eclair",
          status: true,
        },
        {
          mailAddress: "aaa@gmail.com",
          name: "Eclair",
          status: false,
        },
        {
          mailAddress: "aaa@gmail.com",
          name: "Eclair",
          status: true,
        },
        {
          mailAddress: "aaa@gmail.com",
          name: "Eclair",
          status: true,
        },
        {
          mailAddress: "aaa@gmail.com",
          name: "Eclair",
          status: false,
        },
        {
          mailAddress: "aaa@gmail.com",
          name: "Eclair",
          status: false,
        },
        {
          mailAddress: "aaa@gmail.com",
          name: "Eclair",
          status: false,
        },
        {
          mailAddress: "aaa@gmail.com",
          name: "Eclair",
          status: false,
        },
        {
          mailAddress: "aaa@gmail.com",
          name: "Eclair",
          status: false,
        },
        {
          mailAddress: "aaa@gmail.com",
          name: "Eclair",
          status: false,
        },
      ];
    },
    // CSVデータ取り込み
    openImport() {
      this.dialogCsvImport = true;
    },
    // 取り込み：クローズ処理
    closeImport() {
      this.dialogCsvImport = false;
    },

    editItem(item) {
      this.editedIndex = this.appUserList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogEdit = true;
    },

    deleteItem(item) {
      this.editedIndex = this.appUserList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.appUserList.splice(this.editedIndex, 1);
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
      this.dialogDelete = false;
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
      // 全項目初期化
      this.dialogEdit = true;
    },
  },
};
</script>
