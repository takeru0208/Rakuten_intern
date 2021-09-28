<template>
  <div>
    <v-text-field label="Room Name" v-model="roomName"></v-text-field>
    <v-btn @click="createRoom()">CREATE</v-btn>
  </div>
</template>

<script>
import { db } from "../firebase";
import firebase from "firebase";
import "firebase/firestore";

export default {
  name: "MakeNewRoom",
  data() {
    return {
      roomName: "",
    };
  },
  methods: {
    createRoom() {
      const user = {
        ...this.$store.state.user,
        to: "",
        bet: 0,
        profit: 0,
      };
      const room = {
        id: "",
        name: this.roomName,
        players: [],
        viewers: [],
        gamePhase: 0,
        capacity: 20,
        backendFin: false,
      };
      let roomId;
      db.collection("rooms")
        .add(room) // roomをfirestoreに追加
        .then((docRef) => {
          roomId = docRef.id;
          db.collection("rooms")
            .doc(roomId)
            .update({
              id: roomId,
              viewers: firebase.firestore.FieldValue.arrayUnion(user), // viewersに自分自身をいれる
            })
            .then(() => {
              this.$router.push(`game-room/${roomId}`);
            });
        });
    },
  },
};
</script>
