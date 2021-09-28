<template>
  <div class="Barchart">
    <div>
      {{ betting }}
    </div>
    <div>
      {{ enemyBetting }}
    </div>
  </div>
</template>

<script>
import { db } from "../firebase";

export default {
  data() {
    return {
      betting: 0,
      enemyBetting: 0,
      total: 0,
    };
  },
  created() {
    db.collection("rooms")
      .doc(this.$route.params.roomId)
      .onSnapshot((querySnapshot) => {
        this.betting = 0;
        this.enemyBetting = 0;
        const viewers = querySnapshot.data().viewers;
        viewers.forEach((viewer) => {
          if (viewer.to == this.$store.state.user.id) {
            this.betting += viewer.bet;
            this.total += viewer.bet;
          } else {
            this.enemyBetting += viewer.bet;
            this.total += viewer.bet;
          }
        });
        if (this.total == 0) this.total = 1;
      });
  },
};
</script>

<style scoped>
.Barchart {
  height: 480px;
}
</style>
