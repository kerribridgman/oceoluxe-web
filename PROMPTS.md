# OCEO LUXE - MASTER PROJECT PLAN

## POSITIONING STATEMENT

Oceo Luxe helps independent designers turn their ideas into sustainable, manufacturable products through clarity, communication, and operational structure.

---

# 20-DAY ACTIONABLE IMPLEMENTATION PLAN

## Current State (Dec 10, 2024)
- ✅ Homepage exists with general messaging
- ✅ Services page exists with 4 services
- ✅ About page exists
- ✅ Blog system functional
- ✅ Studio Systems membership infrastructure
- ✅ Quiz system in place
- ⬜ Messaging needs to reflect new niche (first-time designers + factory guidance)

---

## DAYS 1-4: Homepage Transformation

### Day 1: Hero Section Rewrite
- [x] Update hero headline: "Clarity and structure for designers who want to produce consciously — without the overwhelm"
- [x] Update hero subheadline: "I help you communicate clearly, avoid production mistakes, choose the right materials, and build systems that support your growth"
- [x] Update CTA buttons to reflect new positioning (Work With Me + Discover Your Archetype)
- [x] Hero image kept as-is (works with new messaging)

**File:** `app/page.tsx` (lines 46-99)

### Day 2: "Who I Help" Section
- [x] Create new `WhoIHelpSection` component
- [x] Add section below hero with target audience criteria:
  - New to factories and want guidance
  - Need clarity on timelines and expectations
  - Want sustainable suppliers without overwhelm
  - Feel unsure what to ask your factory
  - Want systems that support creativity
  - Care deeply about ethics and sustainability
- [x] Style to match existing brand aesthetic

**Created:** `components/marketing/who-i-help-section.tsx`

### Day 3: "What Factories Won't Tell You" Section
- [x] Create `FactoryTruthsSection` component
- [x] Add compelling intro: "Factories expect clarity; designers expect guidance. Issues occur in the gap."
- [x] List key truths as cards:
  - Factories don't choose your fabrics
  - Too many options slow production
  - Communication varies internally
  - Timelines aren't always late — they're layered
  - Backup factories are essential
  - Factory visits solve miscommunication
- [x] Add CTA linking to resources/blog

**Created:** `components/marketing/factory-truths-section.tsx`

### Day 4: Update Homepage Offerings Section
- [x] Rewrite "How We Help Fashion Designers" section to focus on:
  - Factory Communication Support
  - Production Systems & Workflows
  - Sustainable Sourcing Guidance
- [x] Update card descriptions to match new niche
- [x] Update "Ideal Client" indicators to match new positioning (already aligned)

**File:** `app/page.tsx` (lines 101-207)

---

## DAYS 5-8: New Homepage Sections

**DECISION:** Skipped adding more homepage sections to avoid overwhelm. Content moved to blog topics for SEO instead.

### Days 5-7: MOVED TO BLOG CONTENT
The following were planned as homepage sections but will be blog posts instead:

- ~~Sustainability Without Overwhelm Section~~ → Blog post: "Sustainability Without Overwhelm: A Guide for First-Time Designers"
- ~~Operations for First-Time Designers Section~~ → Blog series: Fabric Support, Supplier Communication, Production Timelines, Factory Decisions
- ~~Factory Visit Prep CTA Section~~ → Blog post: "Factory Visit Prep Guide" (already in Day 13)

### Day 8: Homepage Review
- [x] Homepage structure finalized with focused sections:
  1. Hero (updated) ✅
  2. Who I Help ✅
  3. What Factories Won't Tell You ✅
  4. Studio Systems (prominent placement) ✅
  5. How I Help (3 offerings) ✅
  6. Ideal Client ✅
  7. Final CTA ✅
- [x] Decision: Keep homepage tight, drive SEO through blog content

---

## DAYS 9-12: Services & About Page Updates

### Day 9: Services Page Rewrite - Part 1
- [ ] Update page hero with new positioning
- [ ] Reframe "Studio Systems Membership" description:
  - Focus on factory communication templates
  - Production tracking systems
  - Sustainability roadmaps
  - Community of first-time designers

**File:** `app/services/page.tsx`

### Day 10: Services Page Rewrite - Part 2
- [ ] Update "Systems Implementation" service:
  - Add factory communication setup
  - Add supplier tracking systems
  - Add production calendar templates
- [ ] Update "Strategic Guidance" service:
  - Focus on production strategy
  - Factory relationship building
  - Timeline planning

**File:** `app/services/page.tsx`

