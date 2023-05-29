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
        <p class="ticker_error" v-if="isDuplicateTicker">
            The ticker has already been added earlier
        </p>
        <p class="ticker_error" v-if="isErrorTicker">
            The ticker is uncorrect or is missing in the base
        </p>
        <ButtonComponent
            @click="addTicker"
            text="Add ticker"
            :disabled="!modelValue"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import { TickerListType } from '@/types/Ticker';

export default defineComponent({
    name: 'TickerInput',
    components: {
        ButtonComponent,
    },
    props: {
        modelValue: String,
        tickerList: Object as PropType<TickerListType | null>,
        isDuplicateTicker: Boolean,
        isErrorTicker: Boolean,
    },

    methods: {
        updateInputValue(evt: Event) {
            const target = evt.target as HTMLInputElement;
            this.$emit('update:modelValue', target.value);
            this.$emit('clear-warnings');
        },

        addTicker() {
            if (this.modelValue) {
                this.$emit('add-ticker', this.modelValue);
            }
        },

        addTickerByAutocomplete(evt: Event) {
            const target = evt.target as HTMLButtonElement;
            this.$emit('add-ticker', target.textContent?.toLocaleUpperCase());
        },
    },

    computed: {
        matchTickers() {
            const matchTickers: string[] = [];
            const tickerList = this?.tickerList ?? null;
            const inputValue = this?.modelValue ?? '';
            const searchRegex = new RegExp(inputValue, 'gi');

            if (tickerList && inputValue) {
                Object.keys(tickerList).some((key) => {
                    searchRegex.test(key) &&
                        matchTickers.length < 4 &&
                        matchTickers.push(key);
                });
            }

            return matchTickers;
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

    &_error {
        color: rgb(193, 37, 37);
        font-size: 16px;
        margin-top: 0;
    }
}
</style>
