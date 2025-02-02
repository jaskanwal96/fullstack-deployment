<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const msg = ref('Welcome to Jaskanwal\'s Vue 3 Project')
const apiUrl = import.meta.env.VITE_API_URL

const fetchMessage = async () => {
  try {
    const response = await axios.get(`${apiUrl}/ssr/`)
    msg.value = response.data.message
  } catch (error) {
    console.error('Error fetching message:', error)
  }
}
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="fetchMessage">Fetch Message</button>
  </div>

</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
