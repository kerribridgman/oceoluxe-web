# Oceo Luxe Website Rebrand — Claude Code Project Plan

## What This Job Is

This is a content rewrite of the existing Oceo Luxe website with a light visual richness pass on the existing pages. It is not a redesign, not a rebuild, and not a stack migration. The site is moving from "operational partnership studio for fashion founders" to "Studio Operational Partner for founders in any industry who need operations support." Fashion experience stays on the About page as credibility. The brand is no longer fashion-facing.

The visual layer of this job is narrow. Claude Code is adding texture, imagery placement, and type treatment inside the existing component system. Not building new components, not generating assets, not redesigning sections.

## What Stays Untouched

Do not modify, refactor, or improve any of the following.

- Tech stack: Next.js on Vercel
- Typography: Noto Serif Display, Halimum script
- Color palette: charcoal, taupe, cream, dusty rose
- Adhara CRM backend integration
- Existing component library and section types
- The entire `/blog` directory: content, structure, categories, URLs, metadata
- Page routing for non-blog pages (only swap content inside the existing routes)
- Footer, header, and navigation component structure (only the link labels and copy change)

If a page route currently exists, it continues to exist. If a component currently renders, it continues to render.

## Brand Foundation

### Positioning Line

Oceo Luxe is a Studio Operational Partner for founders building businesses they intend to keep.

### Byline (Verbatim, Non-Negotiable)

> Structure does not limit creativity, it protects it.

Appears on Home hero and About page. Do not rewrite, shorten, or rephrase.

### Brand Archetype

The Operator. Calm authority. Quietly elite. A trusted internal operator rather than an external consultant.

### Voice Rules

- American English
- Paragraph-based writing, not bullet-heavy
- Editorial, grounded, confident without being aggressive
- No em dashes
- No exclamation points
- Assume sophistication, never over-explain
- Founder-to-founder voice

### Banned Vocabulary

beginner, just starting out, tips, learn how, step-by-step, easy guide, DIY, affordable, accessible, budget-friendly, dream life, helping everyone, struggling with.

### Word Replacements

- "helping" becomes "aligning," "stabilizing," or "structuring"
- "consulting package" becomes "operational partnership"
- "coaching session" becomes "strategic alignment"
- "clients" becomes "founders" or "partners"

## Primary Audience

Founders in any industry who are growing but do not yet have operational systems in place. Industry-agnostic. Do not list industries anywhere on the site.

## Site Architecture

Existing primary navigation stays.

```
Home | Work With Oceo Luxe | Operational Partnership | Studio Systems | About | Blog | Apply
```

Blog is out of scope.

---

## PHASE 1A — Page Copy (Final, Not Direction)

This is the copy. Use it verbatim unless a layout constraint forces an adjustment, in which case flag it for review rather than rewriting.

### Home Page

**Hero**

> Operational Partnership for Founders Building Businesses They Intend to Keep
>
> Oceo Luxe is a Studio Operational Partner. We translate vision into structured execution through operational systems, decision frameworks, and the kind of behind-the-scenes clarity that lets founders stay in the work only they can do.
>
> *Structure does not limit creativity, it protects it.*

Primary CTA: Apply to Work Together
Secondary CTA: Explore the Partnership

**Section 2 — The Problem**

> ### Growth Without Structure Becomes Chaos
>
> Most founders do not have an ideas problem. They have an execution problem. The business grows faster than the systems underneath it, and the founder ends up holding every decision, every process, and every loose end. Creative work suffers. Margins narrow. The founder becomes the bottleneck of the thing they built.
>
> Oceo Luxe exists to absorb the operational layer so founders can stay in the work only they can do.

**Section 3 — The Role**

> ### Your Studio Operational Partner
>
> Oceo Luxe is not a consultancy, not a coach, and not an agency. We work alongside founders as an internal operator, embedded in the business at a strategic level. We build the systems, hold the calendar, structure the decisions, and quietly run the operational backbone of companies growing into something larger.

**Section 4 — How We Work**

