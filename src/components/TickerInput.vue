<template>
  <div class="ticker_container">
    <label for="ticker" class="ticker_label">Ticker</label>
    <input type="input" class="ticker_input" id="ticker" :value="modelValue" @input="updateInputValue"
      @keydown.enter="addTicker" />
    <button type="button" class="ticker_button" @click="addTicker">Add ticker</button>
  </div>
</template>

<script>
export default {
  name: 'TickerInput',
  props: {
    modelValue: String
  },
  methods: {
    updateInputValue(evt) {
      this.$emit('update:modelValue', evt.target.value)
    },

    addTicker() {
      this.$emit('add-ticker', this.modelValue)
      this.$emit('update:modelValue', "")
    }
  }
}
</script>

<style scoped lang="scss">
.ticker {
  &_container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 300px;
    margin-bottom: 32px;
  }

  &_label {
    cursor: pointer;
  }

  &_input {
    border: none;
    border-bottom: grey solid 1px;
    margin: 16px 0;
    font-size: 18px;
    padding: 4px 16px;
  }

  &_button {
    border: none;
    border-radius: 16px;
    background-color: grey;
    color: white;
    padding: 6px 16px;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
