<template>
  <v-app>
    <v-container fluid pa-0 ma-0>
      <div style="max-width: 500px">
        <PageHeadComponent :page-head-title="pageHeadTitle" />
      </div>
      <v-row dense class="justify-end">
        <v-col cols="auto">
          <v-btn
            >検索
            <v-icon right>mdi-magnify </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-table height="600px">
      <thead>
        <tr>
          <th class="text-left">メールアドレス</th>
          <th class="text-left">名前</th>
          <th class="text-left">ステータス</th>
          <th class="text-left">編集・削除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in displayLists" :key="item.name">
          <td>{{ item.mailAddress }}</td>
          <td>{{ item.name }}</td>

          <td>{{ item.status }}</td>

          <td>
            <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon
            ><v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-row dense>
      <v-col cols="auto">
        <v-btn color="primary">
          <v-icon left> mdi-plus </v-icon>
          新規登録
        </v-btn>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-btn @click="openImport()" color="grey">
          <v-icon left> mdi-upload </v-icon>
          CSVデータ取り込み
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn @click="execDownloadCSV()" color="grey">
          <v-icon left> mdi-download </v-icon>
          CSVダウンロード
        </v-btn>
      </v-col>
    </v-row>
    <!-- アプリ利用ユーザー検索用ダイアログ表示 -->
    <!-- 新規登録用ダイアログ表示 -->
    <!-- CSVデータ取り込み用ダイアログ表示 -->
    <CsvImportDialog
      :showDialog="dialogCsvImport"
      @update:showDialog="dialogCsvImport = $event"
    ></CsvImportDialog>
    <!-- CSVデータダウンロード用ダイアログ表示 -->
  </v-app>
</template>

<script>
import PageHeadComponent from "../parts/PageHeadComponent.vue";
import CsvImportDialog from "../dialogs/CsvImportDialog.vue";
export default {
  components: {
    PageHeadComponent,
    CsvImportDialog,
  },
  data() {
    return {
      pageHeadTitle: "アプリ利用ユーザー登録",
      page: 1,
      length: 0,
      appUserInfo: [
        {
          mailAddress: "aaa@gmail.com",
          name: "Eclair",
          status: "削除済",
        },
        {
          mailAddress: "aaa@gmail.com",
          name: "Eclair",
          status: "",
        },
        {
          mailAddress: "aaa@gmail.com",
          name: "Eclair",
          status: "削除済",
        },
        {
          mailAddress: "aaa@gmail.com",
          name: "Eclair",
          status: "",
        },
        {
          mailAddress: "aaa@gmail.com",
          name: "Eclair",
          status: "",
        },
        {
          mailAddress: "aaa@gmail.com",
          name: "Eclair",
          status: "",
        },
        {
          mailAddress: "aaa@gmail.com",
          name: "Eclair",
          status: "",
        },
        {
          mailAddress: "aaa@gmail.com",
          name: "Eclair",
          status: "",
        },
        {
          mailAddress: "aaa@gmail.com",
          name: "Eclair",
          status: "",
        },
        {
          mailAddress: "aaa@gmail.com",
          name: "Eclair",
          status: "",
        },
        {
          mailAddress: "aaa@gmail.com",
          name: "Eclair",
          status: "",
        },
      ],
      displayLists: [],
      pageSize: 10,
      dialogCsvImport: false,
    };
  },

  methods: {
    // CSVデータ取り込み
    openImport() {
      this.dialogCsvImport = true;
    },

    pageChange: function () {
      this.displayLists = this.appUserInfo.slice(
        this.pageSize * (this.page - 1),
        this.pageSize * this.page
      );
    },
  },
  mounted: function () {
    // ページネーションを行う最大ページ数
    this.length = Math.ceil(this.appUserInfo.length / this.pageSize);

    // １ページに表示するデータを制限
    this.displayLists = this.appUserInfo.slice(
      this.pageSize * (this.page - 1),
      this.pageSize * this.page
    );
  },
};
</script>