> ### Three Levels of Operational Depth
>
> Every partnership begins with where the business actually is, not where the founder wishes it were. Oceo Luxe meets founders at three operational depths.

Then three tier cards, each with one paragraph from the tier pages below. Each card links to its full page.

**Section 5 — Closing CTA**

> ### Built for Founders Who Take Their Business Seriously
>
> Oceo Luxe is application-only. Every partnership begins with a conversation, and the studio is selective about who it works with because the work requires alignment on both sides.

CTA: Apply

---

### Work With Oceo Luxe

**Hero**

> ### Three Operational Depths, One Standard
>
> Oceo Luxe meets founders at three levels of operational depth. The level is matched to where the business is, not where the founder wants it to be. The standard of work is the same across all three.

**Tier overview section, three blocks:**

**Private Operational Partnership**

> An embedded operator inside the business. Long-form, ongoing, shaped to the company. For founders who need a partner running the operational backbone of a growing business.

Link to full page.

**Strategic Operational Alignment**

> A defined engagement for founders who need a focused operational reset. Bounded scope. The studio maps the business, identifies the fractures, and rebuilds the systems slowing growth.

Link to full page.

**Studio Systems**

> Hands-on operational and web build support, by the hour. Capped at five hours per week so the work stays focused and the standard stays high. The most direct way to put an operator inside the business without committing to a long-form partnership.

Link to full page.

---

### Operational Partnership

**Hero**

> ### Private Operational Partnership
>
> An embedded operator inside your business.

> Investment: $8,500 to $12,000 monthly. Application-only.

**Body section 1:**

> Private Operational Partnership is for founders who need an internal operator, not an external consultant. This is not a project, not a deliverable, and not a fixed engagement. Oceo Luxe becomes a calm, structured presence inside the company, running the operational layer the founder no longer has time to hold.

**Body section 2 — What it covers:**

> The partnership covers operational system design, vendor and team coordination, decision architecture, weekly operational rhythm, calendar and priority structure, and the strategic execution layer that translates founder vision into actual movement. The scope is shaped to the business, not pre-packaged. Some partnerships are heavy on systems design. Others are heavy on team coordination. The work is determined by what the business needs, not by what is easy to sell.

**Body section 3 — Who it is for:**

> This partnership is for founders generating revenue, with a team or contractors, who need operational structure to scale without losing the integrity of the brand. It is not for early-stage founders still finding the offer.

CTA: Apply

---

### Strategic Operational Alignment (renamed from Strategic Production Alignment)

**Hero**

> ### Strategic Operational Alignment
>
> A focused operational reset.

> Investment: $5,500 to $8,500. Flat engagement.

**Body section 1:**

> Strategic Operational Alignment is a defined engagement for founders who need an operational reset. Not a partnership, not a membership. A bounded scope of work where Oceo Luxe maps the current state of the business, identifies the operational fractures, and rebuilds the systems that are slowing growth.

**Body section 2 — What you walk away with:**

> Every engagement ends with a documented operational architecture the founder owns. The systems built during the engagement are designed to keep working without Oceo Luxe holding them. The point of the alignment is to leave the founder with structure, not dependency.

**Body section 3 — Who it is for:**

> This engagement is for founders who can identify the operational problem but do not have the time or the framework to solve it. Most often the business has grown faster than its systems, and the founder needs an operator to come in, build the structure, and leave it stable.

CTA: Apply for Strategic Alignment

---

### Studio Systems

**Hero**

> ### Studio Systems
>
> Hands-on operational and web build support, by the hour.

> Investment: $111 per hour. Maximum five hours per week.

**Body section 1:**

> Studio Systems is for founders who need a focused operator inside their business for a few hours a week. Not a partnership, not a membership. A direct working relationship measured in hours, capped at five per week so the work stays high-quality and the calendar stays sustainable on both sides.

**Body section 2 — What the hours cover:**

> The hours are split between operational support and web build support, shaped to what the business actually needs that week. One week the work might be vendor coordination, decision architecture, and weekly operational rhythm. Another week it might be mapping the structure of a website, planning a build, or laying the groundwork for the digital infrastructure the business is about to need. The point is to put real operational and technical hands on the work without committing the founder to a long-form partnership.

