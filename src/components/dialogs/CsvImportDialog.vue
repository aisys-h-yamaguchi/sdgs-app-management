<template>
  <v-container fluid pa-0>
    <v-dialog :modelValue="showDialog" persistent width="500px">
      <v-card>
        <v-card-title class="pa-0">
          <v-toolbar flat dark class="pa-2"> CSV取り込み </v-toolbar>
        </v-card-title>
        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="auto" align-self="center"> CSVファイルの指定 </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-file-input
                v-model="inputFile"
                accept=".csv"
                show-size
                counter
                outlined
                dense
                placeholder="ここをクリックしてください"
              ></v-file-input>
              {{ inputFile }}
            </v-col>
          </v-row>
          <v-divider class="mx-2" />
        </v-card-text>

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
  emits: ["update:showDialog"],
  data: () => ({
    inputFile: null,
    fileObject: "",
  }),
  computed: {},
  methods: {
    // Note :vue3.0仕様
    closeDialog() {
      this.$emit("update:showDialog");
    },
    // 取り込みダイアログ ：実行
    execution() {
      console.log(this.inputFile[0]);
      if (this.inputFile[0].type !== "text/csv") {
        alert("CSVを選択してください。");
        return;
      }
      let data = {};
      data.filename = this.inputFile[0].name;
      data.filesize = this.inputFile[0].size;

      alert("CSV取り込みが完了しました。");

      this.closeDialog();
      this.$emit("closeDialog", false);
    },
  },
};
</script>
