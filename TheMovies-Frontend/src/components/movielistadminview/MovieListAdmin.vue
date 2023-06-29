<script setup>
    import { onMounted, onBeforeMount, computed, ref, reactive } from 'vue';
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex';
    import axios from 'axios';

    const store = useStore()
    const router = useRouter()

    const movies = computed(() => store.getters.getMovies)
    const genres = computed(() => store.getters.getGenres)

    const token = computed(() => store.state.token)
    const isAuthenticated = computed(() => store.state.isAuthenticated)
    const isAdmin = computed(() => store.state.isAdmin)

    onBeforeMount(() => {
        if (!isAuthenticated.value && !token.value) {
            router.push({name: 'login'})
        }

        if (!isAdmin.value) {
            router.push({name: 'home'})
        }
        
    })
    
    onMounted(() => {
        if (isAuthenticated.value) {
            store.dispatch('getMoviesFromStore')
        }
    })
    
    onMounted(() => {
        if (isAuthenticated.value) {
            store.dispatch('getGenresFromStore')
        }
    })

    const suggested_genres = ref([])
    const selected_genres = ref([])
    const isEditOpen = ref(false)
    const movie = ref(null)

    const add_to_suggested_genres = value => {
        suggested_genres.value.unshift(value)
        selected_genres.value = selected_genres.value.filter(genre => genre.name !== value.name)
    }

    const add_to_selected_genres = value => {
        selected_genres.value.push(value)
        suggested_genres.value = suggested_genres.value.filter(genre => genre.name !== value.name)
    }

    const editMode = (value) => {
        selected_genres.value = value
        suggested_genres.value = genres.value

        suggested_genres.value = suggested_genres.value.filter(ele => !selected_genres.value.some(val => val.name === ele.name)
        )
    }

    // Delete Movie
    const isDeleteModeOpen = ref(false)
    const isDeleteConfirm = ref(false)
    const movieToDelete = ref(null)
    const message = ref(null)
    
    const performDelete = () => {
        isDeleteConfirm.value = true
        if (isDeleteConfirm.value && movieToDelete.value) {
            store.dispatch('deleteMovie', movieToDelete.value.title)
            isDeleteConfirm.value = false
            isDeleteModeOpen.value = false

            // show message box and close after 3 sec
            message.value = 'Successfully Deleted!'
            setTimeout(() => {
                message.value = null
            }, 3000);
        }
    }

    // Add new movie
    const isNewMovieOpen = ref(false)
    onMounted(() => {
        store.dispatch('getDirectorsFromStore')
    })
    onMounted(() => {
        store.dispatch('getWritersFromStore')
    })
    onMounted(() => {
        store.dispatch('getActorsFromStore')
    })

    const directors = computed(() => store.getters.getDirectors)
    const writers = computed(() => store.getters.getWriters)
    const actors = computed(() => store.getters.getActors)

    const suggested_directors = ref([])
    const selected_directors = ref([])
    const suggested_writers = ref([])
    const selected_writers = ref([])
    const suggested_actors = ref([])
    const selected_actors = ref([])

    const newMovie = reactive({
        title: '',
        genre: [],
        director: [],
        writer: [],
        actors: [],
        released: '',
        now_showing: false,
        runtime: 0,
        imdb_rating: 0,
        awards: '',
        poster: null,
        trailer: null,
        synopsis: '',
    })
    
    const addNewMovie = () => {
        isNewMovieOpen.value = true
        suggested_genres.value = genres.value

        suggested_genres.value = suggested_genres.value.filter(ele => !selected_genres.value.some(val => val.name === ele.name)
        )

        suggested_directors.value = directors.value
        suggested_directors.value = suggested_directors.value.filter(ele => !selected_directors.value.some(val => val.id === ele.id))

        suggested_writers.value = writers.value
        suggested_writers.value = suggested_writers.value.filter(ele => !selected_writers.value.some(val => val.id === ele.id))

        suggested_actors.value = actors.value
        suggested_actors.value = suggested_actors.value.filter(ele => !selected_actors.value.some(val => val.id === ele.id))

        newMovie.director = selected_directors.value
        newMovie.writer = selected_writers.value
        newMovie.actors = selected_actors.value
    }

    const add_to_suggested_directors = value => {
        suggested_directors.value.unshift(value)
        selected_directors.value = selected_directors.value.filter(d => d.id !== value.id)
    }

    const add_to_selected_directors = value => {
        selected_directors.value.push(value)
        suggested_directors.value = suggested_directors.value.filter(d => d.id !== value.id)
    }

    const add_to_suggested_writers = value => {
        suggested_writers.value.unshift(value)
        selected_writers.value = selected_writers.value.filter(w => w.id !== value.id)
    }

    const add_to_selected_writers = value => {
        selected_writers.value.push(value)
        suggested_writers.value = suggested_writers.value.filter(w => w.id !== value.id)
    }

    const add_to_suggested_actors = value => {
        suggested_actors.value.unshift(value)
        selected_actors.value = selected_actors.value.filter(a => a.id !== value.id)
    }

    const add_to_selected_actors = value => {
        selected_actors.value.push(value)
        suggested_actors.value = suggested_actors.value.filter(a => a.id !== value.id)
    }

    const handlePosterUpload = (event) => {
        newMovie.poster = event.target.files[0]

        const reader = new FileReader()

        reader.onload = () => {
            newMovie.poster = reader.result
        }

        reader.readAsDataURL(newMovie.poster)
    }

    const handleTrailerUpload = async (event) => {
        newMovie.trailer = event.target.files[0]

        const reader = new FileReader()

        reader.onload = () => {
            newMovie.trailer = reader.result
        }

        reader.readAsDataURL(newMovie.trailer)
    }

    const submitMovie = () => {
        newMovie.genre = selected_genres.value
        newMovie.director = selected_directors.value
        newMovie.writer = selected_writers.value
        newMovie.actors = selected_actors.value
        store.dispatch('createMovie', newMovie)
        isNewMovieOpen.value = false

        // show message box and close after 3 sec
        message.value = 'Successfully Added a Movie!'
        setTimeout(() => {
            message.value = null
        }, 3000);
    }

    const editedMovie = reactive({
        id: 0,
        title: '',
        genre: [],
        released: '',
        runtime: 0,
        imdb_rating: 0,
        awards: '',
        synopsis: '',
        now_showing: Boolean
    })

    const editMovie = (value) => {
        isEditOpen.value = true
        movie.value = value

        editedMovie.id = movie.value.id
        editedMovie.title = movie.value.title
        editedMovie.genre = movie.value.genre
        editedMovie.released = movie.value.released
        editedMovie.runtime = movie.value.runtime
        editedMovie.imdb_rating = movie.value.imdb_rating
        editedMovie.awards = movie.value.awards
        editedMovie.synopsis = movie.value.synopsis
        editedMovie.now_showing = movie.value.now_showing
    }

    const submitEditedData = () => {
        editedMovie.genre = selected_genres.value
        store.dispatch('editMovie', editedMovie)
        isEditOpen.value = false
    }

    const previousPage = (url) => {
        store.dispatch('getMoviesFromStore', url)
    }

    const nextPage = (url) => {
        store.dispatch('getMoviesFromStore', url)
    }

    const isNewGenreOpen = ref(false)
    const isNewDirectorOpen = ref(false)
    const isNewWriterOpen = ref(false)
    const isNewActorOpen = ref(false)

    const newGenreName = ref('')
    const newWriterName = reactive({first_name: '', last_name: ''})
    const newDirectorName = reactive({first_name: '', last_name: ''})
    const newActorName = reactive({first_name: '', last_name: ''})

    const submitGenre = () => {
        store.dispatch('addNewGenre', newGenreName.value)
        isNewGenreOpen.value = false
    }

    const submitDirector = () => {
        store.dispatch('addNewDirector', newDirectorName)
        isNewDirectorOpen.value = false
    }

    const submitWriter = () => {
        store.dispatch('addNewWriter', newWriterName)
        isNewWriterOpen.value = false
    }

    const submitActor = () => {
        store.dispatch('addNewActor', newActorName)
        isNewActorOpen.value = false
    }

    const s_director = ref('')
    const searchDirector = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '127.0.0.1',
                'Access-Control-Allow-Credentials': true,
                'Authorization': `Token ${store.state.token}`
            }
        }

        await axios.get(`http://127.0.0.1:8000/api/directorlist/?s=${s_director.value}`, config)
            .then(res => {
                suggested_directors.value = res.data.filter(ele => !selected_directors.value.some(val => val.id === ele.id)
                )
            })
    }

    const s_writer = ref('')
    const searchWriter = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '127.0.0.1',
                'Access-Control-Allow-Credentials': true,
                'Authorization': `Token ${store.state.token}`
            }
        }

        await axios.get(`http://127.0.0.1:8000/api/writerlist/?s=${s_writer.value}`, config)
            .then(res => {
                suggested_writers.value = res.data.filter(ele => !selected_writers.value.some(val => val.id === ele.id)
                )
            })
    }

    const s_actor = ref('')
    const searchActor = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '127.0.0.1',
                'Access-Control-Allow-Credentials': true,
                'Authorization': `Token ${store.state.token}`
            }
        }

        await axios.get(`http://127.0.0.1:8000/api/actorlist/?s=${s_actor.value}`, config)
            .then(res => {
                suggested_actors.value = res.data.filter(ele => !selected_actors.value.some(val => val.id === ele.id)
                )
            })
    }

