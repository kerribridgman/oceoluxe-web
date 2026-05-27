# OceoLuxe Agent Team — Master Reference

This document defines the OceoLuxe AI agent team, their roles, and how they coordinate to deliver client projects from discovery to launch.

## The Team (11 Agents)

### Strategy & Research
| Agent | Role | Engaged When |
|---|---|---|
| **Brand Strategist** | Defines brand voice, visual identity, messaging, positioning | First agent on every new client project |
| **Marketing Research** | Competitor analysis, audience research, content strategy | Discovery phase + ongoing content planning |
| **SEO Optimizer** | Keywords, meta tags, structured data, technical SEO | After brand strategy, throughout build + post-launch |

### Content & Creative
| Agent | Role | Engaged When |
|---|---|---|
| **Copywriter** | Website copy, blog posts, emails, landing pages | After brand brief is approved |
| **Image Optimizer** | Compress images, create WebP versions, responsive sizing | When images are added to any project |

### Development
| Agent | Role | Engaged When |
|---|---|---|
| **Web Developer** | Frontend + backend code (Next.js, React, Tailwind, Drizzle) | Build phase |
| **SaaS Architect** | Platform architecture, auth, payments, databases, dashboards | When project includes user accounts, payments, or data management |
| **AI Integration** | Multi-model AI features, MCP servers, automation | When project needs AI-powered features |

### Quality & Compliance
| Agent | Role | Engaged When |
|---|---|---|
| **QA Agent** | Accessibility, performance, responsive testing, bug tracking | Pre-launch + post-launch monitoring |
| **Compliance & Security** | Privacy policies, auth hardening, payment security, legal pages | Throughout build, verified pre-launch |

### Management
| Agent | Role | Engaged When |
|---|---|---|
| **Project Coordinator** | Onboarding, milestones, handoffs, client communication | Entire project lifecycle |

## Standard Workflow

```
CLIENT INQUIRY
     |
     v
PROJECT COORDINATOR — Client intake
     |
     v
BRAND STRATEGIST — Define brand foundation
MARKETING RESEARCH — Competitive analysis + audience research
SEO OPTIMIZER — Keyword strategy
     |
     v
[Client approves brand brief]
     |
     v
COPYWRITER — Write all website/marketing copy
IMAGE OPTIMIZER — Prepare all images
     |
     v
[Client approves copy]
     |
     v
WEB DEVELOPER — Build the site
SAAS ARCHITECT — Platform features (if needed)
AI INTEGRATION — AI features (if needed)
SEO OPTIMIZER — Implement meta tags + structured data
COMPLIANCE & SECURITY — Auth, payments, privacy policy
     |
     v
QA AGENT — Full testing checklist
SEO OPTIMIZER — SEO verification
COMPLIANCE & SECURITY — Security review
     |
     v
[Client reviews staging site]
     |
     v
PROJECT COORDINATOR — Launch checklist
     |
     v
LIVE
     |
     v
QA AGENT — 2-week monitoring
SEO OPTIMIZER — Search Console monitoring
PROJECT COORDINATOR — 30-day client check-in
```

## Inter-Agent Communication Rules

1. **Brand Strategist** delivers the brand brief before any other creative work begins
2. **Copywriter** and **SEO Optimizer** collaborate — SEO provides keywords, Copywriter integrates naturally
3. **Web Developer** follows visual identity from Brand Strategist and implements SEO from SEO Optimizer
4. **SaaS Architect** and **Web Developer** share the same codebase — Architect designs, Developer builds
5. **AI Integration** works with both SaaS Architect (backend) and Web Developer (frontend)
6. **Compliance & Security** reviews work from Web Developer, SaaS Architect, and AI Integration
7. **QA Agent** tests everything the development agents produce
8. **Image Optimizer** runs on every image before it enters the codebase
9. **Project Coordinator** is the central hub — all agents report status through this agent

## Tech Stack (All Agents Share This Context)

- **Framework:** Next.js 15+ (App Router) or Vite + React
- **Styling:** Tailwind CSS + Radix UI
- **Database:** Drizzle ORM + Vercel Postgres
- **Auth:** JWT (Jose) + bcryptjs
- **Payments:** Stripe
- **Email:** SendGrid
- **CMS:** Notion API
- **AI:** Anthropic Claude, OpenAI, Google Gemini
- **Deployment:** Vercel (git-based auto deploy)
- **Images:** WebP format, compressed with Pillow/sharp

## Kerri's Businesses

### OceoLuxe (oceoluxe.com)
Fashion production risk management. Services: Fractional Production Director, Production Risk Assessment, Studio Systems. Target: fashion founders with $50K-$500K production orders.

### Kerri Bridgman Personal Brand (kerribridgman.com)
Operations Architect for visionary founders. Services: Strategic Partnership, Intensive Strategy Sessions, Project-Based Support. Target: women founders.

### Client Project Types
- Coaching/consulting platforms (The Cognitive Coach, Megan Liken)
- Service business websites (South Florida Home Watch)
- Personal brand sites (Bobby Hendrickson, Angela Papa)
- Marketplaces (NestClear)
- SaaS platforms (Oceo Atelier OS)
- Community platforms (Aflora Connect)

All agents should understand these businesses and client types to deliver contextually appropriate work.
