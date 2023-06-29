<script setup>
    import { computed, onMounted } from 'vue';
    import { useStore } from 'vuex';

    const store = useStore()
    const total_movies = computed(() => store.getters.getMovies)
    const now_showing_movies = computed(() => store.getters.getNowShowingMovies)
    const isAuthenticated = computed(() => store.state.isAuthenticated)

    onMounted(async () => {
        if (isAuthenticated.value) {
            await store.dispatch('getMoviesFromStore')
            await store.dispatch('getNowShowingMoviesFromStore')
        }
    })

    document.title = 'Admin | The Movie'

</script>

<template>
    <section class="mt-10 container flex justify-center gap-8 flex-wrap">
        <div class="bg-yellow-600 rounded-xl p-10 flex flex-col justify-center items-center gap-y-3">
            <p class="text-xl">Total Movies</p>
            <p class="text-lg">({{total_movies.count}})</p>
            <RouterLink :to="{name: 'movielist-adminview'}" class="text-lg bg-purple-900 px-3 py-1 rounded-md">See all</RouterLink>
        </div>
    </section>
</template>