**Body section 3 — Where it leads:**

> Studio Systems often becomes the first step in something larger. Founders who start here frequently move into a deeper build of their digital infrastructure once the operational picture is clear and the systems underneath the business are ready to support what comes next.

**Body section 4 — Who it is for:**

> Founders who are building, growing, and ready to bring an operator into the work for a few focused hours a week. Founders who want their vision to take shape in real systems and real infrastructure, not slide decks and not theory.

CTA: Start with Studio Systems

---

### About

**Hero**

> ### Oceo Luxe Was Built to Solve the Operational Layer
>
> *Structure does not limit creativity, it protects it.*

**Body paragraph 1:**

> Oceo Luxe was founded by Kerri Bridgman. The studio exists because most businesses do not fail at the idea. They fail at the operational layer underneath it. The work is to absorb that layer so the founder can stay in the work only they can do.

**Body paragraph 2 — Background as credibility:**

> Kerri spent the early part of her career inside the production operations of brands where margin compression, supply chain fragility, and tight timelines made operational precision non-negotiable. Production management at Michael Kors. Production coordination at The Shade Store. Project engineering at Atlantic Infra. A degree in Production Management with a minor in Economics from FIT. The pattern across every role was the same: take a chaotic operational environment, build the structure underneath it, and let the creative or commercial work breathe.

**Body paragraph 3 — Philosophy:**

> The work at Oceo Luxe is the same work, applied beyond fashion. Founders in any industry hit the same operational ceiling. The systems that worked at one stage stop working at the next. Oceo Luxe is the operational partner that helps them cross that line without losing the business in the process.

CTA: Apply to Work Together

---

### Apply

**Intro copy (keep existing form):**

> Oceo Luxe is application-only. Every partnership begins with a conversation. The studio is selective about who it works with because the work requires alignment on both sides. The application below is the first step.

---

### Footer

Tagline under logo: *Structure does not limit creativity, it protects it.*

Remove any fashion-specific links. Blog links untouched.

---

## PHASE 1B — Visual Richness Pass

The current site reads flat. The work this studio produces does not. The visual layer of this rewrite closes that gap, inside the existing component system. No new components, no new section types, no generated assets.

### Visual Principles

**Editorial weight, not decoration.** Every visual choice should make the page feel like an editorial spread, not a marketing template. Think Cereal Magazine, RISD publications, the Aesop website. Quiet, considered, intentional.

**Negative space is the texture.** Cream is not empty. The most luxurious thing on the page is what is not there. Increase white space around hero elements, between sections, and around the byline.

**Type as visual element.** Noto Serif Display at scale is the strongest visual asset on the site. Use it bigger. Use Halimum script sparingly, for the byline and one or two pull-quote moments per page.

**Single accent, not many.** Dusty rose is a punctuation color, not a fill color. Use it for one element per section maximum: a divider, a small caps label, a single underline.

### Page-by-Page Visual Direction

**Home Hero**

- Headline set in Noto Serif Display at the largest scale used on the site
- Subheadline in DM Sans or whatever sans-serif is current, at a comfortable reading size
- Byline directly below in Halimum script, smaller scale, dusty rose color
- Background: cream with a subtle grain or paper texture if available in the existing asset library. If not, leave solid and let typography carry weight.
- Generous vertical padding above and below. The hero should breathe.
- One image or graphic anchor only. If no asset is available, hold the space empty rather than fill it.

**Home Section Dividers**

- Replace any hard horizontal rules with either generous whitespace or a thin dusty rose hairline divider
- Section labels (if any) in small caps, letter-spaced, taupe color

**Tier Cards on Home**

- Stack vertically rather than three-across, if the existing component allows. Vertical stacking reads more editorial.
- Each card opens with the tier name in Noto Serif Display
- One-line description in sans-serif
- A single thin divider in dusty rose between cards
- Link styled as a small-caps "Read More" with a subtle arrow

**Tier Pages (Operational Partnership, Strategic Operational Alignment, Studio Systems)**

