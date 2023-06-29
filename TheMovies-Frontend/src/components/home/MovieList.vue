<script setup>
    import { useRouter } from 'vue-router';
    import { ref } from 'vue';
    import LatestTrailers from './LatestTrailers.vue';
    import TopRated from './TopRated.vue'

    const router = useRouter()
    
    const search = ref('')
    const submitForm = () => {
        router.push({name: 'search', query: {s: encodeURIComponent(search.value)}})
    }

</script>

<template>
    <section class="container flex mt-5 flex-col lg:flex-row justify-between items-center gap-2 border-t border-dashed border-b p-3">
        <ul class="uppercase flex gap-x-4">
            <RouterLink :to="{name: 'latest-trailers'}">Latest Trailers</RouterLink>
            <RouterLink :to="{name: 'top-rated'}">Top Rated</RouterLink>
        </ul>
        <div>
            <form @submit.prevent="submitForm" class="flex items-center gap-x-3">
                <label for="search">
                    Search
                </label>
                <input class="border border-red-500 text-black rounded-md px-2 py-1" type="text" placeholder="Enter search here" v-model="search">
            </form>
        </div>
    </section>
    <LatestTrailers></LatestTrailers>
    <TopRated></TopRated>
</template>
