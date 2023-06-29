<script setup>
    import TopRatedList from '../components/toprated/TopRatedList.vue';
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

    document.title = 'Top Rated Movies | The Movie'

</script>

<template>
    <TopRatedList></TopRatedList>
</template>
