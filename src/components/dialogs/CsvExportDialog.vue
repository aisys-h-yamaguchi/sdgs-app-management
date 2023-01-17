<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-container fluid pa-0>
    <v-dialog v-model="showDialog" persistent width="500px">
      <v-card>
        <v-card-title class="pa-0">
          <v-toolbar flat dark class="pa-2"> CSV書き出し </v-toolbar>
        </v-card-title>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" width="100" outlined @click="closeDialog"> キャンセル </v-btn>
          <v-btn color="primary" width="100" @click="execDownloadCSV"> 実行 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import downloadCsv from "download-csv";
export default {
  props: {
    showDialog: Boolean,
    appUserList: Array,
  },
  data: () => ({}),
  computed: {},
  methods: {
    closeDialog() {
      this.$emit("close", false);
    },
    // 取り込みダイアログ ：実行
    execDownloadCSV() {
      // 各テーブルヘッダーと現在表示されている項目がCSV出力される
      downloadCsv(this.appUserList);
      this.closeDialog();
      this.$emit("closeDialog", false);
    },
  },
};
</script>
