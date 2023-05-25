<template>
    <div class="spin_center" v-if="!tickerList">
        <rise-loader color="purple" size="30px"></rise-loader>
    </div>

    <div class="ticker_content" v-if="tickerList">
        <TickerInput
            v-model="tickerInputValue"
            :tickerList="tickerList"
            :isDuplicateTicker="isDuplicateTicker"
            :isErrorTicker="isErrorTicker"
            @add-ticker="addTicker"
            @clear-warnings="clearWarnings"
        />
        <ul class="ticker_list" v-if="activeTickers.length">
            <TickerItem
                v-for="{ id, name, usd } in activeTickers"
                :key="id"
                :id="id"
                :name="name"
                :usd="usd"
                :selectedTickerId="selectedTickerId"
                @select-ticker="selectTicker"
                @remove-ticker="removeTicker"
            />
        </ul>
        <TickerStatistic
            v-if="selectedTickerId"
            :priceList="selectedPriceList"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RiseLoader from 'vue-spinner/src/RiseLoader.vue';

import TickerInput from '@/components/TickerInput.vue';
import TickerItem from '@/components/TickerItem.vue';
import TickerStatistic from '@/components/TickerStatistic.vue';

import { getAllTickers, getTickerPrice } from '@/services/getTickerData';
import { TickerListType, ITickerCustome } from '@/types/Ticker';

export default defineComponent({
    name: 'App',
    components: {
        TickerInput,
        TickerItem,
        TickerStatistic,
        RiseLoader,
    },
    data() {
        return {
            tickerInputValue: '',
            isDuplicateTicker: false,
            isErrorTicker: false,
            tickerList: null as null | TickerListType,
            activeTickers: [] as ITickerCustome[],
            selectedTickerId: null as null | number,
            selectedPriceList: [] as number[],
        };
    },
    methods: {
        addTicker(ticker: string) {
            const newTickerName = ticker.toLocaleLowerCase();
            const id = +new Date();
            const interval = setInterval(() => this.updatePrice(id), 5000);
            const isDuplicate = Boolean(
                this.activeTickers.find(
                    ({ name }) => name.toLocaleLowerCase() === newTickerName,
                ),
            );

            if (isDuplicate) {
                this.tickerInputValue = newTickerName;
            } else {
                getTickerPrice(newTickerName).then(({ USD }) => {
                    if (USD) {
                        this.activeTickers.push({
                            id,
                            name: newTickerName,
                            usd: USD,
                            interval,
                        });
                        localStorage.setItem(
                            'tickers',
                            JSON.stringify(this.activeTickers),
                        );
                    } else {
                        this.isErrorTicker = true;
                    }
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
                getTickerPrice(currentTicker.name).then(({ USD }) => {
                    currentTicker.usd = USD;
                    this.selectedTickerId === tickerId &&
                        (this.selectedPriceList = [
                            ...this.selectedPriceList,
                            USD,
                        ]);
                });
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
            localStorage.setItem('tickers', JSON.stringify(this.activeTickers));

            if (this.selectedTickerId === tickerId) {
                this.selectedTickerId = null;
                this.selectedPriceList = [];
            }
        },

        selectTicker(tickerId: number | null) {
            this.selectedTickerId = tickerId;
            this.selectedPriceList = [];
        },

        clearWarnings() {
            this.isDuplicateTicker = false;
            this.isErrorTicker = false;
        },

        async saveAllTickers() {
            getAllTickers().then((list) => (this.tickerList = list));
        },
    },
    created() {
        const storageTickers = localStorage.getItem('tickers');

        storageTickers && (this.activeTickers = JSON.parse(storageTickers));
        this.activeTickers.forEach((ticker) => {
            const newInterval = setInterval(
                () => this.updatePrice(ticker.id),
                5000,
            );
            ticker.interval = newInterval;
        });
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

.spin_center {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
