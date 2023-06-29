<script setup>
    import { useStore } from 'vuex';
    import { computed, onMounted, ref, onUpdated } from 'vue';
    import { useRoute } from 'vue-router';

    const store = useStore()
    const title = useRoute().params.title
    const synopsis_tab = ref(true)
    const trailer_tab = ref(false)

    const movie = computed(() => store.getters.getSingleMovie)
    const isAuthenticated = computed(() => store.state.isAuthenticated)
    
    onMounted(() => {
        if (isAuthenticated.value) {
            store.dispatch('getSingleMovieFromStore', title)
        }
    })

    onUpdated(() => {
        document.title = movie.value.title + ' | The Movie'
    })

    const changeSynopsisTab = () => {
        synopsis_tab.value = true
        trailer_tab.value = false
    }

    const changeTrailerTab = () => {
        synopsis_tab.value = false
        trailer_tab.value = true
    }

</script>

<template>
    <section class="mt-10 container">
        <div v-if="movie">
            <div class="flex gap-4 justify-center lg:justify-evenly">
                <img :src="movie.get_poster_url" :alt="movie.title" class="w-40 h-56 md:w-1/2 md:h-1/2 lg:w-1/3 lg:h-1/3">
                <div class="flex flex-col gap-3">
                    <p class="text-3xl">{{ movie.title }}</p>
                    <p>
                        <i class="fa-solid fa-calendar mr-2 text-sm"></i>
                        Realeased: {{ movie.released }}
                    </p>
                    <div>
                        <p class="text-3xl bg-gray-800 py-1 px-2">
                            {{ movie.imdb_rating }}
                            <span class="text-base">
                                IMDB: {{ movie.imdb_rating }}/10
                            </span>
                        </p>
                        
                    </div>
                    <div v-if="movie.director.length">
                        <p v-for="director in movie.director">
                            <i class="fa-solid fa-bullhorn mr-2 text-sm"></i>
                            Director: {{ director.first_name }} {{ director.last_name }}
                        </p>
                    </div>
                    <div v-else>
                        <i class="fa-solid fa-bullhorn mr-2 text-sm"></i>
                            Director: N/A
                    </div>
                    <p>
                        <i class="fa-solid fa-male mr-2 text-lg"></i>
                        Main Casts: <span v-for="actor in movie.actors">
                            {{ actor.first_name }} {{ actor.last_name }},
                        </span>
                    </p>
                </div>
            </div>

            <div class="mt-10 px-12 pb-12 bg-gray-800">
                <div class="flex justify-center text-xl pb-3">
                    <p class="p-3 cursor-pointer" :class="{'bg-black': synopsis_tab}" @click="changeSynopsisTab">Synopsis</p>
                    <p class="p-3 cursor-pointer" :class="{'bg-black': trailer_tab}" @click="changeTrailerTab">Trailer</p>
                </div>
                <p v-if="synopsis_tab" class="mt-5">
                    <p class="text-xl border-b-2 border-dashed pb-2">{{ movie.title }}</p>
                        <p class="mt-8">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa quia voluptas eos soluta ex iste doloremque inventore optio, totam neque ipsa beatae repellendus, eum sapiente rem ut placeat molestias enim cumque reprehenderit non voluptatem! Mollitia, consequatur, beatae provident, a debitis voluptate consequuntur facilis blanditiis rem eos adipisci eum officiis hic modi incidunt veniam ad. Delectus maiores nemo eveniet soluta, blanditiis ea eius suscipit ipsam sit ipsa dicta perferendis fugiat quisquam illo eos in eligendi architecto magni tempora hic! Unde quod consequatur corrupti. Est eum aliquid nisi nihil quasi error delectus architecto expedita, optio aspernatur mollitia molestias quibusdam et. In, repellat.
                    </p>

                    <div class="mt-10 font-bold">
                        Genre...........
                        <span v-for="genre in movie.genre">
                            {{ genre.name }},
                        </span>
                    </div>
                </p>
                
                <div v-if="movie.get_trailer_url && trailer_tab">
                    <p class="text-xl border-b-2 border-double pb-2">{{ movie.title }} (Trailer)</p>
                    <video class="mt-7" :src="movie.get_trailer_url" controls></video>
                </div>
                <div v-else-if="!movie.get_trailer_url && trailer_tab" class="text-center text-2xl py-7">
                    No Trailer Posted Yet!
                </div>
            </div>
        </div>
    </section>
</template>
