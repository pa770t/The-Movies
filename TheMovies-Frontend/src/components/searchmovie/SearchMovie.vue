<script setup>
    import { computed, onMounted } from 'vue';
    import { useStore } from 'vuex';
    import { useRoute } from 'vue-router';

    const store = useStore()

    const search = useRoute().query.s
    const movies = computed(() => store.getters.getSearchMovies)
    const isAuthenticated = computed(() => store.state.isAuthenticated)

    onMounted(() => {
        if (isAuthenticated.value) {
            store.dispatch('getSearchMoviesFromStore', search)
        }
    })

</script>

<template>
    <section class="mt-2 container">
        <p class="text-3xl border-b border-dashed pb-2 mt-10">Search</p>
        <ul v-if="movies.length" class="mt-10 flex gap-2 flex-wrap justify-center">
            <li v-for="movie in movies" :key="movie.id">
                <RouterLink :to="{name: 'single-movie', params: {title: encodeURI(movie.title)}}">
                    <img :src="movie.get_poster_url" :alt="movie.title" class="w-40 h-56">
                </RouterLink>
                <p v-if="movie.title.length > 16" class="text-gray-700 text-lg px-1 font-semibold">{{ movie.title.slice(0, 16) }}...</p>
                <p v-else class="text-gray-700 text-lg px-1 font-semibold">{{ movie.title.slice(0, 16) }}</p>
            </li>
        </ul>

        <div v-else class="mt-48 flex justify-center text-2xl">
            No Such Movie Found!
        </div>
        <!-- <ul class="mt-7 flex justify-between">
            <li class="bg-yellow-500 px-2 py-1">&DoubleLeftArrow; Previous</li>
            <li class="bg-yellow-500 px-2 py-1">Next &DoubleRightArrow;</li>
        </ul> -->
    </section>
</template>
