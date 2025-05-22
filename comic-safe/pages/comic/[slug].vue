<template>
  <div class="container" style="max-width:600px;margin:2rem auto;">
    <h1>Comic Issues for: {{ slug }}</h1>
    <div v-if="pending">Loading issues...</div>
    <div v-else-if="error">Failed to load issues: {{ error.message }}</div>
    <ul v-else>
      <li v-for="issue in issues" :key="issue.url">
        <a :href="issue.url" target="_blank">{{ issue.title }}</a>
        <span style="color: #888; margin-left: 1em;">{{ issue.date }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const slug = route.params.slug

const { data: issues, pending, error } = await useAsyncData(
  `issues-${slug}`,
  () => $fetch(`/api/issues/${slug}`)
)
</script>

<style>
.container { font-family: sans-serif; }
</style>
