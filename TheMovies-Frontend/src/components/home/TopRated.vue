<script setup>
    import { onMounted, computed } from 'vue';
    import { useStore } from 'vuex';

    const store = useStore()

    const movies = computed(() => store.getters.getTopRatedMovies)
    const isAuthenticated = computed(() => store.state.isAuthenticated)

    onMounted(() => {
        if (isAuthenticated.value) {
            store.dispatch('getTopRatedMoviesFromStore')
        }
    })
</script>

<template>
    <section class="py-2 container border-t border-dashed">
        <div class="flex items-center justify-between text-red-500">
            <div class="uppercase text-lg">Top Rated</div>
            <RouterLink :to="{name: 'top-rated'}" class="underline">See all</RouterLink>
        </div>
        <ul class="mt-3 flex gap-2 flex-wrap justify-center">
            <li v-for="movie in movies.results" :key="movie.id">
                <RouterLink :to="{name: 'single-movie', params: {title: encodeURI(movie.title)}}">
                    <img :src="movie.get_poster_url" :alt="movie.title" class="w-40 h-56">
                </RouterLink>
                <p v-if="movie.title.length > 16" class="text-gray-700 text-lg px-1 font-semibold">{{ movie.title.slice(0, 16) }}...</p>
                <p v-else class="text-gray-700 text-lg px-1 font-semibold">{{ movie.title.slice(0, 16) }}</p>
            </li>
        </ul>
    </section>
</template>
