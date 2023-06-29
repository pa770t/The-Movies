<script setup>
    import { reactive, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex';

    const store = useStore()

    const credentials = reactive({
        username: '',
        email: '',
        password: '',
    })

    const router = useRouter()

    const errors = ref([])

    const submitForm = async () => {
        await store.dispatch('signup', credentials)
        router.push({name: 'home'})
    }

</script>

<template>
    <section class="mt-2 container flex flex-col items-center">
        <p class="text-4xl">Sign Up</p>
        <form @submit.prevent="submitForm" class="mt-7 flex flex-col">
            <label class="text-xl" for="username">Username</label>
            <input class="h-8 mt-3 text-black px-3 py-2 rounded-md" type="text" id="username" v-model="credentials.username">

            <label class="text-xl mt-5" for="email">Email</label>
            <input class="h-8 mt-3 text-black px-3 py-2 rounded-md" type="email" id="email" v-model="credentials.email">

            <label class="text-xl mt-5" for="password">Password</label>
            <input class="h-8 mt-3 text-black px-3 py-2 rounded-md" type="password" id="password" v-model="credentials.password">

            <button class="bg-yellow-600 mt-5 self-start text-white px-3 py-2 rounded">Sign Up</button>

            <p class="mt-5">Already have an account? <RouterLink class="text-blue-400" :to="{name: 'login'}">click here</RouterLink> to log in!</p>
        </form>
    </section>
</template>
