import 'dotenv/config';
import { db } from '../lib/db/drizzle';
import { users, courses, courseModules, lessons } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

const ADMIN_EMAIL = 'kerrib@oceoluxe.com';

async function createSOSKitCourse() {
  console.log('Creating Fashion Business SOS Kit course...\n');

  // 1. Find the admin user
  const [adminUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, ADMIN_EMAIL))
    .limit(1);

  if (!adminUser) {
    console.error(`Admin user ${ADMIN_EMAIL} not found!`);
    process.exit(1);
  }

  console.log(`Found admin user: ${adminUser.name} (ID: ${adminUser.id})`);

  // 2. Check if course already exists
  const courseSlug = 'fashion-business-sos-kit';

  const [existingCourse] = await db
    .select()
    .from(courses)
    .where(eq(courses.slug, courseSlug))
    .limit(1);

  if (existingCourse) {
    console.log('Course already exists! Deleting and recreating...');
    // Delete existing lessons, modules, and course
    const existingModules = await db
      .select()
      .from(courseModules)
      .where(eq(courseModules.courseId, existingCourse.id));

    for (const mod of existingModules) {
      await db.delete(lessons).where(eq(lessons.moduleId, mod.id));
    }
    await db.delete(courseModules).where(eq(courseModules.courseId, existingCourse.id));
    await db.delete(courses).where(eq(courses.id, existingCourse.id));
    console.log('Deleted existing course data');
  }

  // 3. Create the course
  const [newCourse] = await db.insert(courses).values({
    title: 'Fashion Business SOS Kit',
    slug: courseSlug,
    description: `If your production process feels like a million sticky notes and scattered spreadsheets… this is for you.

This Notion kit helps fashion founders and ops teams organize the backend—without losing the creative flow. Whether you're launching your first line or juggling wholesale orders, this gives you a clear, visual system that keeps it all moving.

What's inside:
• Product development tracker
• Vendor directory
• Order tracking sheet
• Sales channel planner
• Content calendar that ties it all together

All built in Notion, ready to plug in your own visions.`,
    shortDescription: 'Organize your fashion business backend with this complete Notion kit',
    difficulty: 'beginner',
    estimatedMinutes: 45,
    isPublished: true,
    isFeatured: true,
    displayOrder: 1,
    createdBy: adminUser.id,
  }).returning();

  console.log(`\nCreated course: ${newCourse.title} (ID: ${newCourse.id})`);

  // 4. Create modules
  console.log('\n--- Creating modules ---');

  const modulesData = [
    {
      title: 'Getting Started',
      description: 'Welcome to the Fashion Business SOS Kit and learn how to use it effectively.',
      displayOrder: 1,
    },
    {
      title: 'Core Tools',
      description: 'Master each tool in the kit: product tracking, vendors, orders, sales channels, and content planning.',
      displayOrder: 2,
    },
    {
      title: 'Next Steps',
      description: 'Tips for growing your system as your business scales.',
      displayOrder: 3,
    },
  ];

  const createdModules: { id: number; title: string }[] = [];
  for (const moduleData of modulesData) {
    const [module] = await db.insert(courseModules).values({
      courseId: newCourse.id,
      ...moduleData,
    }).returning();
    createdModules.push(module);
    console.log(`Created module: ${module.title}`);
  }

  // 5. Create lessons
  console.log('\n--- Creating lessons ---');

  const lessonsData = [
    // Module 1: Getting Started
    {
      moduleId: createdModules[0].id,
      title: 'Welcome!',
      slug: 'welcome',
      description: 'Introduction to the Fashion Business SOS Kit and why it was created.',
      content: `# Welcome!

You didn't start your fashion business to spend your days lost in spreadsheets, chasing vendors, or wondering where that one trim order disappeared to—or maybe you did but it's become too overwhelming to keep track of it all. This kit is designed to bring structure, sanity, and strategy to the backend of your brand. This kit was made for visionaries as well as operations and production managers making sense of the ever evolving marketplace.

Whether you're launching your first line or streamlining your 5th season, this is your foundation for working smarter—not just harder. Some of the largest brands and department stores on the planet still rely on Excel for order placement, fulfillment and production tracking.

With this you will be 5 steps ahead—organizing your workflow in a way that's visual, intuitive, and built for the pace of modern fashion.`,
      lessonType: 'text',
      displayOrder: 1,
      isPreview: true,
      pointsReward: 10,
    },
    {
      moduleId: createdModules[0].id,
      title: 'How to Use This Kit',
      slug: 'how-to-use',
      description: 'Learn the best practices for getting the most out of your SOS Kit.',
      content: `# How to Use This Kit

Each section of this template was built to cover a key workflow in fashion production and brand operations. You'll find templates pre-filled with sample info so you can see how it works—it's really as simple as just replacing that data with your own information.

## Tips for Success

- **Replace all sample text** with your real data
- **Keep everything in one workspace** so you don't lose track. Notion is a great tool to use—if you do not have it already, it is free to start.
- **Review weekly:** update statuses and check in on bottlenecks. If you're in a sampling or shipping season, I recommend updating daily so that your weekly reviews do not take hours of your time.
- **Keep the first line as an example** for yourself and teammates while creating the sheets.
- **Duplicate tabs** to track each season (i.e., SS25, FW25)`,
      lessonType: 'text',
      displayOrder: 2,
      isPreview: false,
      pointsReward: 10,
    },

    // Module 2: Core Tools
    {
      moduleId: createdModules[1].id,
      title: 'Product Development Tracker',
      slug: 'product-development-tracker',
      description: 'Track every style from sketch to sample to approved product.',
      content: `# Product Development Tracker

## What This Is

A central dashboard to track every style you're developing—from sketch to sample to approved product.

## How to Use It

- **Add each style** you're working on (one row per style)
- **Upload a sketch or image reference** for visual tracking
- **List out the fabric, trims, and fit notes** for each piece
- **Update the sample status regularly:** "Idea" → "In Progress" → "Approved"
- **Add your projected launch date** so you can plan your calendar around it

## Pro Tip

Create filters to show only "In Progress" items when you're planning sample reviews. There is a view of all samples, as well as one that only shows your "In Progress" samples.`,
      lessonType: 'text',
      displayOrder: 1,
      isPreview: false,
      pointsReward: 15,
    },
    {
      moduleId: createdModules[1].id,
      title: 'Vendor Directory',
      slug: 'vendor-directory',
      description: 'Your go-to Rolodex of suppliers, factories, and partners.',
      content: `# Vendor Directory

## What This Is

Your go-to Rolodex of suppliers, factories, and partners—because you shouldn't be searching through emails every time you need to reorder zippers.

## How to Use It

- **Enter vendors by category:** Fabric, Trims, Hardware, Packaging, etc.
- **Include contact info, minimum order quantities, lead times, and notes**
- **Use "Last Contacted"** to stay on top of outreach
- **Optional:** add a "Rating" column to track responsiveness or reliability

## Pro Tip

Color code or tag your "favorite vendors" for quicker access.`,
      lessonType: 'text',
      displayOrder: 2,
      isPreview: false,
      pointsReward: 15,
    },
    {
      moduleId: createdModules[1].id,
      title: 'Order Tracking Sheet',
      slug: 'order-tracking',
      description: 'Keep track of every customer or wholesale order from placement to delivery.',
      content: `# Order Tracking Sheet

## What This Is

Keep track of every customer or wholesale order from placement to delivery.

## How to Use It

- **Add a new row** every time you receive an order
- **Include SKU, size, date, and shipping method**
- **Enter tracking numbers** once fulfilled
- **Use filters** to see all unshipped or recently shipped orders

## Pro Tip

This can be duplicated per sales channel (ex: one for Shopify, one for Faire).`,
      lessonType: 'text',
      displayOrder: 3,
      isPreview: false,
      pointsReward: 15,
    },
    {
      moduleId: createdModules[1].id,
      title: 'Sales Channel Planner',
      slug: 'sales-channel-planner',
      description: 'Track what styles are selling where, how they\'re priced, and when they\'re launching.',
      content: `# Sales Channel Planner

## What This Is

Track what styles are selling where, how they're priced, and when they're launching.

## How to Use It

- **Log each product's sales channel:** Shopify, Faire, IG DMs, In-store, etc.
- **Add your wholesale and retail prices**
- **Track launch dates** so your content calendar can align
- **Optional:** add notes like "exclusive" or "limited run"

## Pro Tip

Add a "Channel Performance" column later if you want to track revenue per platform.`,
      lessonType: 'text',
      displayOrder: 4,
      isPreview: false,
      pointsReward: 15,
    },
    {
      moduleId: createdModules[1].id,
      title: 'Content Calendar',
      slug: 'content-calendar',
      description: 'Plan your marketing content based on your product development and sales timelines.',
      content: `# Content Calendar

## What This Is

Plan your marketing content based on your product development + sales timelines.

## How to Use It

- **Add the product or campaign** you're featuring
- **Write your caption idea or talking point**
- **Add a CTA (Call to Action)** like "Join the Waitlist" or "Shop Now"
- **List where your content is stored:** Dropbox folder, photoshoot link, etc.
- **Set the date** you plan to post

### Weekly To-Do

Go back through social media posts at the end of the week to enter statistics. See what posts are driving traffic to your site!

## Pro Tip

Try batching your posts weekly using this calendar as your north star.`,
      lessonType: 'text',
      displayOrder: 5,
      isPreview: false,
      pointsReward: 15,
    },

    // Module 3: Next Steps
    {
      moduleId: createdModules[2].id,
      title: 'Final Tips & Growing Your System',
      slug: 'final-tips',
      description: 'How to expand the kit as your business grows.',
      content: `# Final Tips & Growing Your System

This kit was designed to support your creative vision *and* make sure the logistics don't fall through the cracks.

## Expanding Your System

You can always expand on each section as your business grows. Consider adding tabs for:

- **Sampling feedback** — track notes from fit sessions
- **Delivery tracking** — monitor inbound shipments from vendors
- **Cost sheets** — break down COGS per style
- **Production timelines** — Gantt-style views for major milestones
- **Wholesale accounts** — CRM for your retail partners

## Remember

The goal isn't perfection—it's progress. Start with what you need now, and build from there.

You've got this! 🧵`,
      lessonType: 'text',
      displayOrder: 1,
      isPreview: false,
      pointsReward: 20,
    },
  ];

  for (const lessonData of lessonsData) {
    const [lesson] = await db.insert(lessons).values(lessonData).returning();
    console.log(`Created lesson: ${lesson.title}`);
  }

  console.log('\n✅ Fashion Business SOS Kit course created!');
  console.log('\nCourse structure:');
  console.log('├── Module 1: Getting Started');
  console.log('│   ├── Welcome! (preview)');
  console.log('│   └── How to Use This Kit');
  console.log('├── Module 2: Core Tools');
  console.log('│   ├── Product Development Tracker');
  console.log('│   ├── Vendor Directory');
  console.log('│   ├── Order Tracking Sheet');
  console.log('│   ├── Sales Channel Planner');
  console.log('│   └── Content Calendar');
  console.log('└── Module 3: Next Steps');
  console.log('    └── Final Tips & Growing Your System');
  console.log('\nTotal: 3 modules, 8 lessons');

  process.exit(0);
}

createSOSKitCourse().catch((error) => {
  console.error('Error creating course:', error);
  process.exit(1);
});
