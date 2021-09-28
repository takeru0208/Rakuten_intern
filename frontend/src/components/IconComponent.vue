<template>
  <div>
    <v-avatar>
      <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
    </v-avatar>
    <p>{{ name }}</p>
  </div>
</template>

<script>
export default {
  props: ["name"],
};
</script>

<style></style>
