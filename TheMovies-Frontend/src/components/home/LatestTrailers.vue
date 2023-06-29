<script setup>
    import { onMounted, computed } from 'vue';
    import { useStore } from 'vuex';

    const store = useStore()

    const movies = computed(() => store.getters.getLatestMovies)
    const isAuthenticated = computed(() => store.state.isAuthenticated)

    onMounted(() => {
        if (isAuthenticated.value) {
            store.dispatch('getLatestMoviesFromStore')
        }
    })
</script>

<template>
    <section class="my-2 container">
        <div class="flex items-center justify-between text-red-500">
            <div class="uppercase text-lg">Latest Trailers</div>
            <RouterLink :to="{name: 'latest-trailers'}" class="underline">See all</RouterLink>
        </div>
        <ul class="mt-3 flex gap-2 flex-wrap justify-center">
            <li v-for="movie in movies.results" :key="movie.id">
                <RouterLink :to="{name: 'single-movie', params: {title: encodeURI(movie.title)}}">
                    <img :src="movie.get_poster_url" :alt="movie.title" class="w-40 h-56">
                </RouterLink>
                <p v-if="movie.title.length > 15" class="text-gray-700 text-lg px-1 font-semibold">{{ movie.title.slice(0, 15) }}...</p>
                <p v-else class="text-gray-700 text-lg px-1 font-semibold">{{ movie.title.slice(0, 16) }}</p>
            </li>
        </ul>
    </section>
</template>
