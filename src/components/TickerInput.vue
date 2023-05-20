<template>
    <div class="ticker_container">
        <label for="ticker" class="ticker_label">Ticker</label>
        <input
            type="input"
            class="ticker_input"
            id="ticker"
            :value="modelValue"
            @input="updateInputValue"
            @keydown.enter="addTicker"
        />
        <div class="ticker_complete_container" v-if="matchTickers.length">
            <button
                v-for="tickerName in matchTickers"
                :key="tickerName"
                type="button"
                class="ticker_complete_btn"
                @click="addTickerByAutocomplete"
            >
                {{ tickerName }}
            </button>
        </div>
        <button type="button" class="ticker_button" @click="addTicker">
            Add ticker
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { ITicker } from '@/types/Ticker';

export default defineComponent({
    name: 'TickerInput',
    props: {
        modelValue: String,
        tickerList: Object as PropType<{ [key: string]: ITicker } | null>,
    },
    data() {
        return {
            matchTickers: [] as string[],
        };
    },
    methods: {
        updateInputValue(evt: Event) {
            const target = evt.target as HTMLInputElement;
            this.$emit('update:modelValue', target.value);
        },

        addTicker() {
            if (this.modelValue) {
                this.$emit('add-ticker', this.modelValue);
                this.$emit('update:modelValue', '');
            }
        },
        addTickerByAutocomplete(evt: Event) {
            const target = evt.target as HTMLButtonElement;

            this.$emit('add-ticker', target.textContent);
            this.$emit('update:modelValue', '');
        },
        findMatchesTicker() {
            const tickerList = this?.tickerList ? this.tickerList : null;
            const inputValue = this?.modelValue ? this.modelValue : '';
            const searchRegex = new RegExp(inputValue, 'gi');

            this.matchTickers = [];

            if (tickerList && inputValue) {
                Object.keys(tickerList).some((key) => {
                    searchRegex.test(key) &&
                        this.matchTickers.length < 4 &&
                        this.matchTickers.push(key);
                });
            }
        },
    },
    watch: {
        modelValue() {
            this.findMatchesTicker();
        },
    },
});
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

    &_complete {
        &_container {
            margin: 8px 0 16px 0;
            width: 100%;
            display: flex;
        }

        &_btn {
            padding: 4px 12px;
            border: none;
            background-color: purple;
            color: white;
            cursor: pointer;
            border-radius: 8px;
            opacity: 0.8;
            margin-right: 8px;

            &:hover {
                opacity: 1;
            }
        }
    }
}
</style>
