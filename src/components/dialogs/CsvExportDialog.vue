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
          <v-btn color="primary" width="100" @click="execution"> 実行 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  props: {
    showDialog: Boolean,
  },
  data: () => ({
    inputFile: null,
    fileObject: "",
  }),
  computed: {},
  methods: {
    closeDialog() {
      this.$emit("close", false);
    },
    // 取り込みダイアログ ：実行
    execution() {
      // TODO: DL処理追加
      alert("CSVの書き出しが完了しました。");

      this.closeDialog();
      this.$emit("closeDialog", false);
    },
  },
};
</script>
