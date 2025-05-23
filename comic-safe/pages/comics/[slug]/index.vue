<template>
  <div class="container" style="max-width:600px;margin:2rem auto;">
    <h1>Comic Issues for: {{ slug }}</h1>
    <div v-if="pending">Loading issues...</div>
    <div v-else-if="error">Failed to load issues: {{ error.message }}</div>
    <ul v-else>
      <li v-for="issue in issues" :key="issue.url">
        <NuxtLink :to="toLocalIssue(issue.url)">{{ issue.title }}</NuxtLink>
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
  () => $fetch(`/api/comics/${slug}`)
)

function toLocalIssue(url) {
  // Example: /Comic/Injustice-2/Annual-1?id=125858
  const match = url.match(/\/Comic\/([^/]+)\/([^?]+)(\?id=\d+)?/)
  if (match) {
    const slug = match[1]
    const issue = match[2]
    const id = match[3] || ''
    return `/comics/${slug}/${issue}${id}`
  }
  return url // fallback
}
</script>

<style>
.container { font-family: sans-serif; }
</style>
