<template>
  <div class="text-center">
    <h2>{{ player.count }}回</h2>
    <h1 v-if="isWinner" class="winner">WINNER! ㊗</h1>
    <h1 v-else class="loser">Loser... 😭</h1>
    <h2>{{ player.name }}</h2>
  </div>
</template>

<script>
export default {
  props: ["player", "isWinner"],
  mounted() {
    console.log(this.$props.player);
  },
};
</script>

<style scoped>
.winner {
  color: red;
}
.loser {
  color: blue;
}
</style>
