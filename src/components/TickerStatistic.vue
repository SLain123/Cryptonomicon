<template>
    <div class="stat_container">
        <div
            v-for="(percent, indx) in graphList"
            :key="indx"
            class="stat_column"
            :style="{ height: `${percent * 2}px` }"
        ></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    name: 'TickerStatistic',
    props: { priceList: Array as PropType<number[]> },
    data() {
        return {
            graphList: [] as number[],
        };
    },
    methods: {
        saveNormaliseGraphList() {
            const maxValue = this?.priceList?.length
                ? Math.max(...this.priceList)
                : 0;
            const minValue = this?.priceList?.length
                ? Math.min(...this.priceList)
                : 0;
                
            this.graphList = this?.priceList?.length
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
    watch: {
        priceList() {
            this.saveNormaliseGraphList();
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
    }

    &_column {
        width: 10%;
        max-width: 50px;
        margin-right: 4px;
        background-color: rgb(134, 75, 134);
        border-radius: 2px;
    }
}
</style>
