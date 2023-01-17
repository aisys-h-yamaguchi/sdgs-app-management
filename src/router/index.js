import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  // 利用企業ログイン
  {
    path: "/",
    name: "LoginComponent",
    component: () =>
      import(/* webpackChunkName: "login" */ "../components/pages/LoginComponent.vue"),
    // props: true,
    // meta: {title: 'ログイン', desc: '', requiresAuth: false},
  },
  // 管理トップ
  {
    path: "/top",
    name: "TopComponent",
    component: () => import(/* webpackChunkName: "login" */ "../components/pages/TopComponent.vue"),
  },
  // 会社情報
  {
    path: "/company",
    name: "CompanyComponent",
    component: () =>
      import(/* webpackChunkName: "company" */ "../components/pages/CompanyComponent.vue"),
  },
  // アプリ利用ユーザー登録
  {
    path: "/app-user",
    name: "AppUserComponent",
    component: () =>
      import(/* webpackChunkName: "app-user" */ "../components/pages/AppUserComponent.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
