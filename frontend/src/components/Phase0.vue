<template>
  <div class="grid">
    <div class="players">
      <PlayerView />
    </div>
    <v-btn
      @click="beAPlayer()"
      class="player_button"
      color="primary"
      elevation="2"
      :disabled="room.players.length >= 2 || !user.isViewer"
      >Be a player!</v-btn
    >
    <div class="icon-group">
      <Icon-component
        v-for="viewer in room.viewers"
        :key="viewer.id"
        :name="viewer.name"
      />
    </div>
    <div class="chatgroup">
      CHATROOM
      <v-list>
        <v-list-item v-for="n in 5" :key="n" link>
          <v-list-item-content>
            <v-list-item-title>Item {{ n }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script>
import IconComponent from "./IconComponent.vue";
import PlayerView from "./PlayerView.vue";
import { db } from "../firebase";
import firebase from "firebase";
import "firebase/firestore";

export default {
  components: { IconComponent, PlayerView },
  created() {
    // console.log(this.$store.state.user);
  },
  computed: {
    room() {
      return this.$store.state.room;
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    beAPlayer() {
      this.user.isViewer = false;
      // db書き換え
      db.collection("rooms")
        .doc(this.room.id)
        .update({
          viewers: this.room.viewers.filter(
            (viewer) => viewer.id !== this.user.id
          ),
          players: firebase.firestore.FieldValue.arrayUnion({
            to: "",
            bet: 0,
            profit: 0,
            ...this.user,
          }),
        });
    },
  },
};
</script>

<style>
.grid {
  display: grid;
  /* border: 1px solid red; */
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 2fr);
  height: 90vh;
  place-items: center;
}

.players {
  border: 1px solid gray;
  grid-column: 1 / 4;
  grid-row: 1 / 2;
  width: 100%;
  height: 100%;
}

.player_button {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
}
.icon-group {
  border: 1px solid red;
  grid-column: 1 / 4;
  grid-row: 3 / 4;
  width: 100%;
  height: 100%;
  display: flex;
  gap: 15px;
}
.chatgroup {
  border: 1px solid green;
  grid-column: 4 / 5;
  grid-row: 1 / 4;
  width: 100%;
  height: 100%;
}
</style>
