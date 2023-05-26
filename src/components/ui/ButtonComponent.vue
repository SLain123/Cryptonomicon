<template>
    <button
        type="button"
        class="button"
        :class="userClass"
        :disabled="disabled"
    >
        {{ text }}
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ButtonComponent',
    props: {
        disabled: Boolean,
        userClass: String,
        text: String,
    },
});
</script>

<style lang="scss">
.button {
    border: none;
    border-radius: 16px;
    background-color: grey;
    color: white;
    padding: 6px 16px;
    cursor: pointer;

    &:hover {
        opacity: 0.9;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}
</style>
