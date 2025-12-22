# Website Performance Audit - Apogee Dev LLC

**Audited:** December 16, 2025
**Site:** https://www.apogeedevllc.com/
**Prepared for:** Rob Lynch

---

## Quick Summary

Good news and bad news, Rob.

**The Good News:**
Your site is technically solid. SEO, accessibility, and best practices all score **100/100**. Whoever built this knew what they were doing from a code quality standpoint.

**The Bad News:**
Your site is **loading way too slowly**, and that's costing you business.

---

## Overall Scores

| Category | Score | Status |
|----------|-------|--------|
| **Performance** | **57/100** | Needs immediate attention |
| SEO | 100/100 | Perfect |
| Accessibility | 100/100 | Perfect |
| Best Practices | 100/100 | Perfect |

---

## The Problem

**Good news first:** On desktop with a fast connection, your site loads in **1.2 seconds** and scores **95/100**. That's excellent.

**The issue:** Mobile users on slower connections (4G) experience a **9.7 second** load time with a **57/100** performance score.

Here's why that matters:
- **60% of web traffic is mobile** - more than half your visitors are on phones
- **53% of mobile visitors leave** if a page takes longer than 3 seconds
- Google's ideal target is **2.5 seconds or less**
- You're currently **4x slower** for mobile users than you should be

Think of it this way: If 100 mobile users click your link on a typical 4G connection, about half are gone before they ever see what Apogee does. Desktop users? They're fine.

### Performance Breakdown

| Metric | Desktop | Mobile (4G) | Target |
|--------|---------|-------------|--------|
| **Overall Score** | 95/100 ✅ | 57/100 ❌ | 90+ |
| **Load Time (LCP)** | 1.2s ✅ | 9.7s ❌ | <2.5s |
| **First Paint (FCP)** | 1.0s ✅ | 7.3s ❌ | <1.8s |
| **Speed Index** | 1.3s ✅ | 7.4s ❌ | <3.4s |

---

## What's Causing the Slowdown (Mobile)

| Issue | Time Lost | Impact |
|-------|-----------|--------|
| **Render-blocking resources** | 1.85 seconds | Files loading in the wrong order |
| **Unused JavaScript** | 1.5 seconds | Loading code you're not using (344 KB) |
| **Unused CSS** | 0.85 seconds | Loading styles you're not using (154 KB) |
| **Font loading** | 0.15 seconds | Fonts not optimized |

**Total recoverable time: ~4.35 seconds**

That would bring your load time from **9.7 seconds → ~5.4 seconds**. Still not perfect, but a massive improvement.

---

## The Quick Wins (2-4 Hours of Work)

These are fixes that have the biggest impact for the least effort:

### 1. Fix Render-Blocking Resources (Saves 1.85s)
**What it means:** Your CSS and JavaScript files are blocking the page from displaying.
**The fix:** Load critical resources inline, defer non-critical ones.
**Impact:** Page content appears almost 2 seconds faster.

### 2. Remove Unused JavaScript (Saves 1.5s)
**What it means:** You're loading 344 KB of JavaScript code that never gets executed.
**The fix:** Code-split and only load what each page actually needs.
**Impact:** Faster downloads, less processing time.

### 3. Remove Unused CSS (Saves 0.85s)
**What it means:** 154 KB of CSS styles that aren't being used on this page.
**The fix:** Split CSS by page or use critical CSS extraction.
**Impact:** Smaller files = faster loading.

### 4. Optimize Font Loading (Saves 0.15s)
**What it means:** Fonts aren't configured for optimal loading.
**The fix:** Add `font-display: swap` to prevent invisible text.
**Impact:** Text appears immediately, then swaps to custom font.

---

## What This Means for Your Business

Let's say you get **1,000 visitors per month** to your site, and **60% are on mobile** (industry average):

**Current state:**
- 600 mobile visitors
- ~318 leave before seeing your content (53% mobile bounce rate)
- 400 desktop visitors stay and convert normally

**After mobile fixes:**
- Mobile bounce rate drops to ~25-30% (industry average)
- ~150-180 mobile visitors leave instead of 318
- That's **138-168 extra mobile visitors** actually seeing your services each month

If even **10% of those convert** to leads, that's **14-17 extra opportunities per month** from mobile users you're currently losing.

---

## My Recommendation

Let me fix the low-hanging fruit first:

**Phase 1: Quick wins (2-4 hours)**
- Fix render-blocking resources
- Remove unused code
- Optimize font loading

**Expected result:** Load time drops from 9.7s → 5.4s
**Cost to you:** Minimal time investment for immediate ROI

Then we can assess if further optimization is needed (image optimization, CDN setup, etc.).

---

## Next Steps

If you want me to tackle this, I can:
1. Start with Phase 1 fixes (2-4 hours)
2. Re-run the audit to measure improvement
3. Show you the before/after metrics
4. Provide recommendations for Phase 2 if needed

The good news: Your site is well-built. The fixes are technical, not architectural. This is exactly the kind of problem I specialize in solving.

Let me know if you want to move forward.

---

**Full Technical Report:**
- HTML Report: `/tools/seo-audit/reports/apogee-audit.report.html`
- JSON Data: `/tools/seo-audit/reports/apogee-audit.report.json`

**Audit Tool:** Google Lighthouse 12.8.2
