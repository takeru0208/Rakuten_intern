<template>
  <div>
    <h2 class="mb-5">Join Room</h2>
    <v-card outlined class="v-card">
      <v-simple-table>
        <thead>
          <tr>
            <th class="text-left">
              Room Name
            </th>
            <th class="text-left">
              Capacity
            </th>
            <th class="text-left"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="room in rooms" :key="room.id">
            <td class="font-weight-bold text-center">{{ room.roomName }}</td>
            <td class="text-center">
              <span class="text-h5">{{ room.currentPeople }}</span
              >/{{ room.capacity }}
            </td>
            <td class="text-center">
              <v-btn color="primary" @click="joinRoom(room.id)">JOIN</v-btn>
            </td>
          </tr>
        </tbody></v-simple-table
      >
    </v-card>
  </div></template
>

<script>
import { db, auth } from "../firebase";
import firebase from "firebase";
import "firebase/firestore";

export default {
  data() {
    return {
      rooms: [],
    };
  },
  created() {
    auth.onAuthStateChanged((user) => {
      console.log(user);
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          this.$store.commit("setUser", doc.data());
        });
    });
    db.collection("rooms")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const roomData = doc.data();
          this.rooms.push({
            id: roomData.id,
            roomName: roomData.name,
            currentPeople: roomData.players.length + roomData.viewers.length, // 現在の部屋にいる人数
            capacity: roomData.capacity,
          });
        });
      });
  },
  methods: {
    joinRoom(roomId) {
      console.log(this.$store.state.user);
      const user = {
        to: "",
        bet: 0,
        profit: 0,
        ...this.$store.state.user,
      };

      db.collection("rooms")
        .doc(roomId)
        .update({
          viewers: firebase.firestore.FieldValue.arrayUnion(user),
        })
        .then(() => {
          this.$router.push(`/game-room/${roomId}`);
        });
    },
  },
};
</script>

<style>
.v-btn {
  margin: auto;
}
</style>
