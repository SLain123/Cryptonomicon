<template>
    <div class="stat_container">
        <div
            v-for="(percent, indx) in normaliseGraphList"
            :key="indx"
            class="stat_column"
            :style="{ height: `${percent * 2}px` }"
        />

        <button
            type="button"
            class="stat_remove_btn"
            @click="removeSelection"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    name: 'TickerStatistic',
    props: { priceList: Array as PropType<number[]> },

    methods: {
        removeSelection() {
            this.$emit('select-ticker', null);
        },
    },

    emits: {
        ['select-ticker']: (val: string | null) =>
            typeof val === 'string' || val === null,
    },

    computed: {
        normaliseGraphList() {
            const maxValue = this?.priceList?.length
                ? Math.max(...this.priceList)
                : 0;
            const minValue = this?.priceList?.length
                ? Math.min(...this.priceList)
                : 0;

            return this?.priceList?.length
                ? this.priceList
                      .map((price) => {
                          return maxValue == minValue
                              ? 50
                              : (90 * (price - minValue)) /
                                    (maxValue - minValue) +
                                    10;
                      })
                      .slice(-30)
                : [];
        },
    },
});
</script>

<style lang="scss">
.stat {
    &_container {
        margin-top: 32px;
        border: 1px rgb(169, 159, 159) solid;
        border-radius: 4px;
        padding: 24px;
        display: flex;
        overflow: hidden;
        min-height: 200px;
        align-items: flex-end;
        position: relative;
    }

    &_column {
        width: 10%;
        max-width: 50px;
        margin-right: 4px;
        background-color: rgb(134, 75, 134);
        border-radius: 2px;
    }

    &_remove_btn {
        position: absolute;
        top: 6px;
        right: 6px;
        width: 34px;
        height: 34px;
        border-radius: 100%;
        border: none;
        cursor: pointer;
        background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!----%3E%3Csvg width='34px' height='34px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 8L8 16M8.00001 8L16 16' stroke='%23000000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");

        &:hover {
            opacity: 0.8;
        }
    }
}
</style>
