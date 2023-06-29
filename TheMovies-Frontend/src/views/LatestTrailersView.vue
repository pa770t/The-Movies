<script setup>
    import LatestTrailersList from '../components/latesttrailers/LatestTrailersList.vue';
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex';
    import { computed, onBeforeMount } from 'vue';

    const router = useRouter()
    const store = useStore()
    
    const token = computed(() => store.getters.getToken)
    const isAuthenticated = computed(() => store.state.isAuthenticated)

    onBeforeMount(() => {
        if (!isAuthenticated.value && !token.value) {
            router.push({name: 'login'})
        }
        
    })

    document.title = 'Latest Trailer Movies | The Movie'

</script>

<template>
    <LatestTrailersList></LatestTrailersList>
</template>
