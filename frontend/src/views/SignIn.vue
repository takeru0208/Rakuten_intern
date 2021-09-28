<template>
  <div>
    <v-container>
      <div class="title">GatherBetter</div>
      <div class="signin">
        <div v-if="isLogin">
          <a class="newUserBtn mx-5 mb-3" @click="isLogin = !isLogin"
            >New User?</a
          >
          <v-text-field
            v-if="!isLogin"
            label="name"
            v-model="name"
            class="mx-5"
          ></v-text-field>
          <v-text-field
            label="Email"
            v-model="email"
            class="mx-5"
          ></v-text-field>
          <v-text-field
            label="Password"
            v-model="password"
            class="mx-5"
            type="password"
          ></v-text-field>
          <v-btn @click="logIn()" color="primary" class="button">Log In</v-btn>
        </div>
        <div v-else>
          <a class="newUserBtn mx-5 mb-3" @click="isLogin = !isLogin"
            >Already have account?</a
          >
          <v-text-field label="name" v-model="name" class="mx-5"></v-text-field>
          <v-text-field
            label="Email"
            v-model="email"
            class="mx-5"
          ></v-text-field>
          <v-text-field
            label="Password"
            v-model="password"
            class="mx-5"
            type="password"
          ></v-text-field>
          <v-btn @click="signUp()" color="primary" class="button"
            >Sign Up</v-btn
          >
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import { auth } from "../firebase";
import { db } from "../firebase";

export default {
  data() {
    return {
      name: "",
      email: "test@gmail.com",
      password: "testtest",
      isLogin: true,
    };
  },
  methods: {
    signUp() {
      auth
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((userCredential) => {
          const uid = userCredential.user.uid;
          const email = userCredential.user.email;
          console.log(userCredential.user);
          const userInfo = {
            id: uid,
            email: email,
            name: this.name,
            point: 1000,
            win: 0,
            lose: 0,
            isViewer: true,
          };
          db.collection("users")
            .doc(uid)
            .set(userInfo);

          this.setUserState(userInfo);

          this.$router.push("/create-game");
        })
        .catch((e) => {
          console.log(e);
        });
    },
    logIn() {
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then((userCredential) => {
          const uid = userCredential.user.uid;

          db.collection("users")
            .doc(uid)
            .get()
            .then((doc) => {
              this.setUserState(doc.data());

              this.$router.push("/create-game");
            });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    setUserState(userInfo) {
      // Vuexにデータ反映
      this.$store.commit("setUser", userInfo);
    },
  },
};
</script>
<style scoped>
.newUserBtn {
  cursor: pointer;
  font-size: 1.2rem;
}
.title {
  border: 1px solid #000;
  text-align: center;
  padding: 100px;
  width: 50%;
  margin: auto;
  margin-bottom: 50px;
  font-weight: bold;
}
.signin {
  width: 40%;
  margin: auto;
}
.button {
  width: 100%;
}
</style>
