<template>
  <div>
    <v-container>
      <h1>You are {{ this.$store.state.user.name }}</h1>
      <h2 class="mt-10">
        Create Room
      </h2>
      <make-new-room class="mb-12"></make-new-room>
      <v-btn @click="toMypage()">Mypageへ</v-btn>
      <join-room></join-room>
    </v-container>
  </div>
</template>

<script>
import MakeNewRoom from "../components/MakeNewRoom";
import JoinRoom from "../components/JoinRoom";
import { auth, db } from "../firebase";

export default {
  components: {
    MakeNewRoom,
    JoinRoom,
  },
  methods: {
    toMypage() {
      this.$router.push("/mypage");
    },
  },
  created() {
    console.log(this.$store.state.user.name);
    auth.onAuthStateChanged((user) => {
      console.log(user);
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          this.$store.commit("setUser", doc.data());
        });
    });
  },
};
</script>

<style></style>
