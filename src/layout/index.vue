<script setup lang="ts">
    import { ref, watch, type Component } from "vue";
    import { useRoute } from "vue-router";
    import Default from "./Default.vue";
    import Admin from "./Admin.vue";

    const route = useRoute();
    const LayoutComponent = ref<Component>(Default);

    watch(
        () => route.fullPath,
        (newPath) => {
            if (newPath === "/admin") {
                LayoutComponent.value = Admin;
            } else {
                LayoutComponent.value = Default;
            }
        }
    );
</script>

<template>
    <LayoutComponent>
        <slot />
    </LayoutComponent>
</template>
