import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const { keyword } = getQuery(event)
  if (!keyword) return { error: 'Missing keyword' }

  const res = await fetch('https://readcomiconline.li/Search/Comic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `keyword=${encodeURIComponent(keyword as string)}`
  })
  const html = await res.text()
  return { html }
})
