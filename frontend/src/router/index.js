import Vue from "vue";
import VueRouter from "vue-router";
import SignIn from "../views/SignIn.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "SignIn",
    component: SignIn,
  },
  {
    path: "/signin",
    name: "SignIn",
    component: () => import("../views/SignIn.vue"),
  },
  {
    path: "/create-game",
    name: "CreateGame",
    component: () => import("../views/CreateGame.vue"),
  },
  {
    path: "/game-room",
    name: "GameRoom",
    component: () => import("../views/GameRoom.vue"),
  },
  {
    path: "/mypage",
    name: "MyPage",
    component: () => import("../views/Mypage.vue"),
  },
  {
    path: "/game-room/:roomId",
    name: "GameRoom",
    component: () => import("../views/GameRoom.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
