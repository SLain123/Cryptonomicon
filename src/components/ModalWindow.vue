<template>
    <div class="layout" v-if="isOpen" @click="closeModal">
        <form class="modal" @submit="submitModal">
            <slot name="content"></slot>
            <slot name="control"></slot>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ModalWindow',

    props: {
        isOpen: Boolean,
    },

    emits: {
        ['close-modal']: null,
        ['send-form']: (evt: Event) => evt.target,
    },

    methods: {
        closeModal(evt: MouseEvent) {
            const target = evt.target as HTMLElement;
            target.classList?.contains('layout') && this.$emit('close-modal');
        },

        submitModal(evt: Event) {
            evt.preventDefault();
            this.$emit('send-form', evt);
            this.$emit('close-modal');
        },
    },
});
</script>

<style lang="scss">
.layout {
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
}

.modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 40px;
    display: flex;
    flex-direction: column;
}
</style>
