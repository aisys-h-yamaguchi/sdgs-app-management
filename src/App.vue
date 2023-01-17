<template>
  <div id="app">
    <v-app id="main">
      <v-main>
        <div id="app">
          <HeaderBladeComponent :isLogined="isLogined"></HeaderBladeComponent>
        </div>
        <SideMenuComponent v-if="isLogined && displaySidemenu"></SideMenuComponent>
        <v-main class="pa-2 pa-sm-4">
          <router-view />
        </v-main>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import HeaderBladeComponent from "/src/components/parts/HeaderBladeComponent.vue";
import SideMenuComponent from "/src/components/parts/SideMenuComponent.vue";

export default {
  name: "App",
  components: {
    HeaderBladeComponent,
    SideMenuComponent,
  },
  data: () => ({
    isLogined: true,
    displaySidemenu: true,
    //
  }),
};
</script>
