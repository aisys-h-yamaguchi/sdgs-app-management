<template>
  <v-container fluid pa-0 ma-0>
    <div style="max-width: 500px">
      <PageHeadComponent :page-head-title="pageHeadTitle" />
    </div>
  </v-container>
</template>

<script>
import PageHeadComponent from "../parts/PageHeadComponent.vue";
export default {
  components: {
    PageHeadComponent,
  },
  data() {
    return {
      pageHeadTitle: "クイズ",
    };
  },

  methods: {
    // 選択されているサービスID(globalParams)に紐づくサイト情報を取得。
  },
};
</script>
