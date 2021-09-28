<template>
  <div>
    <div v-if="players">
      <v-row class="mt-10">
        <v-col v-for="player in players" :key="player.id">
          <PlayerResult :player="player" :isWinner="player.id === winner" />
        </v-col>
      </v-row>
    </div>
    <div>
      <v-row>
        <v-col v-if="state.user.isViewer && viewers" class="text-center mt-10">
          Your Profit: {{ viewers[meIndex]["profit"] }}p <span>🎉</span>
        </v-col>
        <v-col v-if="!state.user.isViewer && players" class="text-center mt-10">
          Your Profit: {{ players[meIndex]["profit"] }}p <span>🎉</span>
        </v-col>
      </v-row>
    </div>
    <div class="text-center mt-10">
      <v-btn @click="toHome">HOME</v-btn>
    </div>
  </div>
</template>

<script>
import PlayerResult from "./PlayerResult.vue";
import { db, auth } from "../firebase";
export default {
  data() {
    return {
      winner: "",
      meIndex: 0,
      players: null,
      viewers: null,
      user: null,
    };
  },
  components: { PlayerResult },
  computed: {
    state() {
      return this.$store.state;
    },
  },
  async created() {
    auth.onAuthStateChanged((user) => {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          this.$store.commit("setUser", doc.data());
        });
    });
    await db
      .collection("rooms")
      .doc(this.$route.params.roomId)
      .get()
      .then((doc) => {
        this.$store.commit("setRoom", doc.data());
        const roomData = doc.data();
        let meIndex;
        if (this.state.user.isViewer) {
          meIndex = roomData.viewers.findIndex(
            (viewer) => viewer.id === this.state.user.id
          );
        } else {
          meIndex = roomData.players.findIndex(
            (player) => player.id === this.state.user.id
          );
        }

        console.log(meIndex);
        this.meIndex = meIndex;
        console.log("roomdata", roomData);

        this.players = roomData.players;
        this.viewers = roomData.viewers;
        this.winner = roomData.winner;
        this.user = this.state.user;
        console.log(this.players);
        console.log(this.players[meIndex]);
        console.log(this.players[meIndex]["profit"]);
      });
  },
  methods: {
    toHome() {
      this.$router.push("/create-game");
    },
  },
};
</script>

<style></style>
