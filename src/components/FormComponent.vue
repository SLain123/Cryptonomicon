<template>
    <form class="form">
        <input
            class="input"
            type="text"
            name="name"
            placeholder="Type your name"
        />
        <input
            class="input"
            type="text"
            name="email"
            placeholder="Type your email"
        />
    </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'FormComponent',
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
