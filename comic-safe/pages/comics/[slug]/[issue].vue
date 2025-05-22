<template>
  <div class="container" style="max-width:900px;margin:2rem auto;">
    <h1>Comic Pages: {{ slug }} / {{ issue }}</h1>
    <div v-if="pending">Loading pages...</div>
    <div v-else-if="error">Failed to load pages: {{ error.message }}</div>
    <div v-else>
      <div v-if="images.length === 0">No pages found.</div>
      <div v-else class="pages">
        <img v-for="(img, i) in images" :key="img" :src="img" :alt="`Page ${i+1}`" style="width:100%;margin-bottom:1.5rem;box-shadow:0 2px 8px #0002;" loading="lazy" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const slug = route.params.slug
const issue = route.params.issue

const { data: images, pending, error } = await useAsyncData(
  `pages-${slug}-${issue}`,
  () => $fetch(`/api/comics/${slug}/${issue}`)
)
</script>

<style>
.container { font-family: sans-serif; }
.pages img { border-radius: 6px; }
</style>
