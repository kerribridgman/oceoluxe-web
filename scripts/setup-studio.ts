import 'dotenv/config';
import { db } from '../lib/db/drizzle';
import { users, educationSubscriptions, userProfiles, courses, courseModules, lessons } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

const ADMIN_EMAIL = 'kerrib@oceoluxe.com';

async function setupStudio() {
  console.log('Setting up Studio Systems...\n');

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

  // 2. Create or update subscription for admin
  console.log('\n--- Setting up subscription ---');

  const [existingSub] = await db
    .select()
    .from(educationSubscriptions)
    .where(eq(educationSubscriptions.userId, adminUser.id))
    .limit(1);

  if (existingSub) {
    // Update existing subscription to active
    await db
      .update(educationSubscriptions)
      .set({
        status: 'active',
        tier: 'lifetime',
        currentPeriodEnd: new Date('2099-12-31'),
        updatedAt: new Date(),
      })
      .where(eq(educationSubscriptions.userId, adminUser.id));
    console.log('Updated existing subscription to active lifetime');
  } else {
    // Create new subscription
    await db.insert(educationSubscriptions).values({
      userId: adminUser.id,
      tier: 'lifetime',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date('2099-12-31'),
    });
    console.log('Created new lifetime subscription');
  }

  // 3. Create or update user profile
  console.log('\n--- Setting up user profile ---');

  const [existingProfile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, adminUser.id))
    .limit(1);

  if (!existingProfile) {
    await db.insert(userProfiles).values({
      userId: adminUser.id,
      displayName: adminUser.name || 'Admin',
      points: 0,
      streak: 0,
    });
    console.log('Created user profile');
  } else {
    console.log('User profile already exists');
  }

  // 4. Create sample course
  console.log('\n--- Creating sample course ---');

  const courseSlug = 'fashion-business-foundations';

  const [existingCourse] = await db
    .select()
    .from(courses)
    .where(eq(courses.slug, courseSlug))
    .limit(1);

  let courseId: number;

  if (existingCourse) {
    console.log('Sample course already exists');
    courseId = existingCourse.id;
  } else {
    const [newCourse] = await db.insert(courses).values({
      title: 'Fashion Business Foundations',
      slug: courseSlug,
      description: 'Master the fundamentals of building a successful fashion brand. This comprehensive course covers everything from brand identity to production planning, marketing strategies, and scaling your business.',
      shortDescription: 'Build a strong foundation for your fashion brand',
      difficulty: 'beginner',
      estimatedMinutes: 180,
      isPublished: true,
      isFeatured: true,
      displayOrder: 1,
      createdBy: adminUser.id,
    }).returning();

    courseId = newCourse.id;
    console.log(`Created course: ${newCourse.title} (ID: ${courseId})`);

    // 5. Create modules
    console.log('\n--- Creating modules ---');

    const modulesData = [
      {
        title: 'Module 1: Brand Identity & Vision',
        description: 'Define your unique brand identity and create a compelling vision for your fashion business.',
        displayOrder: 1,
      },
      {
        title: 'Module 2: Production & Sourcing',
        description: 'Learn how to source materials, work with manufacturers, and manage production timelines.',
        displayOrder: 2,
      },
      {
        title: 'Module 3: Marketing & Sales',
        description: 'Develop effective marketing strategies and build sales channels for your fashion brand.',
        displayOrder: 3,
      },
    ];

    const createdModules = [];
    for (const moduleData of modulesData) {
      const [module] = await db.insert(courseModules).values({
        courseId,
        ...moduleData,
      }).returning();
      createdModules.push(module);
      console.log(`Created module: ${module.title}`);
    }

    // 6. Create lessons for each module
    console.log('\n--- Creating lessons ---');

    const lessonsData = [
      // Module 1 lessons
      {
        moduleId: createdModules[0].id,
        title: 'Welcome to Fashion Business Foundations',
        slug: 'welcome',
        description: 'An introduction to the course and what you will learn.',
        content: `# Welcome to Fashion Business Foundations

In this course, you'll learn the essential skills needed to build and grow a successful fashion brand.

## What You'll Learn

- How to define your brand identity
- Production and sourcing strategies
- Marketing and sales techniques
- Financial planning for fashion businesses

Let's get started on your journey to building a thriving fashion brand!`,
        lessonType: 'text',
        displayOrder: 1,
        isPreview: true,
        pointsReward: 10,
      },
      {
        moduleId: createdModules[0].id,
        title: 'Defining Your Brand Identity',
        slug: 'brand-identity',
        description: 'Learn how to create a unique and memorable brand identity.',
        content: `# Defining Your Brand Identity

Your brand identity is the foundation of your fashion business. It's how customers perceive and connect with your brand.

## Key Elements of Brand Identity

### 1. Brand Values
What does your brand stand for? Consider:
- Sustainability
- Craftsmanship
- Innovation
- Inclusivity

### 2. Visual Identity
- Logo design
- Color palette
- Typography
- Photography style

### 3. Brand Voice
How does your brand communicate?
- Tone of voice
- Messaging style
- Storytelling approach

## Exercise
Take 15 minutes to write down 3-5 core values that define your brand.`,
        lessonType: 'text',
        displayOrder: 2,
        isPreview: false,
        pointsReward: 15,
      },
      {
        moduleId: createdModules[0].id,
        title: 'Understanding Your Target Customer',
        slug: 'target-customer',
        description: 'Identify and understand your ideal customer.',
        content: `# Understanding Your Target Customer

Knowing your customer is crucial for every business decision you make.

## Creating Customer Personas

### Demographics
- Age range
- Location
- Income level
- Occupation

### Psychographics
- Values and beliefs
- Lifestyle
- Shopping habits
- Fashion preferences

### Pain Points
What problems does your customer face that your brand can solve?

## Action Item
Create a detailed persona for your ideal customer, including their name, background, and shopping habits.`,
        lessonType: 'text',
        displayOrder: 3,
        isPreview: false,
        pointsReward: 15,
      },
      // Module 2 lessons
      {
        moduleId: createdModules[1].id,
        title: 'Introduction to Production',
        slug: 'intro-production',
        description: 'Overview of fashion production processes.',
        content: `# Introduction to Fashion Production

Understanding production is essential for bringing your designs to life.

## Production Methods

### 1. Cut-Make-Trim (CMT)
You provide patterns and materials, factory handles cutting and sewing.

### 2. Full Package Production (FPP)
Factory handles everything from sourcing to finished product.

### 3. Private Label
Customize existing designs with your branding.

## Key Considerations
- Minimum order quantities (MOQs)
- Lead times
- Quality control
- Cost per unit

## Next Steps
Research 3-5 manufacturers that align with your production needs.`,
        lessonType: 'text',
        displayOrder: 1,
        isPreview: false,
        pointsReward: 15,
      },
      {
        moduleId: createdModules[1].id,
        title: 'Sourcing Materials',
        slug: 'sourcing-materials',
        description: 'Learn how to find and evaluate fabric suppliers.',
        content: `# Sourcing Materials

Quality materials are the foundation of quality products.

## Finding Suppliers

### Trade Shows
- Texworld
- Premiere Vision
- Magic

### Online Platforms
- Alibaba
- Maker's Row
- Sewport

### Local Options
- Fabric districts
- Small mills
- Deadstock suppliers

## Evaluating Suppliers
- Request samples before ordering
- Check certifications (GOTS, OEKO-TEX)
- Understand MOQs and lead times
- Get references from other brands`,
        lessonType: 'text',
        displayOrder: 2,
        isPreview: false,
        pointsReward: 15,
      },
      // Module 3 lessons
      {
        moduleId: createdModules[2].id,
        title: 'Building Your Marketing Strategy',
        slug: 'marketing-strategy',
        description: 'Create an effective marketing plan for your brand.',
        content: `# Building Your Marketing Strategy

A strong marketing strategy helps you reach and connect with your target customers.

## Marketing Channels

### Social Media
- Instagram (visual storytelling)
- TikTok (behind-the-scenes, trends)
- Pinterest (inspiration, discovery)

### Email Marketing
- Build your list from day one
- Share exclusive content
- Announce new collections

### Content Marketing
- Blog posts
- Lookbooks
- Brand story

## Creating a Content Calendar
Plan your content 30 days in advance to maintain consistency.`,
        lessonType: 'text',
        displayOrder: 1,
        isPreview: false,
        pointsReward: 15,
      },
      {
        moduleId: createdModules[2].id,
        title: 'Sales Channels for Fashion Brands',
        slug: 'sales-channels',
        description: 'Explore different ways to sell your products.',
        content: `# Sales Channels for Fashion Brands

Diversifying your sales channels helps you reach more customers and reduce risk.

## Direct-to-Consumer (DTC)
- Your own website (Shopify, WooCommerce)
- Pop-up shops
- Trunk shows

## Wholesale
- Boutiques
- Department stores
- Online retailers

## Marketplaces
- Etsy
- Amazon Handmade
- Not on the High Street

## Tips for Success
- Start with one channel and master it
- Track metrics for each channel
- Consider margins and fees
- Build relationships with buyers`,
        lessonType: 'text',
        displayOrder: 2,
        isPreview: false,
        pointsReward: 15,
      },
      {
        moduleId: createdModules[2].id,
        title: 'Course Completion & Next Steps',
        slug: 'completion',
        description: 'Congratulations on completing the course!',
        content: `# Congratulations!

You've completed Fashion Business Foundations!

## What You've Learned
- How to define your brand identity
- Understanding your target customer
- Production and sourcing basics
- Marketing and sales strategies

## Your Next Steps

1. **Complete your brand identity worksheet**
2. **Research 5 potential suppliers**
3. **Create a 30-day content calendar**
4. **Set up your first sales channel**

## Continue Your Journey
Check out our other courses to keep building your fashion business skills!

Thank you for learning with Oceo Luxe Studio Systems.`,
        lessonType: 'text',
        displayOrder: 3,
        isPreview: false,
        pointsReward: 20,
      },
    ];

    for (const lessonData of lessonsData) {
      const [lesson] = await db.insert(lessons).values(lessonData).returning();
      console.log(`Created lesson: ${lesson.title}`);
    }
  }

  console.log('\n✅ Studio setup complete!');
  console.log('\nYou can now:');
  console.log('1. Access /studio/courses to see the course catalog');
  console.log('2. Access /studio/my-courses to see enrolled courses');
  console.log('3. Access /dashboard/courses to manage courses');
  console.log('\nRestart your dev server to apply the NEXT_PUBLIC_STUDIO_LAUNCHED setting.');

  process.exit(0);
}

setupStudio().catch((error) => {
  console.error('Error setting up studio:', error);
  process.exit(1);
});
