<template>
    <TickerInput v-model="tickerValue" @add-ticker="addTicker" />
    <ul class="ticker_list" v-if="tickerList.length">
        <TickerItem
            v-for="{ id, name, cost } in tickerList"
            :key="id"
            :id="id"
            :name="name"
            :cost="cost"
            @remove-ticker="removeTicker"
        />
    </ul>
</template>

<script lang="ts">
import TickerInput from './components/TickerInput.vue';
import TickerItem from './components/TickerItem.vue';

import { getTickerInfo } from './services/getTickerInfo';

export default {
    name: 'App',
    components: {
        TickerInput,
        TickerItem,
    },
    data() {
        return {
            tickerValue: '',
            tickerList: [
                { id: 0, name: 'first', cost: 10 },
                { id: 1, name: 'second', cost: 100 },
                { id: 2, name: 'third', cost: 20 },
                { id: 3, name: 'fourth', cost: 240 },
            ],
        };
    },
    methods: {
        addTicker(newTicker: string) {
            this.tickerList.push({ id: +new Date(), name: newTicker, cost: 0 });
        },

        removeTicker(tickerId: number) {
            const newList = this.tickerList.filter(({ id }) => id !== tickerId);
            this.tickerList = newList;
        },

        async fetchTicker() {
            getTickerInfo('test').then((res) => console.log(res));
        },
    },
    mounted() {
        this.fetchTicker();
    },
};
</script>

<style lang="scss">
* {
    box-sizing: border-box;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    max-width: 1440px;
    margin: 40px auto 0 auto;
}

.ticker {
    &_list {
        list-style-type: none;
        padding: 12px 0;
        margin: 0;
        border-top: 2px solid rgba(128, 128, 128, 0.5);
        border-bottom: 2px solid rgba(128, 128, 128, 0.5);
        display: flex;
        flex-wrap: wrap;
    }
}
</style>