### Day 11: About Page Rewrite
- [ ] Update Kerri's bio to emphasize:
  - Decade of fashion production experience
  - FIT Production Management background
  - Factory relationship expertise
  - Sustainable production focus
- [ ] Update "I Understand" section with new pain points
- [ ] Update "How I Help" section with factory-focused language

**File:** `app/about/page.tsx`

### Day 12: Create Resources Hub Page
- [ ] Create new `/resources` route
- [ ] Create `ResourceCard` component
- [ ] Initial resources to feature:
  - Factory Visit Prep Guide (link to blog)
  - Production Timeline Overview (link to blog)
  - Sustainability Starter Tips (link to blog)
  - Free Notion Templates (link to products)
- [ ] Add lead magnet signup section

**Create:** `app/resources/page.tsx`, `components/marketing/resource-card.tsx`

---

## DAYS 13-16: Blog Content Foundation

### Day 13: Blog Post - Factory Visit Guide
- [ ] Write/draft comprehensive factory visit guide
- [ ] Include:
  - What to observe (cleanliness, workflow, communication)
  - Questions to ask (contact, timeline, bottlenecks)
  - What to bring (samples, swatches, patterns)
  - Red flags to watch for
- [ ] Add to blog via admin dashboard

### Day 14: Blog Post - Fabric Selection Basics
- [ ] Write/draft fabric selection guide for beginners
- [ ] Include:
  - How to narrow down fabric choices
  - When a fabric "won't work" for production
  - Communicating fabric needs to suppliers
  - Common fabric mistakes to avoid

### Day 15: Blog Post - Production Timelines Explained
- [ ] Write/draft production timeline guide
- [ ] Include:
  - Realistic small-batch timelines
  - Why timelines are "layered" not linear
  - Seasonal planning basics
  - How to communicate timeline needs

### Day 16: Blog Post - Sustainability for Beginners
- [ ] Write/draft approachable sustainability guide
- [ ] Include:
  - Why you don't need perfection to start
  - Natural fiber options
  - Building ethical supplier relationships
  - Transparency vs greenwashing

---

## DAYS 17-20: Lead Magnets & Polish

### Day 17: Create Factory Visit Prep Checklist Lead Magnet
- [ ] Create downloadable PDF checklist
- [ ] Set up lead capture form
- [ ] Connect to email list
- [ ] Promote via blog post and email sequence

### Day 18: Create New Designer FAQ Page
- [ ] Create `/faq` route
- [ ] Common questions:
  - How do I find a factory?
  - How many units should I produce?
  - What's a realistic timeline?
  - How do I communicate with suppliers?
  - What fabrics work for small batches?
- [ ] Link from homepage and resources

**Create:** `app/faq/page.tsx`

### Day 19: Navigation & Footer Updates
- [ ] Update marketing header navigation:
  - Home, About, Services, Resources, Blog, Studio Systems
- [ ] Update footer with:
  - Updated tagline
  - Resource links
  - Social links (Instagram, LinkedIn, Pinterest)
- [ ] Ensure mobile navigation works

**Files:** `components/marketing/marketing-header.tsx`, `components/marketing/marketing-footer.tsx`

### Day 20: Final Review & Launch
- [ ] Full site walkthrough on desktop
- [ ] Full site walkthrough on mobile
- [ ] Check all links work
- [ ] Review SEO meta tags on all pages
- [ ] Test lead magnet signup flow
- [ ] Final copy review for consistency
- [ ] Deploy to production

---

# REFERENCE: INSIGHTS FROM DESIGNER CONVERSATION

## Key Needs Designers Expressed
- Emotional reassurance + confirmation of what's normal
- Clear guidance on what factories will/won't do
- Fabric selection support
- Supplier communication clarity
- Understanding which delays are normal
- How to prepare for factory visits
- Practical sustainability (not perfectionistic pressure)
- Systems + organization for the entire production process

## Pain Points to Address
- Overwhelming number of fabric choices
- Confusion around factory expectations
- Missing point-of-contact at factories
- Fabric arriving in incorrect formats
- General lack of clarity in production timelines
- Fear of making expensive mistakes
- Domestic production confusion
- Sustainability guilt

## Opportunity Areas for Oceo Luxe
- Factory communication translation
- Beginner-friendly production education
- Long-term sustainability guidance
- Fabric decision frameworks
- Domestic production expertise (CFDA resources)
- Operational systems for founders
- Emotional safety + confidence building

---

# REFERENCE: NEW WEBSITE SECTION CONTENT

## Who I Help

You're a designer with a clear vision — but the production world still feels overwhelming.

