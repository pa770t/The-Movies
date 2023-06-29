<script setup>
    import AdminDashboard from '../components/admindashboard/AdminDashboard.vue';
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex';
    import { computed, onMounted } from 'vue';

    const router = useRouter()
    const store = useStore()
    
    const token = computed(() => store.getters.getToken)
    const isAuthenticated = computed(() => store.state.isAuthenticated)
    const isAdmin = computed(() => store.state.isAdmin)

    onMounted(() => {
        if (!isAuthenticated.value && !token.value) {
            router.push({name: 'login'})
        }

        if (!isAdmin.value) {
            router.push({name: 'home'})
        }
        
    })

</script>

<template>
    <AdminDashboard></AdminDashboard>
</template>
