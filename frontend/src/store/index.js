import Vue from "vue";
import Vuex from "vuex";
// import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    isLoggedIn: false,
    room: {},
    isBetDone: false,
  },
  getters: {
    user(state) {
      return state.user;
    },
  },
  mutations: {
    setUser(state, val) {
      state.user = val;
    },
    setRoom(state, val) {
      state.room = val;
    },
    setIsLoggedIn(state, val) {
      state.isLoggedIn = val;
    },
    setIsBetDone(state, val) {
      state.isBetDone = val;
    },
  },
  // plugins: [
  //   createPersistedState({
  //     path: ["user"],
  //   }),
  // ],
});
