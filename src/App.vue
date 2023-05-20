<template>
    <TickerInput v-model="tickerInputValue" :tickerList="tickerList" @add-ticker="addTicker" />
    <ul class="ticker_list" v-if="activeTickers.length">
        <TickerItem
            v-for="{ id, name, cost } in activeTickers"
            :key="id"
            :id="id"
            :name="name"
            :cost="cost"
            @remove-ticker="removeTicker"
        />
    </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import TickerInput from '@/components/TickerInput.vue';
import TickerItem from '@/components/TickerItem.vue';

import { getAllTickers } from '@/services/getTickerData';

export default defineComponent({
    name: 'App',
    components: {
        TickerInput,
        TickerItem,
    },
    data() {
        return {
            tickerInputValue: '',
            tickerList: null,
            activeTickers: [
                { id: 0, name: 'first', cost: 10 },
                { id: 1, name: 'second', cost: 100 },
                { id: 2, name: 'third', cost: 20 },
                { id: 3, name: 'fourth', cost: 240 },
            ],
        };
    },
    methods: {
        addTicker(newTicker: string) {
            this.activeTickers.push({
                id: +new Date(),
                name: newTicker,
                cost: 0,
            });
        },

        removeTicker(tickerId: number) {
            const newList = this.activeTickers.filter(
                ({ id }) => id !== tickerId,
            );
            this.activeTickers = newList;
        },

        async saveAllTickers() {
            getAllTickers().then((list) => (this.tickerList = list));
        },
    },
    mounted() {
        this.saveAllTickers();
    },
});
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
