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
  // 学習コンテンツ
  {
    path: "/learned-contents",
    name: "LearnedContentsComponent",
    component: () =>
      import(
        /* webpackChunkName: "learned-contents" */ "../components/pages/LearnedContentsComponent.vue"
      ),
  },
  // ニュースリリース
  {
    path: "/news",
    name: "NewsComponent",
    component: () => import(/* webpackChunkName: "news" */ "../components/pages/NewsComponent.vue"),
  },
  // クイズ
  {
    path: "/quiz",
    name: "QuizComponent",
    component: () => import(/* webpackChunkName: "quiz" */ "../components/pages/QuizComponent.vue"),
  },
  // おすすめコンテンツ
  {
    path: "/recommended-contents",
    name: "RecommendedContentsComponent",
    component: () =>
      import(
        /* webpackChunkName: "recommended-contents" */ "../components/pages/RecommendedContentsComponent.vue"
      ),
  },
  // 管理者登録
  {
    path: "/admin-user",
    name: "AdminUserComponent",
    component: () =>
      import(/* webpackChunkName: "admin-user" */ "../components/pages/AdminUserComponent.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
