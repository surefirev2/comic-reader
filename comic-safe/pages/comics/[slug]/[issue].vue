<template>
  <div class="container" style="max-width:900px;margin:2rem auto;">
    <h1>Comic Pages: {{ slug }} / {{ issue }}</h1>
    <div v-if="pending">Loading pages...</div>
    <div v-else-if="error">Failed to load pages: {{ error.message }}</div>
    <div v-else>
      <div v-if="images.length === 0">No pages found.</div>
      <div v-else class="pages">
        <div style="display:flex;align-items:center;justify-content:center;margin-bottom:1rem;gap:1rem;">
          <button @click="prevPage" :disabled="currentIndex === 0">Previous</button>
          <span>Page {{ currentIndex + 1 }} / {{ images.length }}</span>
          <button @click="nextPage" :disabled="currentIndex === images.length - 1">Next</button>
        </div>
        <img :src="images[currentIndex]" :alt="`Comic Page ${currentIndex+1}`" style="width:100%;margin-bottom:1.5rem;box-shadow:0 2px 8px #0002;" loading="lazy" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const slug = route.params.slug
const issue = route.params.issue

const { data: images, pending, error } = await useAsyncData(
  `pages-${slug}-${issue}`,
  async () => {
    const res = await $fetch(`/api/comics/${slug}/${issue}`)
    return res.imageUrls || []
  }
)

const currentIndex = ref(0)

function prevPage() {
  if (currentIndex.value > 0) currentIndex.value--
}
function nextPage() {
  if (images.value && currentIndex.value < images.value.length - 1) currentIndex.value++
}
</script>

<style>
.container { font-family: sans-serif; }
.pages img { border-radius: 6px; }
button[disabled] { opacity: 0.5; cursor: not-allowed; }
</style>
