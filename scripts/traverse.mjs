/**
 * Walker Book Works — Playwright traversal script
 * Tests desktop (1440px) and mobile (390px) viewports
 * Screenshots every chapter, checks for console errors + layout issues
 * Writes results to TRAVERSE_REPORT.md
 */

import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const SCREENSHOTS_DIR = path.join(ROOT, 'traverse-screenshots')
const BASE_URL = 'http://localhost:3000'

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900, isMobile: false },
  { name: 'mobile-390', width: 390, height: 844, isMobile: true },
]

const CHAPTERS = [
  { id: 'chapter-hero',      name: 'Chapter 0 — Hero' },
  { id: 'chapter-open',      name: 'Chapter 1 — Cover Open' },
  { id: 'chapter-about',     name: 'Chapter 2 — About' },
  { id: 'chapter-services',  name: 'Chapter 3 — Services' },
  { id: 'chapter-process',   name: 'Chapter 4 — Process' },
  { id: 'chapter-workshops', name: 'Chapter 5 — Workshops' },
  { id: 'chapter-contact',   name: 'Chapter 6 — Contact' },
]

const issues = []
const results = []

async function traverseViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: viewport.isMobile,
    userAgent: viewport.isMobile
      ? 'Mozilla/5.0 (Linux; Android 12; SM-A525F) AppleWebKit/537.36'
      : undefined,
  })

  const page = await context.newPage()
  const consoleErrors = []
  const jsErrors = []

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', err => jsErrors.push(err.message))

  console.log(`\n[${viewport.name}] Navigating to ${BASE_URL}...`)
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(1500)

  // Check for horizontal overflow
  const hasHorizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth
  })

  if (hasHorizontalOverflow) {
    issues.push({
      viewport: viewport.name,
      severity: 'CRITICAL',
      issue: 'Horizontal overflow detected on page load',
    })
  }

  // Screenshot each chapter
  for (const chapter of CHAPTERS) {
    const el = page.locator(`#${chapter.id}`)
    const count = await el.count()

    if (count === 0) {
      issues.push({
        viewport: viewport.name,
        severity: 'CRITICAL',
        issue: `Chapter element #${chapter.id} not found in DOM`,
      })
      continue
    }

    // Scroll to chapter
    await el.scrollIntoViewIfNeeded()
    await page.waitForTimeout(800)

    // Check visibility
    const isVisible = await el.isVisible()
    if (!isVisible) {
      issues.push({
        viewport: viewport.name,
        severity: 'WARNING',
        issue: `${chapter.name} not visible after scroll`,
      })
    }

    // Check for overflow at this scroll position
    const overflowAtChapter = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    if (overflowAtChapter) {
      issues.push({
        viewport: viewport.name,
        severity: 'CRITICAL',
        issue: `Horizontal overflow at ${chapter.name}`,
      })
    }

    // Screenshot
    const screenshotPath = path.join(
      SCREENSHOTS_DIR,
      `${viewport.name}--${chapter.id}.png`
    )
    await page.screenshot({ path: screenshotPath, fullPage: false })
    console.log(`  ✓ Screenshot: ${path.basename(screenshotPath)}`)

    results.push({
      viewport: viewport.name,
      chapter: chapter.name,
      visible: isVisible,
      screenshot: path.relative(ROOT, screenshotPath),
    })
  }

  // Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(1000)

  // Final check — console errors
  if (consoleErrors.length > 0) {
    consoleErrors.forEach(err => {
      issues.push({
        viewport: viewport.name,
        severity: 'WARNING',
        issue: `Console error: ${err.slice(0, 200)}`,
      })
    })
  }

  if (jsErrors.length > 0) {
    jsErrors.forEach(err => {
      issues.push({
        viewport: viewport.name,
        severity: 'CRITICAL',
        issue: `JS error: ${err.slice(0, 200)}`,
      })
    })
  }

  await context.close()
  return { consoleErrors, jsErrors }
}

async function main() {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })

  const browser = await chromium.launch({ headless: true })

  console.log('Walker Book Works — Playwright Traversal\n')
  console.log('=========================================')

  for (const viewport of VIEWPORTS) {
    await traverseViewport(browser, viewport)
  }

  await browser.close()

  // Write report
  const criticals = issues.filter(i => i.severity === 'CRITICAL')
  const warnings = issues.filter(i => i.severity === 'WARNING')

  const reportLines = [
    '# TRAVERSE_REPORT.md — Walker Book Works',
    `# Generated: ${new Date().toISOString()}`,
    '',
    '## Summary',
    `- Total issues: ${issues.length}`,
    `- Critical: ${criticals.length}`,
    `- Warnings: ${warnings.length}`,
    '',
    `**Status: ${criticals.length === 0 ? '✅ PASS — Zero critical issues' : '❌ FAIL — Critical issues found'}**`,
    '',
    '## Results by Chapter',
    '',
  ]

  for (const r of results) {
    reportLines.push(`- [${r.visible ? '✅' : '❌'}] **${r.viewport}** · ${r.chapter} — Screenshot: \`${r.screenshot}\``)
  }

  if (issues.length > 0) {
    reportLines.push('', '## Issues Found', '')
    for (const issue of issues) {
      reportLines.push(`- **[${issue.severity}]** [${issue.viewport}] ${issue.issue}`)
    }
  } else {
    reportLines.push('', '## Issues Found', '', '*None — traversal completed with zero issues.*')
  }

  const report = reportLines.join('\n')
  fs.writeFileSync(path.join(ROOT, 'TRAVERSE_REPORT.md'), report)

  console.log('\n=========================================')
  console.log(`Traversal complete.`)
  console.log(`Critical issues: ${criticals.length}`)
  console.log(`Warnings: ${warnings.length}`)
  console.log('Report written to TRAVERSE_REPORT.md')

  if (criticals.length > 0) {
    console.log('\nCRITICAL ISSUES:')
    criticals.forEach(i => console.log(`  [${i.viewport}] ${i.issue}`))
    process.exit(1)
  }

  process.exit(0)
}

main().catch(err => {
  console.error('Traversal failed:', err)
  process.exit(1)
})
