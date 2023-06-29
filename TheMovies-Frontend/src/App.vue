<script setup>
  import { RouterView } from 'vue-router'
  import Footer from './components/footer/Footer.vue';
  import Navbar from './components/navbar/Navbar.vue';

</script>

<template>
  <div class="bg-black text-white">
    <Navbar />
    <RouterView />
    <Footer />
  </div>
</template>
