<template>
  <h2 class="time">{{ sec }} seconds left!</h2>
</template>

<script>
export default {
  name: "timer",
  props: ["time"],
  data() {
    return {
      // timer 時間
      sec: this.$props.time,
      timerOn: false,
      timerObj: null,
    };
  },
  created() {
    this.timerObj = setInterval(() => {
      this.count();
    }, 1000);
    this.timerOn = true;
  },
  methods: {
    count() {
      if (this.sec == 0) {
        this.complete();
      } else {
        this.sec--;
      }
    },
    complete: function() {
      clearInterval(this.timerObj);
    },
  },
};
</script>
