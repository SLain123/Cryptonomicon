<template>
  <TickerInput v-model="tickerValue" @add-ticker="addTicker" />
</template>

<script>
import TickerInput from './components/TickerInput.vue'

export default {
  name: 'App',
  components: {
    TickerInput
  },
  data() {
    return {
      tickerValue: "",
      tickerList: [],
    }
  },
  methods: {
    addTicker: function (newTicker) {
      this.tickerList.push(newTicker)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 1440px;
  margin: 40px auto 0 auto;
}
</style>
