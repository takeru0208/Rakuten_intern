<template>
  <div>
    <timer></timer>
    <player-view></player-view>
    <div>
      <betting-form></betting-form>
    </div>
  </div>
</template>

<script>
import BettingForm from "./BettingForm.vue";
import PlayerView from "./PlayerView.vue";
import Timer from "./Timer.vue";
// import { auth } from "../firebase";
export default {
  components: { BettingForm, PlayerView, Timer },
  // created() {
  //   auth.onAuthStateChanged(function(user) {
  //     const userInfo = {
  //       id: user.id,
  //       name: user.name,
  //       point: 1000,
  //       win: 0,
  //       lose: 0,
  //       icon: "",
  //       isViewer: true,
  //     };
  //     this.$store.commit("setUser", userInfo);
  //   });
  // },
};
</script>

<style scoped>
.bettingForm {
  width: 50%;
}
</style>
