import axios from "axios";
import { createStore } from "vuex";

const store = createStore({
    state: {
        movies: [],
        now_showing_movies: [],
        now_showing_movies: [],
        topRatedMovies: [],
        latestMovies: [],
        searchMovies: [],
        singleMovie: null,
        genres: [],
        directors: [],
        writers: [],
        actors: [],

        // authentication
        token: null,
        isAuthenticated: false,
        isAdmin: false
    },
    getters: {
        getMovies: state => {
            return state.movies
        },
        getNowShowingMovies: state => {
            return state.now_showing_movies
        },
        getTopRatedMovies: state => {
            return state.topRatedMovies
        },
        getLatestMovies: state => {
            return state.latestMovies
        },
        getSearchMovies: state => {
            return state.searchMovies
        },
        getSingleMovie: state => {
            return state.singleMovie
        },
        getGenres: state => {
            return state.genres
        },
        getDirectors: state => {
            return state.directors
        },
        getWriters: state => {
            return state.writers
        },
        getActors: state => {
            return state.actors
        },
        getToken: state => {
            const token = localStorage.getItem('token')
            if (token) {
                state.token = token
                state.isAuthenticated = true
                return state.token
            } else {
                state.token = null
                state.isAuthenticated = false
                return state.token
            }
        }
    },
    mutations: {
        setMovies: (state, payload) => {
            const {movies} = payload
            state.movies = movies
        },
        setNowShowingMovies: (state, payload) => {
            const {movies} = payload
            state.now_showing_movies = movies
        },
        setLatestMovies: (state, payload) => {
            const {movies} = payload
            state.latestMovies = movies
        },
        setTopRatedMovies: (state, payload) => {
            const {movies} = payload
            state.topRatedMovies = movies
        },
        setSearchMovies: (state, payload) => {
            const {movies} = payload
            state.searchMovies = movies
        },
        setSingleMovie: (state, payload) => {
            const {movie} = payload
            state.singleMovie = movie
        },
        setGenres: (state, payload) => {
            const {genres} = payload
            state.genres = genres
        },
        setDirectors: (state, payload) => {
            const {directors} = payload
            state.directors = directors
        },
        setWriters: (state, payload) => {
            const {writers} = payload
            state.writers = writers
        },
        setActors: (state, payload) => {
            const {actors} = payload
            state.actors = actors
        },
        setToken: (state, payload) => {
            const {token} = payload
            localStorage.setItem('token', token)
            state.token = localStorage.getItem('token')
            state.isAuthenticated = true
        },
        removeToken: state => {
            localStorage.removeItem('token')
            state.token = null
            state.isAuthenticated = false
        },
        setUser: async (state) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '127.0.0.1',
                    'Access-Control-Allow-Credentials': true,
                    'Authorization': `Token ${store.getters.getToken}`
                }
            }

            await axios.get('http://127.0.0.1:8000/api/userinfo/', config)
                .then(res => {
                    state.isAdmin = res.data.is_staff
                })

        }
    },
    actions: {
        getMoviesFromStore: ({commit}, url='http://127.0.0.1:8000/api/movielist/') => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '127.0.0.1',
                    'Access-Control-Allow-Credentials': true,
                    'Authorization': `Token ${store.getters.getToken}`
                }
            }

            axios.get(url, config)
                .then(res => {
                    commit({
                        type: 'setMovies',
                        movies: res.data
                    })
                })
        },
        getNowShowingMoviesFromStore: ({commit}, url='http://127.0.0.1:8000/api/movielist/?now-showing=true') => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '127.0.0.1',
                    'Access-Control-Allow-Credentials': true,
                    'Authorization': `Token ${store.state.token}`
                }
            }

            axios.get(url, config)
            .then(res => {
                commit({
                    type: 'setNowShowingMovies',
                    movies: res.data
                })
            })
        },
        getLatestMoviesFromStore: ({commit}, url='http://127.0.0.1:8000/api/movielist/?latest-movies=true') => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '127.0.0.1',
                    'Access-Control-Allow-Credentials': true,
                    'Authorization': `Token ${store.state.token}`
                }
            }

            axios.get(url, config)
            .then(res => {
                commit({
                    type: 'setLatestMovies',
                    movies: res.data
                })
            })
        },
        getTopRatedMoviesFromStore: ({commit}, url='http://127.0.0.1:8000/api/movielist/?top-rated=true') => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '127.0.0.1',
                    'Access-Control-Allow-Credentials': true,
                    'Authorization': `Token ${store.getters.getToken}`
                }
            }

            axios.get(url, config)
            .then(res => {
                commit({
                    type: 'setTopRatedMovies',
                    movies: res.data
                })
            })
        },
        getSearchMoviesFromStore: ({commit}, search) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '127.0.0.1',
                    'Access-Control-Allow-Credentials': true,
                    'Authorization': `Token ${store.state.token}`
                }
            }

            axios.get(`http://127.0.0.1:8000/api/movielist/?s=${search}`, config)
            .then(res => {
                commit({
                    type: 'setSearchMovies',
                    movies: res.data.results
                })
            })
        },
        getSingleMovieFromStore: ({commit}, id) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '127.0.0.1',
                    'Access-Control-Allow-Credentials': true,
                    'Authorization': `Token ${store.state.token}`
                }
            }

            axios.get(`http://127.0.0.1:8000/api/movie/${id}`, config)
            .then(res => {
                commit({
                    type: 'setSingleMovie',
                    movie: res.data
                })
            })
        },
        getGenresFromStore: ({commit}) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '127.0.0.1',
                    'Access-Control-Allow-Credentials': true,
                    'Authorization': `Token ${store.state.token}`
                }
            }

            axios.get('http://127.0.0.1:8000/api/genrelist/', config)
                .then(res => {
                    commit({
                        type: 'setGenres',
                        genres: res.data
                    })
                })
        },
        getDirectorsFromStore: ({commit}) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '127.0.0.1',
                    'Access-Control-Allow-Credentials': true,
                    'Authorization': `Token ${store.state.token}`
                }
            }

            axios.get('http://127.0.0.1:8000/api/directorlist/', config)
                .then(res => {
                    commit({
                        type: 'setDirectors',
                        directors: res.data
                    })
                })
        },
        getWritersFromStore: ({commit}) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '127.0.0.1',
                    'Access-Control-Allow-Credentials': true,
                    'Authorization': `Token ${store.state.token}`
                }
            }

            axios.get('http://127.0.0.1:8000/api/writerlist/', config)
                .then(res => {
                    commit({
                        type: 'setWriters',
                        writers: res.data
                    })
                })
        },
        getActorsFromStore: ({commit}) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '127.0.0.1',
                    'Access-Control-Allow-Credentials': true,
                    'Authorization': `Token ${store.state.token}`
                }
            }

            axios.get('http://127.0.0.1:8000/api/actorlist/', config)
                .then(res => {
                    commit({
                        type: 'setActors',
                        actors: res.data
                    })
                })
        },
        deleteMovie: (context, title) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '127.0.0.1',
                    'Access-Control-Allow-Credentials': true,
                    'Authorization': `Token ${store.state.token}`
                }
            }

            axios.delete(`http://127.0.0.1:8000/api/movie/${title}`, config)
                .then(res => {
                    context.dispatch('getMoviesFromStore')
                })
        },
        createMovie: (context, newMovie) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '127.0.0.1',
                    'Access-Control-Allow-Credentials': true,
                    'Authorization': `Token ${store.state.token}`
                }
            }

            axios.post('http://127.0.0.1:8000/api/create-movie/', newMovie, config)
                .then(res => {
                    context.dispatch('getMoviesFromStore')
                })
        },
        editMovie: (context, editedMovie) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '127.0.0.1',
                    'Access-Control-Allow-Credentials': true,
                    'Authorization': `Token ${store.getters.getToken}`
                }
            }
            
            axios.patch(`http://127.0.0.1:8000/api/movie/edit/${editedMovie.id}`, editedMovie, config)
            .then(res => {
                context.dispatch('getMoviesFromStore')
            })
        },
        login: async ({commit}, credentials) => {
            await axios.post('http://127.0.0.1:8000/api/token/login/', credentials)
                .then(res => {
                    commit({
                        type: 'setToken',
                        token: res.data.auth_token
                    })

                    commit('setUser')
                })
        },
        signup: async ({commit}, credentials) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '127.0.0.1',
                    'Access-Control-Allow-Credentials': true
                }
            }

            await axios.post('http://127.0.0.1:8000/api/user/create/', credentials, config)
                .then(res => {
                    commit({
                        type: 'setToken',
                        token: res.data.token
                    })

                    commit('setUser')
                })
        },
        logout: async ({commit}, token) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '127.0.0.1',
                    'Access-Control-Allow-Credentials': true,
                    'Authorization': `Token ${token}`
                }
            }

            const data = {
                Token: token
            }

            await axios.post('http://127.0.0.1:8000/api/token/logout/', data, config)
                .then(res => {
                    commit('removeToken')
                })
                .catch(err => {
                    console.log(err.response.data)
                })
        },
        addNewGenre: (context, new_genre) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '127.0.0.1',
                    'Access-Control-Allow-Credentials': true,
                    'Authorization': `Token ${store.state.token}`
                }
            }

            axios.post('http://127.0.0.1:8000/api/genre/create/', {
                name: new_genre
            }, config)
                .then(res => {
                    location.reload()
                })
                .catch(err => {
                    console.log(err.response.data)
                })
        },
        addNewDirector: (context, new_director) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '127.0.0.1',
                    'Access-Control-Allow-Credentials': true,
                    'Authorization': `Token ${store.state.token}`
                }
            }

            axios.post('http://127.0.0.1:8000/api/director/create/', new_director, config)
                .then(res => {
                    location.reload()
                })
                .catch(err => {
                    console.log(err.response.data)
                })
        },
        addNewWriter: (context, new_writer) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '127.0.0.1',
                    'Access-Control-Allow-Credentials': true,
                    'Authorization': `Token ${store.state.token}`
                }
            }

            axios.post('http://127.0.0.1:8000/api/writer/create/', new_writer, config)
                .then(res => {
                    location.reload()
                })
                .catch(err => {
                    console.log(err.response.data)
                })
        },
        addNewActor: (context, new_actor) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '127.0.0.1',
                    'Access-Control-Allow-Credentials': true,
                    'Authorization': `Token ${store.state.token}`
                }
            }

            axios.post('http://127.0.0.1:8000/api/actor/create/', new_actor, config)
                .then(res => {
                    location.reload()
                })
                .catch(err => {
                    console.log(err.response.data)
                })
        },
    },
    modules: {}
})

export default store