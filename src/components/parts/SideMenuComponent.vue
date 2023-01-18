<template>
  <v-navigation-drawer app clipped permanent width="250" class="pa-0" style="text-decoration: none">
    <v-btn to="/top" block depressed tile left height="60px"
      ><v-container pa-0><v-icon left>mdi-calendar</v-icon>トップ</v-container></v-btn
    >
    <v-btn to="/company" block depressed tile left height="60px">
      <v-container pa-0><v-icon left>mdi-calendar</v-icon>会社情報</v-container>
    </v-btn>
    <v-btn to="/app-user" block depressed tile left height="60px">
      <v-container pa-0><v-icon left>mdi-calendar</v-icon>アプリユーザー登録</v-container>
    </v-btn>
    <v-btn to="/learned-contents" block depressed tile left height="60px">
      <v-container pa-0><v-icon left>mdi-calendar</v-icon>学習コンテンツ</v-container>
    </v-btn>
    <v-btn to="/news" block depressed tile left height="60px">
      <v-container pa-0><v-icon left>mdi-calendar</v-icon>ニュースリリース</v-container>
    </v-btn>
    <v-btn to="/quiz" block depressed tile left height="60px">
      <v-container pa-0><v-icon left>mdi-calendar</v-icon>クイズ</v-container>
    </v-btn>
    <v-btn to="/recommended-contents" block depressed tile left height="60px">
      <v-container pa-0><v-icon left>mdi-calendar</v-icon>おすすめコンテンツ</v-container>
    </v-btn>
    <v-btn to="/admin-user" block depressed tile left height="60px">
      <v-container pa-0><v-icon left>mdi-calendar</v-icon>管理者登録</v-container>
    </v-btn>
  </v-navigation-drawer>
</template>
