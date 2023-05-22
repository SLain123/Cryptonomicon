<template>
    <TickerInput
        v-model="tickerInputValue"
        :tickerList="tickerList"
        :isDuplicateTicker="isDuplicateTicker"
        @add-ticker="addTicker"
        @clear-duplicate="clearDuplicateValue"
    />
    <ul class="ticker_list" v-if="activeTickers.length">
        <TickerItem
            v-for="{ id, name, usd } in activeTickers"
            :key="id"
            :id="id"
            :name="name"
            :usd="usd"
            @remove-ticker="removeTicker"
        />
    </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import TickerInput from '@/components/TickerInput.vue';
import TickerItem from '@/components/TickerItem.vue';

import { getAllTickers, getTickerPrice } from '@/services/getTickerData';
import { TickerListType, ITickerCustome } from '@/types/Ticker';

export default defineComponent({
    name: 'App',
    components: {
        TickerInput,
        TickerItem,
    },
    data() {
        return {
            tickerInputValue: '',
            isDuplicateTicker: false,
            tickerList: null as null | TickerListType,
            activeTickers: [] as ITickerCustome[],
        };
    },
    methods: {
        addTicker(ticker: string) {
            const newTicker = ticker.toLocaleLowerCase();
            const id = +new Date();
            const interval = setInterval(() => this.updatePrice(id), 5000);
            const isDuplicate = Boolean(
                this.activeTickers.find(
                    ({ name }) => name.toLocaleLowerCase() === newTicker,
                ),
            );

            if (isDuplicate) {
                this.tickerInputValue = newTicker;
            } else {
                getTickerPrice(newTicker).then(({ USD }) => {
                    this.activeTickers.push({
                        id,
                        name: newTicker,
                        usd: USD,
                        interval,
                    });
                });
                this.tickerInputValue = '';
            }
            this.isDuplicateTicker = isDuplicate;
        },

        updatePrice(tickerId: number) {
            const currentTickerIndex = this.activeTickers.findIndex(
                ({ id }) => id === tickerId,
            );
            const currentTicker = this.activeTickers[currentTickerIndex];

            currentTicker &&
                getTickerPrice(currentTicker.name).then(
                    ({ USD }) => (currentTicker.usd = USD),
                );
        },

        removeTicker(tickerId: number) {
            const currentTickerIndex = this.activeTickers.findIndex(
                ({ id }) => id === tickerId,
            );
            const currentTicker = this.activeTickers[currentTickerIndex];

            clearInterval(currentTicker.interval);
            this.activeTickers = this.activeTickers.filter(
                ({ id }) => id !== tickerId,
            );
        },

        clearDuplicateValue() {
            this.isDuplicateTicker = false;
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