- Hero with tier name in Noto Serif Display at large scale
- Investment line set apart in small caps, taupe color, not bolded
- Body paragraphs in a comfortable serif reading size, max-width around 65 characters
- Single pull-quote per page in Halimum script, dusty rose, pulled from the body copy

**About Page**

- Hero headline in Noto Serif Display
- Byline directly below in Halimum script, dusty rose
- Body paragraphs in a serif reading size with generous line height
- Optional: a single editorial portrait or studio image if available. If not, leave the page typographically driven.

**Work With Oceo Luxe**

- Hero in Noto Serif Display
- Three tier blocks stacked vertically, separated by dusty rose hairline dividers
- Each block: tier name large, one paragraph, link

**Footer**

- Tagline in Halimum script, dusty rose, centered
- Everything else current

### What Claude Code Should NOT Do in the Visual Pass

- Do not add stock photography
- Do not generate or insert decorative SVGs, illustrations, or icons beyond what already exists
- Do not change the color palette
- Do not introduce new fonts
- Do not animate elements unless animation already exists on the page
- Do not redesign navigation
- Do not add background images that compete with type
- Do not add CSS gradients

### Image Placeholders

For any image slot that would benefit from an asset Kerri does not yet have, leave a clean empty container with a comment in the code: `{/* IMAGE PLACEHOLDER: editorial portrait or studio image, to be added by Kerri */}`. Do not fill with stock. Do not fill with AI-generated imagery. Empty and labeled is the correct state.

---

## Pages and Redirects

If any of these routes exist, set up redirects:

- `/services` to `/work-with-oceo-luxe`
- `/book` to `/apply`
- `/strategic-production-alignment` to `/strategic-operational-alignment` (update internal links accordingly)

Check the codebase for legacy routes (quiz, products, faq, join). Redirect to `/apply` or remove from sitemap.

---

## SEO Updates

For every non-blog page, update:

- Page title tag
- Meta description (under 160 characters)
- Open Graph title and description
- H1 to match the new headlines

Title pattern: lead with page topic, end with "Oceo Luxe." Comma-separated keywords where natural.

Core keywords: founder operations, operational partnership, studio operational partner, founder operator, operational systems.

Do not touch blog metadata.

---

## Execution Order

Work this sequence. Do not jump ahead. Do not parallelize.

**Copy first:**

1. Create a feature branch off main
2. Update the byline component with the verbatim byline
3. Update Home page copy
4. Update Work With Oceo Luxe
5. Update Operational Partnership
6. Rename Strategic Production Alignment to Strategic Operational Alignment. Update routing and internal links. Then rewrite the page.
7. Update Studio Systems
8. Update About
9. Update Apply intro
10. Update footer tagline
11. Update SEO metadata across all non-blog pages
12. Add redirect rules
13. Build, verify pages render, confirm no broken links

**Visual pass next:**

14. Pull all hero sections to the visual direction above, page by page in the same order
15. Adjust section dividers and tier card layout on Home
16. Apply pull-quote treatment on tier pages
17. Add Halimum script byline placement on Home, About, and footer
18. Place image placeholders where assets are missing

**Ship:**

19. Deploy to Vercel preview
20. Hold for Kerri review
21. Merge to production on approval

---

## Out of Scope

Explicitly not part of this job:

- New page creation
- Portfolio or case study sections (separate document with Patrick)
- Blog content, blog layout, blog metadata
- Adhara CRM integration changes
- Asset generation of any kind
- Stock photography
- New components
- Color palette changes
- Typography changes
- Work on Akari, Bridgman Properties, Adhara, or NestClear

---

## Definition of Done

- Every non-blog page reflects the new positioning with the embedded copy
- Byline appears verbatim on Home, About, and footer
- No fashion-specific language outside the About credibility paragraph
- Renamed routes resolve correctly with redirects
- SEO metadata updated across non-blog pages
- Visual richness pass applied per page-by-page direction above
- Image placeholders labeled and empty where assets are missing
- Vercel preview deploys cleanly
- Kerri reviews and approves before merging to production
