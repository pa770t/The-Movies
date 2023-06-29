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

    const previousPage = (url) => {
        store.dispatch('getTopRatedMoviesFromStore', url)
    }

    const nextPage = (url) => {
        store.dispatch('getTopRatedMoviesFromStore', url)
    }

</script>

<template>
    <section class="mt-2 container">
        <p class="text-3xl border-b border-dashed pb-2 mt-10">Top Rated</p>
        <ul class="mt-10 flex gap-2 flex-wrap justify-center">
            <li v-for="movie in movies.results" :key="movie.id">
                <RouterLink :to="{name: 'single-movie', params: {title: encodeURI(movie.title)}}">
                    <img :src="movie.get_poster_url" :alt="movie.title" class="w-40 h-56">
                </RouterLink>
                <p v-if="movie.title.length > 16" class="text-gray-700 text-lg px-1 font-semibold">{{ movie.title.slice(0, 16) }}...</p>
                <p v-else class="text-gray-700 text-lg px-1 font-semibold">{{ movie.title.slice(0, 16) }}</p>
            </li>
        </ul>
        <ul class="mt-7 flex justify-between">
            <li v-if="movies.previous" @click="previousPage(movies.previous)" class="bg-yellow-500 px-2 py-1 cursor-pointer">&DoubleLeftArrow; Previous</li>
            <li v-if="movies.next" @click="nextPage(movies.next)" class="bg-yellow-500 px-2 py-1 cursor-pointer">Next &DoubleRightArrow;</li>
        </ul>
    </section>
</template>
