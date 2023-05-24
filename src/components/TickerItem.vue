<template>
    <li
        :class="selectedTickerId === id ? 'ticker_item_selected' : ''"
        class="ticker_item"
        @click="selectItem"
    >
        <p class="ticker_info ticker_name">{{ name }} - USD</p>
        <p class="ticker_info ticker_cost">{{ usd && +usd?.toFixed(8) }}</p>
        <button type="button" class="ticker_remove_btn" @click="removeItem">
            <span class="ticker_remove_text">Remove</span>
        </button>
    </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    name: 'TickerItem',
    props: {
        id: Number,
        name: String,
        usd: Number,
        selectedTickerId: Number as PropType<number | null>,
    },
    methods: {
        selectItem() {
            this.$emit('select-ticker', this.id);
        },

        removeItem() {
            this.$emit('remove-ticker', this.id);
        },
    },
});
</script>

<style scoped lang="scss">
.ticker {
    &_item {
        width: 25%;
        min-width: 200px;
        padding: 24px;
        cursor: pointer;

        &:hover {
            border: 2px purple solid;
            border-radius: 8px;
        }

        &_selected {
            border: 2px purple solid;
            border-radius: 8px;
        }
    }

    &_info {
        margin: 0 0 16px 0;
        text-transform: uppercase;
    }

    &_name {
        color: grey;
        font-size: 16px;
    }

    &_cost {
        color: black;
        font-size: 32px;
    }

    &_remove {
        &_btn {
            margin-top: 24px;
            border: none;
            background-color: transparent;
            cursor: pointer;
            padding: 4px 16px;
            border-radius: 8px;

            &:hover {
                background-color: purple;
                color: white;
            }
        }

        &_text {
            font-size: 18px;
        }
    }
}
</style>
