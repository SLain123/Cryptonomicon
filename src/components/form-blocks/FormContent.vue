<template>
    <div class="form">
        <input
            class="input"
            type="text"
            name="name"
            placeholder="Type your name"
            :value="name"
            @input="updateInputValue($event, 'name')"
        />
        <input
            class="input"
            type="text"
            name="email"
            placeholder="Type your email"
            :value:="email"
            @input="updateInputValue($event, 'email')"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'FormComponent',

    data() {
        return { name: '', email: '' };
    },

    methods: {
        updateInputValue(evt: Event, key: 'name' | 'email') {
            const target = evt.target as HTMLFormElement;
            this[key] = target.value;
        },
    },
});
</script>

<style lang="scss">
.form {
    display: flex;
    flex-direction: column;
}
.input {
    margin-bottom: 16px;
}
</style>