Oceo Luxe is built for you if you:
- are new to factories and want guidance
- need clarity on timelines and expectations
- want sustainable suppliers without overwhelm
- feel unsure what to ask your factory
- want systems that support creativity
- care deeply about ethics and sustainability

## What Factories Won't Tell You

Factories expect clarity; designers expect guidance. Issues occur in the gap.

Key truths:
- Factories don't choose your fabrics
- Too many options slow production
- Communication varies internally
- Timelines aren't always late — they're layered
- Backup factories are essential
- Factory visits solve miscommunication

## Factory Visit Prep

**What to Observe**
- Cleanliness
- Workflow
- Communication between sample/cutting/sewing
- Machinery alignment
- Workload capacity

**Questions to Ask**
- Who is my main contact?
- Timeline for my garment?
- Typical bottlenecks?
- In-house services?
- What helps them work efficiently?

**What to Bring**
- Reference samples
- Ranked swatches
- Patterns/mockups
- Priority list

## Sustainability Without Overwhelm

- You don't need perfection to launch
- Ethical production grows through relationships
- Natural fibers are a strong start
- Transparency > greenwashing
- Sustainable brands evolve gradually

## Operations for First-Time Designers

**Fabric Support**
- Choosing fabrics that work
- When a fabric "won't work"
- Keeping options minimal

**Supplier Communication**
- Requesting materials properly
- Preventing formatting errors
- Writing clear questions

**Production Timelines**
- Realistic small-batch timelines
- Luxury planning norms
- Seasonal planning

**Factory Decisions**
- Vetting factories
- Red flags
- Backup plans

**Systems Needed**
- Sampling calendars
- Fabric libraries
- Margin tracking
- Notion dashboards

## Homepage Hero

**Headline:** Clarity and structure for designers who want to produce consciously — without the overwhelm.

**Subheadline:** I help you communicate clearly, avoid production mistakes, choose the right materials, and build systems that support your growth.

---

# SALES AUDIT & STUDIO SYSTEMS PROMOTION

## Completed (Dec 2024)
- [x] Quiz email capture gate (requires email before showing results)
- [x] Archetype-specific follow-up emails with personalized content
- [x] Pricing consistency ($33 founding members / $77 regular)
- [x] Homepage: Studio Systems section moved up (after Factory Truths pain points)
- [x] About page: Studio Systems section added before final CTA
- [x] Sales review slash command created (`.claude/commands/sales-review.md`)
- [x] Returning quiz users now receive emails on retake

---

## Sales-Focused Blog Topics (Drive Studio Systems Interest)

These blog posts naturally lead readers toward Studio Systems membership:

### Pain Point Posts
- [ ] "Why Most Designers Burn Out Before Their Third Collection"
  - Hook: The overwhelm is real, but it's not about working harder
  - CTA: Studio Systems provides the structure to prevent burnout

- [ ] "The Hidden Cost of Disorganized Production"
  - Hook: Calculate what chaos is actually costing you (time, money, energy)
  - CTA: Studio Systems templates and systems

- [ ] "5 Signs You Need Production Systems (Not Just Harder Work)"
  - Hook: Recognize the symptoms of systems gaps
  - CTA: Direct lead-in to Studio Systems

- [ ] "What Happens When You Don't Have a Production Calendar"
  - Hook: Real scenarios of missed deadlines, rushed decisions
  - CTA: Studio Systems includes production calendars

### Educational Posts (Build Trust, Show Expertise)
- [ ] "The Oceo Method Explained: Organize, Optimize, Own It"
  - Hook: The framework behind sustainable production
  - CTA: Learn the full method inside Studio Systems

- [ ] "How I Managed Production for Luxury Brands (And What I Learned)"
  - Hook: Behind-the-scenes expertise
  - CTA: Get access to these systems in Studio Systems

- [ ] "Factory Communication: What to Say and How to Say It"
  - Hook: Scripts and templates for common scenarios
  - CTA: Full communication templates in Studio Systems

- [ ] "Small Batch Production: What's Actually Realistic"
  - Hook: Honest timeline and MOQ expectations
  - CTA: Studio Systems community has been through this

### Archetype-Specific Posts
- [ ] "For the Muse Chaser: When Your Vision Needs Structure"
- [ ] "For the World Builder: Creating Entry Points Without Diluting Magic"
- [ ] "For the Intimist: Scaling Without Losing the Personal Touch"
- [ ] "For the Editor: Moving From Concept to Delivery With Confidence"
- [ ] "For the Populist: Accessibility and Intention Can Coexist"

---

## Quiz-to-Membership Nurture Sequence

