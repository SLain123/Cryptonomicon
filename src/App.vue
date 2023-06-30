<template>
    <div class="spin_center" v-if="!tickerList">
        <rise-loader color="purple" size="30px"></rise-loader>
    </div>

    <div class="ticker_content" v-if="tickerList">
        <ticker-input
            v-model="tickerInputValue"
            :tickerList="tickerList"
            :isDuplicateTicker="isDuplicateTicker"
            :isErrorTicker="isErrorTicker"
            @add-ticker="addTicker"
            @clear-warnings="clearWarnings"
        />

        <ticker-filters
            v-model="filters"
            :page="page"
            :total="totalPage"
            @change-filters="changeFilters"
            @change-page="changePage"
        />

        <ul class="ticker_list" v-if="activeTickers.length">
            <ticker-item
                v-for="{ tickerName, price } in pageSeparatedTickers"
                :key="tickerName"
                :tickerName="tickerName"
                :price="price"
                :selectedTicker="selectedTicker"
                @select-ticker="selectTicker"
                @remove-ticker="removeTicker"
            />
        </ul>

        <ticker-statistic
            v-if="selectedTicker"
            :priceList="selectedPriceList"
            @select-ticker="selectTicker"
        />
    </div>

    <button-component
        class="modal_btn"
        @click="toggleModal"
        text=" Open modal"
    />

    <modal-window :isOpen="isOpenModal" @close-modal="toggleModal">
        <template v-slot:content><form-component /></template>
    </modal-window>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RiseLoader from 'vue-spinner/src/RiseLoader.vue';

import TickerInput from '@/components/TickerInput.vue';
import TickerItem from '@/components/TickerItem.vue';
import TickerStatistic from '@/components/TickerStatistic.vue';
import TickerFilters from '@/components/TickerFilters.vue';

import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import ModalWindow from '@/components/ModalWindow.vue';
import FormComponent from '@/components/FormComponent.vue';

import {
    getAllTickers,
    subscribeToUpdate,
    unSubscribeToUpdate,
} from '@/services/getTickerData';
import { TickerListType, ITickerCustome } from '@/types/Ticker';
import { addValueToQueryUrl, getQueryParams } from '@/utils/urlFuncs';

export default defineComponent({
    name: 'App',
    components: {
        TickerInput,
        TickerItem,
        TickerStatistic,
        TickerFilters,
        RiseLoader,
        ModalWindow,
        ButtonComponent,
        FormComponent,
    },

    data() {
        return {
            tickerInputValue: '',
            filters: '',
            page: 1,
            isDuplicateTicker: false,
            isErrorTicker: false,
            tickerList: null as null | TickerListType,
            activeTickers: [] as ITickerCustome[],
            selectedTicker: null as null | string,
            selectedPriceList: [] as number[],
            isOpenModal: false,
        };
    },

    methods: {
        addTicker(ticker: string) {
            const newTickerName = ticker.toUpperCase();
            const isDuplicate = Boolean(
                this.activeTickers.find(
                    ({ tickerName }) =>
                        tickerName.toUpperCase() === newTickerName,
                ),
            );

            if (isDuplicate) {
                this.tickerInputValue = newTickerName;
            } else {
                subscribeToUpdate(newTickerName, this.updatePrice);
                this.tickerInputValue = '';
            }
            this.isDuplicateTicker = isDuplicate;
        },

        updatePrice(newTickerName: string, newPrice: number, isError: boolean) {
            const currentIndex = this.activeTickers.findIndex(
                ({ tickerName }) => tickerName === newTickerName,
            );
            const updatedTickerData = {
                tickerName: newTickerName,
                price: newPrice,
            };

            if (newPrice) {
                currentIndex == -1
                    ? (this.activeTickers = [
                          ...this.activeTickers,
                          updatedTickerData,
                      ])
                    : (this.activeTickers[currentIndex] = updatedTickerData);

                this.selectedTicker === newTickerName &&
                    (this.selectedPriceList = [
                        ...this.selectedPriceList,
                        newPrice,
                    ]);
            }
            isError && (this.isErrorTicker = true);
        },

        removeTicker(ticker: string) {
            const currentIndex = this.activeTickers.findIndex(
                ({ tickerName }) => tickerName === ticker,
            );

            this.activeTickers = [
                ...this.activeTickers.slice(0, currentIndex),
                ...this.activeTickers.slice(currentIndex + 1),
            ];
            unSubscribeToUpdate(ticker);
            this.selectedTicker === ticker && (this.selectedTicker = null);
        },

        selectTicker(ticker: string | null) {
            const currentTicker = this.activeTickers.find(
                ({ tickerName }) => tickerName === ticker,
            );
            const firstPrice = currentTicker?.price
                ? [currentTicker.price]
                : [];

            this.selectedTicker = ticker;
            this.selectedPriceList = firstPrice;
        },

        clearWarnings() {
            this.isDuplicateTicker = false;
            this.isErrorTicker = false;
        },

        changeFilters(filters: string) {
            this.filters = filters;
            this.page = 1;
        },

        changePage(page: number) {
            this.page = page;
        },

        loadTickersFromStorage() {
            const storageTickers = localStorage.getItem('tickers');
            const queryParams = getQueryParams();

            storageTickers && (this.activeTickers = JSON.parse(storageTickers));
            this.activeTickers.forEach(({ tickerName }) =>
                subscribeToUpdate(tickerName, this.updatePrice),
            );

            queryParams?.page && (this.page = +queryParams.page);
            queryParams?.filters && (this.filters = queryParams.filters);
        },

        async saveAllTickers() {
            getAllTickers().then((list) => (this.tickerList = list));
        },

        toggleModal() {
            this.isOpenModal = !this.isOpenModal;
        },
    },

    computed: {
        filtredTickers(): ITickerCustome[] {
            return this.activeTickers.filter(({ tickerName }) =>
                tickerName.includes(this.filters),
            );
        },

        pageSeparatedTickers(): ITickerCustome[] {
            const start = (this.page - 1) * 8;
            const end = this.page * 8;

            return this.filtredTickers.slice(start, end);
        },

        totalPage(): number {
            return Math.ceil(this.filtredTickers.length / 8);
        },
    },

    watch: {
        activeTickers() {
            localStorage.setItem('tickers', JSON.stringify(this.activeTickers));
            this.page > this.totalPage &&
                this.page > 1 &&
                this.changePage(this.page - 1);
        },

        page() {
            addValueToQueryUrl('page', String(this.page));
        },

        filters() {
            addValueToQueryUrl('filters', this.filters);
        },
    },

    created() {
        this.loadTickersFromStorage();
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

.modal_btn {
    margin-top: 24px;
}
</style>