</script>

<template>
    <section class="mt-10 container">
        <div v-if="message" :class="{'text-green-600': message === 'Successfully Added a Movie!', 'text-red-600': message === 'Successfully Deleted!'}" class="font-semibold bg-white p-2 w-1/2 rounded absolute top-10 right-5 flex items-center justify-between">
            <p>{{ message }}</p>
            <i class="fa-solid fa-x cursor-pointer text-black" @click="message = null"></i>
        </div>

        <div class="flex items-center justify-end my-3">
            <button class="bg-white px-2 py-1 text-green-600 font-bold rounded-md" @click="addNewMovie">Add New Movie</button>
        </div>

        <ul class="flex flex-col">
            <li v-for="movie in movies.results" :key="movie.id" class="bg-yellow-600 p-4 flex text-center justify-between items-center border-b">
                <RouterLink :to="{name: 'single-movie', params: {title: encodeURI(movie.title)}}">
                    <img :src="movie.get_poster_url" :alt="movie.title" class="w-20 h-24">
                </RouterLink>
                <h2 class="text-xl">{{movie.title}}</h2>
                <span>
                    <i class="fa-solid fa-edit mx-2 cursor-pointer" @click="editMovie(movie), editMode(movie.genre)"></i>
                    <i class="fa-solid fa-trash mx-2 cursor-pointer" @click="movieToDelete = movie, isDeleteModeOpen = true"></i>
                </span>
            </li>
        </ul>

        <ul class="mt-7 flex justify-end gap-x-2">
            <li v-if="movies.previous" @click="previousPage(movies.previous)" class="bg-yellow-500 px-2 py-1 cursor-pointer">&DoubleLeftArrow; Previous</li>
            <li v-if="movies.next" @click="nextPage(movies.next)" class="bg-yellow-500 px-2 py-1 cursor-pointer">Next &DoubleRightArrow;</li>
        </ul>

        <Teleport to="body">
            <div v-if="isDeleteModeOpen" class="fixed overflow-scroll top-0 text-white bg-black w-full h-full p-10 z-10 text-center pt-[30%]">
                <p>Are you sure to <span class="text-red-600">delete</span> this movie?</p>
                <div class="mt-5 flex justify-center gap-x-8">
                    <button class="px-2 py-1 bg-red-600 rounded" @click="performDelete">Delete</button>
                    <button class="px-2 py-1 bg-white text-black rounded" @click="isDeleteModeOpen = false">Cancel</button>
                </div>
            </div>
        </Teleport>

        <Teleport to="body">
            <div v-if="isEditOpen" class="fixed overflow-scroll top-0 text-white bg-black w-full h-full p-10 z-10">
                <div class="flex justify-end cursor-pointer" @click="isEditOpen = false">
                    <i class="fa-solid fa-x"></i>
                </div>
                <div>
                    <form @submit.prevent="submitEditedData" class="flex flex-col justify-center">
                        <label class="text-xl my-2" for="title">Title:</label>
                        <input class="border rounded px-2 py-1 ml-5 text-black block" type="text" id="title" v-model="editedMovie.title">

                        <label class="text-xl my-2" for="awards">Awards:</label>
                        <input class="border rounded px-2 py-1 ml-5 text-black block" type="text" id="awards" v-model="editedMovie.awards">

                        <label class="text-xl my-2" for="synopsis">Synopsis:</label>
                        <input class="border rounded px-2 py-1 ml-5 text-black block" type="text" id="synopsis" v-model="editedMovie.synopsis">

                        <label class="text-xl my-2" for="imdb_rating">IMDB:</label>
                        <input class="border rounded px-2 py-1 ml-5 text-black block" type="text" id="imdb_rating" v-model="editedMovie.imdb_rating">

                        <label class="text-xl my-2" for="runtime">Runtime:</label>
                        <input class="border rounded px-2 py-1 ml-5 text-black block" type="text" id="runtime" v-model="editedMovie.runtime">
                        
                        <label class="text-xl my-2" for="released">Released:</label>
                        <input class="border rounded px-2 py-1 ml-5 text-black block" type="date" id="released" v-model="editedMovie.released">

                        <label class="text-xl my-2" for="now_showing">Now Showing:</label>
                        <input class="self-start" type="checkbox" id="now_showing" v-model="editedMovie.now_showing">

                        <p class="text-xl my-2">Genre:</p>
                        <ul class="flex flex-wrap gap-2">
                            <li class="bg-yellow-600 px-2 py-1 rounded cursor-pointer" v-for="genre in selected_genres" @click="add_to_suggested_genres(genre)">
                                <i class="fa-solid fa-x text-sm"></i> {{ genre.name }}
                            </li>
                        </ul>

                        <p class="text-xl my-2">Add new Genre:</p>
                        <ul v-if="suggested_genres" class="flex flex-wrap gap-2">
                            <li class="bg-yellow-600 px-2 py-1 rounded cursor-pointer" v-for="genre in suggested_genres" @click="add_to_selected_genres(genre)">
                                <i class="fa-solid fa-plus text-sm"></i> {{ genre.name }}
                            </li>
                            <li class="bg-red-600 px-2 py-1 rounded cursor-pointer">
                                <i class="fa-solid fa-plus"></i> Add new Genre
                            </li>
                        </ul>
                        
                        <button class="w-full bg-white text-green-600 font-bold text-xl rounded-md mt-5 p-2">Submit</button>
                    </form>
                </div>
            </div>
        </Teleport>

        <Teleport to="body">
            <div v-if="isNewMovieOpen" class="fixed overflow-scroll top-0 text-white bg-black w-full h-full p-10 z-10">
                <div class="flex justify-end cursor-pointer" @click="isNewMovieOpen = false">
                    <i class="fa-solid fa-x"></i>
                </div>
                <div>
                    <form @submit.prevent="submitMovie" class="flex flex-col justify-center">
                        <label class="text-xl my-2" for="title">Title:</label>
                        <input class="border rounded px-2 py-1 ml-5 text-black block" type="text" id="title" v-model="newMovie.title">

                        <label class="text-xl my-2" for="awards">Awards:</label>
                        <input class="border rounded px-2 py-1 ml-5 text-black block" type="text" id="awards" v-model="newMovie.awards">

                        <label class="text-xl my-2" for="synopsis">Synopsis:</label>
                        <input class="border rounded px-2 py-1 ml-5 text-black block" type="text" id="synopsis" v-model="newMovie.synopsis">

                        <label class="text-xl my-2" for="imdb_rating">IMDB:</label>
                        <input class="border rounded px-2 py-1 ml-5 text-black block" type="text" id="imdb_rating" v-model="newMovie.imdb_rating">

                        <label class="text-xl my-2" for="runtime">Runtime:</label>
                        <input class="border rounded px-2 py-1 ml-5 text-black block" type="text" id="runtime" v-model="newMovie.runtime">
                        
                        <label class="text-xl my-2" for="released">Released:</label>
                        <input class="border rounded px-2 py-1 ml-5 text-black block" type="date" id="released" v-model="newMovie.released">

                        <label class="text-xl my-2" for="now_showing">Now Showing:</label>
                        <input class="border rounded px-2 py-1 ml-5 text-black block self-start" type="checkbox" id="now_showing" v-model="newMovie.now_showing">

                        <label class="text-xl my-2" for="poster">Poster:</label>
                        <input class="border rounded px-7 py-10 ml-5 text-white bg-gray-600 block" type="file" id="poster" @change="handlePosterUpload">

                        <label class="text-xl my-2" for="trailer">Trailer:</label>
                        <input class="border rounded px-7 py-10 ml-5 text-white bg-gray-600 block" type="file" id="trailer" @change="handleTrailerUpload">

                        <p class="text-xl my-2">Genre:</p>
                        <ul class="flex flex-wrap gap-2">
                            <li class="bg-yellow-600 px-2 py-1 rounded cursor-pointer" v-for="genre in selected_genres" @click="add_to_suggested_genres(genre)">
                                <i class="fa-solid fa-x text-sm"></i> {{ genre.name }}
                            </li>
                        </ul>

                        <p class="text-xl my-2">Add new Genre:</p>
                        <ul v-if="suggested_genres" class="flex flex-wrap gap-2">
                            <li class="bg-yellow-600 px-2 py-1 rounded cursor-pointer" v-for="genre in suggested_genres" @click="add_to_selected_genres(genre)">
                                <i class="fa-solid fa-plus text-sm"></i> {{ genre.name }}
                            </li>
                            <li class="bg-red-600 px-2 py-1 rounded cursor-pointer" @click="isNewGenreOpen = true">
                                <i class="fa-solid fa-plus"></i> Add new Genre
                            </li>
                        </ul>

                        <p class="text-xl my-2">Director:</p>
                        <ul v-if="selected_directors" class="flex flex-wrap gap-2">
                            <li class="bg-yellow-600 px-2 py-1 rounded cursor-pointer" v-for="director in selected_directors" @click="add_to_suggested_directors(director)">
                                <i class="fa-solid fa-x text-sm"></i> {{ director.first_name }} {{ director.last_name }}
                            </li>
                        </ul>

                        <p class="text-xl my-2">Add new Director:</p>
                        <div>
                            <input class="border rounded px-2 py-1 text-black my-2" placeholder="Search Director" type="text" v-model="s_director">
                            <i class="fa-solid fa-search bg-yellow-600 p-3 cursor-pointer -ml-8" @click="searchDirector"></i>
                        </div>
                        <ul v-if="suggested_directors" class="flex flex-wrap gap-2">
                            <li class="bg-yellow-600 px-2 py-1 rounded cursor-pointer" v-for="director in suggested_directors" @click="add_to_selected_directors(director)">
                                <i class="fa-solid fa-plus text-sm"></i> {{ director.first_name }} {{ director.last_name }}
                            </li>
                            <li class="bg-red-600 px-2 py-1 rounded cursor-pointer" @click="isNewDirectorOpen = true">
                                <i class="fa-solid fa-plus"></i> Add new Director
                            </li>
                        </ul>

                        <p class="text-xl my-2">Writer:</p>
                        <ul v-if="selected_writers" class="flex flex-wrap gap-2">
                            <li class="bg-yellow-600 px-2 py-1 rounded cursor-pointer" v-for="writer in selected_writers" @click="add_to_suggested_writers(writer)">
                                <i class="fa-solid fa-x text-sm"></i> {{ writer.first_name }} {{ writer.last_name }}
                            </li>
                        </ul>

                        <p class="text-xl my-2">Add new Writer:</p>
                        <div>
                            <input class="border rounded px-2 py-1 text-black my-2" placeholder="Search Writer" type="text" v-model="s_writer">
                            <i class="fa-solid fa-search bg-yellow-600 p-3 cursor-pointer -ml-8" @click="searchWriter"></i>
                        </div>
                        <ul v-if="suggested_writers" class="flex flex-wrap gap-2">
                            <li class="bg-yellow-600 px-2 py-1 rounded cursor-pointer" v-for="writer in suggested_writers" @click="add_to_selected_writers(writer)">
                                <i class="fa-solid fa-plus text-sm"></i> {{ writer.first_name }} {{ writer.last_name }}
                            </li>
                            <li class="bg-red-600 px-2 py-1 rounded cursor-pointer" @click="isNewWriterOpen = true">
                                <i class="fa-solid fa-plus"></i> Add new Writer
                            </li>
                        </ul>

                        <p class="text-xl my-2">Main Actor:</p>
                        <ul v-if="selected_actors" class="flex flex-wrap gap-2">
                            <li class="bg-yellow-600 px-2 py-1 rounded cursor-pointer" v-for="actor in selected_actors" @click="add_to_suggested_actors(actor)">
                                <i class="fa-solid fa-x text-sm"></i> {{ actor.first_name }} {{ actor.last_name }}
                            </li>
                        </ul>

                        <p class="text-xl my-2">Add main Actor:</p>
                        <div>
                            <input class="border rounded px-2 py-1 text-black my-2" placeholder="Search Actor" type="text" v-model="s_actor">
                            <i class="fa-solid fa-search bg-yellow-600 p-3 cursor-pointer -ml-8" @click="searchActor"></i>
                        </div>
                        <ul v-if="suggested_actors" class="flex flex-wrap gap-2">
                            <li class="bg-yellow-600 px-2 py-1 rounded cursor-pointer" v-for="actor in suggested_actors" @click="add_to_selected_actors(actor)">
                                <i class="fa-solid fa-plus text-sm"></i> {{ actor.first_name }} {{ actor.last_name }}
                            </li>
                            <li class="bg-red-600 px-2 py-1 rounded cursor-pointer" @click="isNewActorOpen = true">
                                <i class="fa-solid fa-plus"></i> Add new Actor
                            </li>
                        </ul>
                        
                        <button class="w-full bg-white text-green-600 font-bold text-xl rounded-md mt-5 p-2">Submit</button>
                    </form>
                </div>
            </div>
        </Teleport>

        <!-- New Genre -->
        <Teleport to="body">
            <div v-if="isNewGenreOpen" class="fixed overflow-scroll top-0 text-white bg-black w-full h-full p-10 z-20">
                <div class="flex justify-end cursor-pointer" @click="isNewGenreOpen = false">
                    <i class="fa-solid fa-x"></i>
                </div>
                <form @submit="submitGenre" class="flex flex-col items-center mt-[20%]">
                    <label class="text-xl my-2" for="new_genre">New Genre:</label>
                    <input class="border rounded px-2 py-1 ml-5 text-black block" type="text" id="new_genre" v-model="newGenreName">
                    
                    <button class="bg-white text-green-600 font-bold text-xl rounded-md mt-5 p-2">Submit</button>
                </form>
            </div>
        </Teleport>

        <!-- New Director -->
        <Teleport to="body">
            <div v-if="isNewDirectorOpen" class="fixed overflow-scroll top-0 text-white bg-black w-full h-full p-10 z-20">
                <div class="flex justify-end cursor-pointer" @click="isNewDirectorOpen = false">
                    <i class="fa-solid fa-x"></i>
                </div>
                <form @submit="submitDirector" class="flex flex-col items-center mt-[20%]">
                    <label class="text-xl my-2" for="first_name">First Name:</label>
                    <input class="border rounded px-2 py-1 ml-5 text-black block" type="text" id="first_name" v-model="newDirectorName.first_name">

                    <label class="text-xl my-2" for="last_name">Last Name:</label>
                    <input class="border rounded px-2 py-1 ml-5 text-black block" type="text" id="last_name" v-model="newDirectorName.last_name">
                    
                    <button class="bg-white text-green-600 font-bold text-xl rounded-md mt-5 p-2">Submit</button>
                </form>
            </div>
        </Teleport>

        <!-- New Writer -->
        <Teleport to="body">
            <div v-if="isNewWriterOpen" class="fixed overflow-scroll top-0 text-white bg-black w-full h-full p-10 z-20">
                <div class="flex justify-end cursor-pointer" @click="isNewWriterOpen = false">
                    <i class="fa-solid fa-x"></i>
                </div>
                <form @submit="submitWriter" class="flex flex-col items-center mt-[20%]">
                    <label class="text-xl my-2" for="first_name">First Name:</label>
                    <input class="border rounded px-2 py-1 ml-5 text-black block" type="text" id="first_name" v-model="newWriterName.first_name">

                    <label class="text-xl my-2" for="last_name">Last Name:</label>
                    <input class="border rounded px-2 py-1 ml-5 text-black block" type="text" id="last_name" v-model="newWriterName.last_name">
                    
                    <button class="bg-white text-green-600 font-bold text-xl rounded-md mt-5 p-2">Submit</button>
                </form>
            </div>
        </Teleport>

        <!-- New Actor -->
        <Teleport to="body">
            <div v-if="isNewActorOpen" class="fixed overflow-scroll top-0 text-white bg-black w-full h-full p-10 z-20">
                <div class="flex justify-end cursor-pointer" @click="isNewActorOpen = false">
                    <i class="fa-solid fa-x"></i>
                </div>
                <form @submit="submitActor" class="flex flex-col items-center mt-[20%]">
                    <label class="text-xl my-2" for="new_actor">First Name:</label>
                    <input class="border rounded px-2 py-1 ml-5 text-black block" type="text" id="new_actor" v-model="newActorName.first_name">

                    <label class="text-xl my-2" for="new_actor">Last Name:</label>
                    <input class="border rounded px-2 py-1 ml-5 text-black block" type="text" id="new_actor" v-model="newActorName.last_name">
                    
                    <button class="bg-white text-green-600 font-bold text-xl rounded-md mt-5 p-2">Submit</button>
                </form>
            </div>
        </Teleport>
    </section>
</template>
