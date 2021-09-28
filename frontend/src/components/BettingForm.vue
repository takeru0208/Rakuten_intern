<template>
  <div>
    <Timer v-if="phase === 1" time="20" />
    <Timer v-if="phase === 2" time="30" />
    <v-card max-width="700" class="mt-5">
      <v-row align="center">
        <v-col class="d-flex" cols="12" sm="3">
          <v-select
            :items="room.players"
            item-text="name"
            label="players"
            v-model="to"
          ></v-select>
        </v-col>

        <v-col cols="12" sm="7">
          <v-text-field
            label="price"
            outlined
            type="number"
            v-model="price"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="2">
          <v-btn @click="bet" :disabled="to === ''">BET</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { db } from "../firebase";
import Timer from "./Timer.vue";
export default {
  components: { Timer },
  data() {
    return {
      to: "", // name
      price: 500,
    };
  },
  computed: {
    room() {
      return this.$store.state.room;
    },
    user() {
      return this.$store.state.user;
    },
    phase() {
      return this.$store.state.room.gamePhase;
    },
  },
  methods: {
    bet() {
      // dbのviewersの掛け金を更新
      const toId = this.room.players.find((player) => player.name === this.to)
        .id;
      const meIndex = this.room.viewers.findIndex(
        (viewer) => viewer.id === this.user.id
      );
      const newViewers = [...this.room.viewers];
      newViewers[meIndex].to = toId;
      newViewers[meIndex].bet = Number(this.price);
      console.log(newViewers);
      db.collection("rooms")
        .doc(this.room.id)
        .update({
          viewers: newViewers,
        });

      this.$store.state.isBetDone = true;
    },
  },
};
</script>

<style></style>
