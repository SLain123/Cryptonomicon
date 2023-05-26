<template>
    <div class="control_panel">
        <input
            type="input"
            class="control_filter"
            :value="modelValue"
            @input="updateInputValue"
        />
        <div class="control_btns">
            <ButtonComponent
                @click="changePage(false)"
                text="Prev"
                :disabled="false"
            />
            <ButtonComponent
                @click="changePage(true)"
                text="Next"
                :disabled="false"
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
    },
    methods: {
        updateInputValue(evt: Event) {
            const target = evt.target as HTMLInputElement;
            this.$emit('update:modelValue', target.value);
        },

        changePage(action: boolean) {
            this.page &&
                this.$emit(
                    'change-page',
                    action ? this.page + 1 : this.page - 1,
                );
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
    }

    &_btns {
        display: flex;
        width: 10%;
        justify-content: space-between;
    }
}
</style>
