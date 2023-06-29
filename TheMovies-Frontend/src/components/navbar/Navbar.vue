<script setup>
    import { computed, onMounted, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useStore } from 'vuex';

    const store = useStore()

    store.commit('setUser')
    const isAdmin = computed(() => store.state.isAdmin)
    const isAuthenticated = computed(() => store.state.isAuthenticated)
    const token = computed(() => store.getters.getToken)

    const router = useRouter()
    const route = useRoute()

    const logout = async () => {
        await store.dispatch('logout', token.value)
        router.push({name: 'login'})
    }
</script>

<template>
    <section class="p-10 flex flex-col lg:flex-row items-center justify-between gap-y-5 container">
        <RouterLink :to="{name: 'home'}" class="text-3xl">The Movie Website</RouterLink>
        <ul class="uppercase flex flex-wrap gap-3 justify-center items-center text-sm">
            <li class="text-red-500">
                <RouterLink :to="{name: 'home'}">Home</RouterLink>
            </li>
            <li>
                <RouterLink :to="{name: 'now-showing'}">In Theaters</RouterLink>
            </li>
            <li v-if="isAdmin && isAuthenticated">
                <RouterLink class="bg-yellow-600 px-2 py-1" :to="{name: 'admin-dashboard'}">
                    Dashboard
                </RouterLink>
            </li>
            <li v-if="isAuthenticated" @click="logout">
                <button class="bg-yellow-600 uppercase px-2 py-1">
                    Logout
                </button>
            </li>
        </ul>
    </section>
</template>
