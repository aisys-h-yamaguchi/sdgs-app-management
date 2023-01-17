<template>
  <div class="pageHead">
    <v-row dense>
      <v-col cols="auto">
        <h2 class="pageHead__title">{{ pageHeadTitle }}</h2>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return { drawer: null };
  },
  props: {
    pageHeadTitle: {
      type: String,
      required: true,
    },
  },
};
</script>
