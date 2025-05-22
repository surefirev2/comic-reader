import { defineEventHandler, getRouterParam } from 'h3'
import puppeteer from 'puppeteer'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const issue = getRouterParam(event, 'issue')
  const id = event.node.req.url?.split('?id=')[1]?.split('&')[0]

  if (!slug || !issue) {
    return { error: 'Missing slug or issue' }
  }

  let issueId = id
  if (!issueId && issue.includes('?id=')) {
    issueId = issue.split('?id=')[1].split('&')[0]
  }

  const url = `https://readcomiconline.li/Comic/${slug}/${issue}${issueId ? `?id=${issueId}&readType=1` : '?readType=1'}`

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: 'new'
  })
  try {
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

    // Scroll to the bottom of the page
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight)
      await new Promise(resolve => setTimeout(resolve, 2000))
    })

    // Take a screenshot for debugging
    const screenshot = await page.screenshot({ encoding: 'base64', fullPage: true })

    // Dump the HTML
    const html = await page.content()
    const htmlSample = html.slice(0, 2000)

    // Parse all <img> tags in the DOM and filter for comic pages
    const imageUrls = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .map(img => img.src)
        .filter(src => src.includes('2.bp.blogspot.com'))
    })

    return { url, imageUrls, count: imageUrls.length, htmlSample, screenshot }
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err), url }
  } finally {
    await browser.close()
  }
})
