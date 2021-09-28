<template>
  <div>
    <v-row>
      <v-col align="center">
        <v-sheet roqor="white" elevation="5" height="200" width="300">
          <v-img
            lazy-src="../assets/bg_red.png"
            max-height="200"
            max-width="300"
            src="../assets/bg_red.png"
          >
            <v-layout justify-center>
              <v-col align="center">
                <v-avatar color="primary" size="100" v-if="players[0]">
                  <img
                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                    alt="John"
                  />
                </v-avatar>
              </v-col>
            </v-layout>
          </v-img>
        </v-sheet>
        <h1 v-if="players[0]">{{ players[0].name }}</h1>
      </v-col>
      <v-col align="center"><h1>V.S.</h1></v-col>

      <v-col align="center">
        <v-sheet color="white" elevation="5" height="200" width="300">
          <v-img
            lazy-src="../assets/bg_blue.png"
            max-height="200"
            max-width="300"
            src="../assets/bg_blue.png"
          >
            <v-layout justify-center>
              <v-avatar color="primary" size="100" v-if="players[1]">
                <img
                  src="https://cdn.vuetifyjs.com/images/john.jpg"
                  alt="John"
                />
              </v-avatar>
            </v-layout>
          </v-img>
        </v-sheet>
        <h1 v-if="players[1]">{{ players[1].name }}</h1>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  computed: {
    players() {
      return this.$store.state.room.players;
    },
  },
};
</script>

<style></style>
