<template>
  <div class="game-room">
    <v-container>
      <h1>You ({{ state.user.name }}) are in {{ state.room.name }}</h1>
      <p v-if="phase === 0">
        {{ state.room.viewers.length + state.room.players.length }} people in
        this room now.
      </p>
      <!-- viewer画面 -->
      <div v-if="state.user.isViewer">
        <div v-if="phase === 0">
          <p>
            Looking for players！ {{ 2 - state.room.players.length }} more
            people can be a player
          </p>
          <v-btn
            @click="beAPlayer()"
            class="player_button"
            color="primary"
            elevation="2"
            :disabled="state.room.players.length >= 2 || !state.user.isViewer"
            >Be a player!</v-btn
          >
        </div>
        <div v-if="phase === 1 || phase === 2">
          <h2 class="text-center">Squat Battle!</h2>
          <p>Squat as much as possible in 30 seconds!</p>
          <div v-if="!state.isBetDone">
            <betting-form></betting-form>
          </div>
          <div>
            <h3 class="text-center">
              You have done your bet. Watch them play via Zoom!
            </h3>
          </div>
        </div>
        <div v-else-if="phase >= 4">
          <Phase4 />
        </div>
      </div>
      <!-- player画面 -->
      <div v-else>
        <div v-if="phase === 0">
          <h1>You became a player! Please wait.</h1>
        </div>
        <div v-if="phase === 1 || phase === 2">
          <h2 class="text-center">Squat Battle!</h2>
          <p>Squat as much as possible in 30 seconds!</p>
          <Timer v-if="phase === 1" time="20" :phase="phase" />
          <div v-if="phase === 2">
            <Timer time="30" :phase="phase" />
          </div>
          <webrtc></webrtc>
          <graph style="margine-top: 600px;"></graph>
        </div>
        <div v-if="phase === 3" class="text-center">
          <v-progress-circular
            :size="70"
            :width="7"
            color="purple"
            indeterminate
          ></v-progress-circular>
          <h3>Laoding....</h3>
        </div>
        <div v-if="phase >= 4">
          <Phase4 />
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import { db, auth } from "../firebase";
import firebase from "firebase";
import BettingForm from "../components/BettingForm.vue";
import Timer from "../components/Timer.vue";
import Phase4 from "../components/Phase4.vue";
import Webrtc from "../components/Webrtc.vue";
import Graph from "../components/Graph.vue";

export default {
  components: { BettingForm, Timer, Webrtc, Phase4, Graph },

  created() {
    this.watchRoomInfo(this.$route.params.roomId);
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
  computed: {
    state() {
      return this.$store.state;
    },
    phase() {
      return this.$store.state.room.gamePhase;
    },
  },
  methods: {
    watchRoomInfo(roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((doc) => {
          const roomData = doc.data();
          this.$store.commit("setRoom", roomData);
          console.log(this.state.room);
        });
    },
    beAPlayer() {
      this.state.user.isViewer = false;
      // db書き換え
      console.log(this.state.user.isViewer);
      db.collection("rooms")
        .doc(this.state.room.id)
        .update({
          viewers: this.state.room.viewers.filter(
            (viewer) => viewer.id !== this.state.user.id
          ),
          players: firebase.firestore.FieldValue.arrayUnion({
            to: "",
            bet: 0,
            profit: 0,
            count: 0,
            ...this.state.user,
          }),
        });
    },
  },
};
</script>

<style scoped></style>
