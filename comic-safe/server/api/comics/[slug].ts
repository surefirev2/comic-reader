import { defineEventHandler, getRouterParam } from 'h3'
import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    return { error: 'Missing slug' }
  }
  const url = `https://readcomiconline.li/Comic/${slug}`
  const res = await fetch(url)
  if (!res.ok) {
    return { error: `Failed to fetch comic page: ${res.status}` }
  }
  const html = await res.text()
  const $ = cheerio.load(html)
  const issues: { title: string, url: string, date: string }[] = []

  $('ul.list > li').each((_, el) => {
    const a = $(el).find('.col-1 a')
    const title = a.text().trim()
    const url = a.attr('href')
    const date = $(el).find('.col-2 span').text().trim()
    if (title && url) {
      issues.push({ title, url, date })
    }
  })

  return issues
})