### Email 1: Quiz Result (Automated - DONE)
- Archetype-specific content with gift, tricky area, key question
- Links to products, services, and Studio Systems

### Email 2: Archetype Deep Dive (Day 3)
- [ ] Create 5 archetype-specific emails
- Expand on how their archetype affects production decisions
- Include 1-2 specific tips for their type
- Soft mention of Studio Systems

### Email 3: Common Struggle (Day 7)
- [ ] Create email addressing pain point common to their archetype
- Share a quick win or framework
- Position Studio Systems as the full solution

### Email 4: Studio Systems Invitation (Day 10)
- [ ] Create direct pitch email
- Founding member pricing ($33/month)
- What's included, who it's for
- Testimonial or case study if available

### Email 5: Last Chance / FAQ (Day 14)
- [ ] Address common objections:
  - "I don't have time for another membership"
  - "I can figure this out myself"
  - "Is this right for my stage?"
- Founding member deadline (if applicable)

---

## Conversion Optimization Tasks

### Studio Systems Page Improvements
- [ ] Add FAQ section addressing objections
- [ ] Add testimonials/case studies when available
- [ ] Add "What You Get" visual breakdown
- [ ] Add comparison: DIY vs Studio Systems

### Services Page Cross-Sell
- [ ] Add "Not ready for 1:1?" callout linking to Studio Systems
- [ ] Position Studio Systems as entry point to working together

### Blog Post CTAs
- [ ] Create reusable Studio Systems CTA component for blog posts
- [ ] Add contextual CTAs to existing blog posts

### Quiz Results Page
- [ ] Add archetype-specific Studio Systems hook (DONE in email, add to results page)
- [ ] Add "What other [Archetype]s are saying" section when testimonials available

### Footer/Global Elements
- [ ] Add Studio Systems to footer links
- [ ] Consider exit-intent popup for Studio Systems (optional)

---

## Metrics to Track

- [ ] Quiz completion rate
- [ ] Quiz email capture rate
- [ ] Quiz result email open rate
- [ ] Studio Systems page visits (from quiz vs other sources)
- [ ] Studio Systems conversion rate
- [ ] Email sequence click-through rates

---

# FUTURE PHASES (After 20 Days)

## Phase 2 — Studio Systems Content
- [ ] Factory communication templates
- [ ] Fabric decision-making flowchart
- [ ] Supplier communication guide
- [ ] Production tracking template
- [ ] Sustainability roadmap
- [ ] Factory Visit Prep checklist (full version)

## Phase 3 — Additional Lead Magnets
- [ ] New to Production Guide
- [ ] Sustainability Starter Pack
- [ ] Fabric Decision-Making Guide
- [ ] Production Communication Templates

## Phase 4 — Email Sequences
- [ ] Designer onboarding sequence
- [ ] Factory prep email series
- [ ] Sustainability education sequence
- [ ] Pricing & margin clarity emails

## Phase 5 — Content Marketing
- [ ] 30-day Threads series
- [ ] Pinterest SEO pins
- [ ] LinkedIn operations content
- [ ] Production basics blog series expansion

## Phase 6 — Notion Templates (Studio Systems)
- [ ] Production dashboard
- [ ] Fabric library
- [ ] Factory contact log
- [ ] Sampling tracker
- [ ] Monthly production calendar

---

# TECHNICAL REFERENCE

## Files to Modify
- `app/page.tsx` - Homepage
- `app/services/page.tsx` - Services page
- `app/about/page.tsx` - About page
- `components/marketing/marketing-header.tsx` - Navigation
- `components/marketing/marketing-footer.tsx` - Footer

## Files to Create
- `components/marketing/who-i-help-section.tsx`
- `components/marketing/factory-truths-section.tsx`
- `components/marketing/sustainability-section.tsx`
- `components/marketing/operations-section.tsx`
- `components/marketing/factory-visit-cta.tsx`
- `components/marketing/resource-card.tsx`
- `app/resources/page.tsx`
- `app/faq/page.tsx`

## Design System Reference
- Primary background: `bg-[#faf8f5]`
- Secondary background: `bg-[#f5f0ea]`
- Card background: `bg-[#F5F3F0]`
- Primary text: `text-[#3B3937]`
- Secondary text: `text-[#967F71]`
- Muted text: `text-[#6B655C]`
- Accent color: `text-[#CDA7B2]` / `bg-[#CDA7B2]`
- Accent hover: `bg-[#BD97A2]`
- Border color: `border-[#EDEBE8]`
- Font: Serif for headings, light weight throughout
