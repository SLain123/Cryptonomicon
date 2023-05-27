<template>
    <div class="control_panel">
        <div>
            <label for="filter">Filter:</label>
            <input
                id="filter"
                type="input"
                class="control_filter"
                :value="modelValue"
                @input="updateInputValue"
            />
        </div>
        <div class="control_btns">
            <ButtonComponent
                @click="changePage(false)"
                text="Prev"
                :disabled="!(page && page > 1)"
            />
            <ButtonComponent
                @click="changePage(true)"
                text="Next"
                :disabled="!(page && total && page < total)"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ButtonComponent from '@/components/ui/ButtonComponent.vue';

export default defineComponent({
    name: 'TickerFilters',
    components: {
        ButtonComponent,
    },
    props: {
        modelValue: String,
        page: Number,
        total: Number,
    },
    methods: {
        updateInputValue(evt: Event) {
            const target = evt.target as HTMLInputElement;
            this.$emit('update:modelValue', target.value);
        },

        changePage(action: boolean) {
            const page = this?.page ? this.page : 1;
            const total = this?.total ? this.total : 1;

            if (action && page < total) {
                this.$emit('change-page', page + 1);
            }
            if (!action && page > 1) {
                this.$emit('change-page', page - 1);
            }
        },
        
        changeFilters() {
            this.$emit('change-filters', this.modelValue);
        },
    },
    watch: {
        modelValue() {
            this.changeFilters();
        },
    },
});
</script>

<style lang="scss">
.control {
    &_panel {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 24px;
        border-top: grey solid 1px;
    }

    &_filter {
        padding: 4px 16px;
        font-size: 16px;
        margin-left: 16px;
    }

    &_btns {
        display: flex;
        width: 10%;
        justify-content: space-between;
    }
}
</style>
