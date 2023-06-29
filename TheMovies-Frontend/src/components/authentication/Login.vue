<script setup>
    import { reactive, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex'

    const store = useStore()
    const router = useRouter()
    
    const credentials = reactive({
        username: '',
        password: ''
    })

    const submitForm = async () => {
        await store.dispatch('login', credentials)
        router.push({name: 'home'})
    }

    onMounted(() => {
        if (localStorage.getItem('token')) {
            history.back(1)
        }
    })

</script>

<template>
    <section class="mt-2 container flex flex-col items-center">
        <p class="text-4xl">Login</p>
        <form @submit.prevent="submitForm" class="mt-7 flex flex-col">
            <label class="text-xl" for="username">Username</label>
            <input class="h-8 mt-3 text-black px-3 py-2 rounded-md" type="text" id="username" v-model="credentials.username">

            <label class="text-xl mt-5" for="password">Password</label>
            <input class="h-8 mt-3 text-black px-3 py-2 rounded-md" type="password" id="password" v-model="credentials.password">

            <button class="bg-yellow-600 mt-5 self-start text-white px-3 py-2 rounded">Login</button>

            <p class="mt-5">Do not have an account? <RouterLink class="text-blue-400" :to="{name: 'signup'}">click here</RouterLink> to sign up!</p>
        </form>
    </section>
</template>
