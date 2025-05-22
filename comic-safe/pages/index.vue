<template>
  <div class="container" style="max-width:600px;margin:2rem auto;">
    <h1>ComicSafe MVP Search</h1>
    <form @submit.prevent="search">
      <input v-model="query" placeholder="Search for a comic..." style="width:70%;padding:0.5rem;" />
      <button :disabled="loading" style="padding:0.5rem 1rem;">Search</button>
    </form>
    <div v-if="loading" style="margin-top:1rem;">Loading...</div>
    <div v-if="error" style="color:red;margin-top:1rem;">{{ error }}</div>
    <div v-if="results.length" style="margin-top:2rem;">
      <h2>Results</h2>
      <ul>
        <li v-for="comic in results" :key="comic.url">
          <NuxtLink :to="toLocalComic(comic.url)">{{ comic.title }}</NuxtLink> <span v-if="comic.issue">({{ comic.issue }})</span>
        </li>
      </ul>
    </div>
    <div v-else-if="!loading && searched">No results found.</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const query = ref('')
const loading = ref(false)
const error = ref('')
const results = ref([])
const searched = ref(false)

function toLocalComic(url) {
  const match = url.match(/\/Comic\/([^/]+)/)
  return match ? `/comics/${match[1]}` : '/comics/unknown'
}

async function search() {
  loading.value = true
  error.value = ''
  results.value = []
  searched.value = false
  try {
    const res = await fetch(`/api/search?keyword=${encodeURIComponent(query.value)}`)
    const { html, error: apiError } = await res.json()
    if (apiError) throw new Error(apiError)
    results.value = parseResults(html)
    searched.value = true
  } catch (e) {
    error.value = 'Search failed.'
  } finally {
    loading.value = false
  }
}

function parseResults(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const items = doc.querySelectorAll('.item-list .section.group.list')
  const comics = []
  items.forEach(item => {
    const link = item.querySelector('.col.info a')
    const title = link?.textContent?.trim() || ''
    const url = link?.getAttribute('href')
    const issue = item.querySelector('.col.info p:nth-child(2)')?.textContent?.trim() || ''
    if (title && url) {
      comics.push({ title, url: 'https://readcomiconline.li' + url, issue })
    }
  })
  return comics
}
</script>

<style>
body { background: #f8fafc; }
.container { font-family: sans-serif; }
input, button { font-size: 1rem; }
</style>
