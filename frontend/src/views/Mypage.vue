<template>
    <div height="170" align="center" style="font-size:30pt;">マイページ
        <v-card elevation="3" height="200">
          <div class="player" style="font-size:20pt;">プレイヤー戦績</div> 
          <div class="stats" style="font-size:15pt;">{{user.win}}勝{{user.lose}}敗 勝率{{user.win / (user.win + user.lose)}}</div>
        </v-card>
    <v-card elevation="3">
      <v-row justify="center">
        <v-col align="center" cols="12" sm="6" md="3">
          <v-text-field label="メールアドレス" solo v-model="userEmail"></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" sm="6" md="3" >
          <v-text-field label="名前" solo v-model="userName"></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" sm="6" md="3" >
          <v-text-field label="今保有中のポイント" solo v-model="userPoint"></v-text-field>
        </v-col>
      </v-row>
    </v-card>
    <v-row justify="center" align-content="center">
      <v-btn absolute bottom left>SingIn</v-btn>
      <v-btn absolute bottom right>Sign Out</v-btn>
      <v-btn @click="toCreateGame()">戻る</v-btn>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: null,
      userPoint: null,
      userEmail: null,
    }
  },
  created() {
    this.userName = this.$store.state.user.name
    this.userPoint = this.$store.state.user.point
    this.userEmail = this.$store.state.user.email
    console.log(this.$store.state.user)
  },
  methods:{
    toCreateGame(){
      this.$router.push("/create-game")
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    }
  }
}
</script>

<style>
.player{
  font-size:50px;
  position: relative;
  top: 50px;
  height: 6rem;
  text-align: center;
  margin:auto 0 auto;
}
.stats{
  position: relative;
  top:20px;
  height: 4rem;
  text-align: center;
  margin:auto 0 auto;
}
</style>