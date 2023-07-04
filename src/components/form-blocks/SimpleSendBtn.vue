<template>
    <button-component type="submit" text="Send" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ButtonComponent from '@/components/ui/ButtonComponent.vue';

export default defineComponent({
    name: 'SimpleSendBtn',

    components: {
        ButtonComponent,
    },
});
</script>
