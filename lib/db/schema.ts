import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  decimal,
  unique,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('member'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripeProductId: text('stripe_product_id'),
  planName: varchar('plan_name', { length: 50 }),
  subscriptionStatus: varchar('subscription_status', { length: 20 }),
});

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  role: varchar('role', { length: 50 }).notNull(),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
});

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  userId: integer('user_id').references(() => users.id),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
});

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  email: varchar('email', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  invitedBy: integer('invited_by')
    .notNull()
    .references(() => users.id),
  invitedAt: timestamp('invited_at').notNull().defaultNow(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
});

export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  author: varchar('author', { length: 100 }).notNull(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  contentJson: jsonb('content_json'), // Reserved for future structured content
  coverImageUrl: text('cover_image_url'),
  ogImageUrl: text('og_image_url'),
  ogTitle: varchar('og_title', { length: 255 }),
  ogDescription: text('og_description'),
  metaTitle: varchar('meta_title', { length: 60 }),
  metaDescription: varchar('meta_description', { length: 160 }),
  metaKeywords: text('meta_keywords'),
  focusKeyword: varchar('focus_keyword', { length: 100 }),
  canonicalUrl: text('canonical_url'),
  metaRobots: varchar('meta_robots', { length: 50 }).default('index, follow'),
  articleType: varchar('article_type', { length: 50 }).default('BlogPosting'),
  industry: varchar('industry', { length: 100 }),
  targetAudience: text('target_audience'),
  keyConcepts: text('key_concepts'),
  publishedAt: timestamp('published_at'),
  isPublished: boolean('is_published').default(false),
  readingTimeMinutes: integer('reading_time_minutes'),
  createdBy: integer('created_by')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const seoSettings = pgTable('seo_settings', {
  id: serial('id').primaryKey(),
  page: varchar('page', { length: 50 }).notNull().unique(), // 'home', 'services', 'blog', etc.
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  keywords: text('keywords'),
  ogTitle: varchar('og_title', { length: 255 }),
  ogDescription: text('og_description'),
  ogImageUrl: text('og_image_url'),
  ogType: varchar('og_type', { length: 50 }).default('website'),
  twitterCard: varchar('twitter_card', { length: 50 }).default('summary_large_image'),
  twitterTitle: varchar('twitter_title', { length: 255 }),
  twitterDescription: text('twitter_description'),
  twitterImageUrl: text('twitter_image_url'),
  canonicalUrl: text('canonical_url'),
  metaRobots: varchar('meta_robots', { length: 50 }).default('index, follow'),
  updatedBy: integer('updated_by').references(() => users.id),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 50 }).notNull(), // 'coaching' or 'entrepreneur-circle'
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  socialHandle: varchar('social_handle', { length: 255 }).notNull(),
  interest: text('interest').notNull(),
  experiences: text('experiences').notNull(),
  growthAreas: text('growth_areas').notNull(),
  obstacles: text('obstacles').notNull(),
  willingToInvest: varchar('willing_to_invest', { length: 10 }).notNull(),
  additionalInfo: text('additional_info'),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending', 'approved', 'rejected'
  notes: text('notes'), // Admin notes
  reviewedBy: integer('reviewed_by').references(() => users.id),
  reviewedAt: timestamp('reviewed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const linkSettings = pgTable('link_settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(), // 'discovery_call', 'strategy_session', etc.
  label: varchar('label', { length: 255 }).notNull(), // Display label
  url: text('url').notNull(),
  updatedBy: integer('updated_by').references(() => users.id),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const mcpApiKeys = pgTable('mcp_api_keys', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(), // Friendly name for the key
  keyHash: text('key_hash').notNull(), // Hashed API key
  keyPrefix: varchar('key_prefix', { length: 10 }).notNull(), // First 8 chars for identification
  permissions: jsonb('permissions').notNull().default('{"blog": ["read", "write"]}'), // Granular permissions
  lastUsedAt: timestamp('last_used_at'),
  expiresAt: timestamp('expires_at'), // Optional expiration
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Make Money from Coding API Integration
export const mmfcApiKeys = pgTable('mmfc_api_keys', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(), // Friendly name (e.g., "Personal Account", "Business Account")
  apiKey: text('api_key').notNull(), // Encrypted API key
  baseUrl: varchar('base_url', { length: 500 }).notNull().default('https://makemoneyfromcoding.com'),
  autoSync: boolean('auto_sync').notNull().default(false),
  syncFrequency: varchar('sync_frequency', { length: 20 }).default('daily'), // daily, weekly, manual
  lastSyncAt: timestamp('last_sync_at'),
  lastSyncStatus: varchar('last_sync_status', { length: 20 }), // success, error
  lastSyncError: text('last_sync_error'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Synced products from MMFC
export const mmfcProducts = pgTable('mmfc_products', {
  id: serial('id').primaryKey(),
  apiKeyId: integer('api_key_id')
    .notNull()
    .references(() => mmfcApiKeys.id),
  externalId: integer('external_id').notNull(), // Product ID from MMFC
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull(),
  description: text('description'),
  pricingType: varchar('pricing_type', { length: 50 }), // free, one_time, subscription
  price: varchar('price', { length: 20 }), // Stored as string to preserve decimal precision
  salePrice: varchar('sale_price', { length: 20 }),
  deliveryType: varchar('delivery_type', { length: 50 }),
  coverImage: text('cover_image'),
  featuredImageUrl: text('featured_image_url'),
  featuredImageAlt: varchar('featured_image_alt', { length: 500 }),
  images: jsonb('images'), // Array of image objects
  videoUrl: text('video_url'),
  hasFiles: boolean('has_files').notNull().default(false),
  fileCount: integer('file_count').notNull().default(0),
  hasRepository: boolean('has_repository').notNull().default(false),
  checkoutUrl: text('checkout_url'), // Direct link to MMFC checkout
  isVisible: boolean('is_visible').notNull().default(true), // Can be hidden by admin
  syncedAt: timestamp('synced_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Synced scheduling links from MMFC
export const mmfcSchedulingLinks = pgTable('mmfc_scheduling_links', {
  id: serial('id').primaryKey(),
  apiKeyId: integer('api_key_id')
    .notNull()
    .references(() => mmfcApiKeys.id),
  externalId: integer('external_id').notNull(), // Scheduling link ID from MMFC
  slug: varchar('slug', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  durationMinutes: integer('duration_minutes').notNull(),
  bookingUrl: text('booking_url').notNull(),
  maxAdvanceBookingDays: integer('max_advance_booking_days'),
  minNoticeMinutes: integer('min_notice_minutes'),
  isEnabled: boolean('is_enabled').notNull().default(true), // Can be disabled on this site
  syncedAt: timestamp('synced_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueApiKeyExternal: unique('mmfc_scheduling_links_api_key_id_external_id_key').on(table.apiKeyId, table.externalId),
}));

export const mmfcServices = pgTable('mmfc_services', {
  id: serial('id').primaryKey(),
  apiKeyId: integer('api_key_id')
    .notNull()
    .references(() => mmfcApiKeys.id, { onDelete: 'cascade' }),
  externalId: integer('external_id').notNull(), // Service ID from MMFC
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  url: text('url'), // Full URL to service page on MMFC
  description: text('description'),
  pricingType: varchar('pricing_type', { length: 50 }), // 'hourly' or 'project'
  price: decimal('price', { precision: 10, scale: 2 }),
  salePrice: decimal('sale_price', { precision: 10, scale: 2 }),
  featuredImageUrl: text('featured_image_url'),
  coverImage: text('cover_image'),
  isVisible: boolean('is_visible').notNull().default(true), // Can be disabled on this site
  syncedAt: timestamp('synced_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueApiKeyExternal: unique('mmfc_services_api_key_id_external_id_key').on(table.apiKeyId, table.externalId),
}));

export const analyticsSettings = pgTable('analytics_settings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id)
    .unique(), // One settings record per user
  googleAnalyticsId: varchar('google_analytics_id', { length: 255 }),
  googleTagManagerId: varchar('google_tag_manager_id', { length: 255 }),
  plausibleDomain: varchar('plausible_domain', { length: 255 }),
  plausibleApiKey: text('plausible_api_key'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Notion Products - synced from Notion database
export const notionProducts = pgTable('notion_products', {
  id: serial('id').primaryKey(),
  notionPageId: varchar('notion_page_id', { length: 100 }).notNull().unique(),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull().unique(),
  description: text('description'),
  content: text('content'), // Full markdown content from Notion
  excerpt: text('excerpt'),
  price: varchar('price', { length: 50 }), // Price as string to handle "Free", "$29", etc.
  salePrice: varchar('sale_price', { length: 50 }),
  productType: varchar('product_type', { length: 100 }), // template, course, ebook, etc.
  category: varchar('category', { length: 100 }),
  coverImageUrl: text('cover_image_url'),
  checkoutUrl: text('checkout_url'), // Link to purchase
  previewUrl: text('preview_url'), // Link to preview/demo
  isPublished: boolean('is_published').default(false),
  isFeatured: boolean('is_featured').default(false),
  displayOrder: integer('display_order').default(0),
  createdBy: integer('created_by')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  teamMembers: many(teamMembers),
  activityLogs: many(activityLogs),
  invitations: many(invitations),
}));

export const usersRelations = relations(users, ({ many }) => ({
  teamMembers: many(teamMembers),
  invitationsSent: many(invitations),
  blogPosts: many(blogPosts),
  mcpApiKeys: many(mcpApiKeys),
  mmfcApiKeys: many(mmfcApiKeys),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  team: one(teams, {
    fields: [invitations.teamId],
    references: [teams.id],
  }),
  invitedBy: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  team: one(teams, {
    fields: [activityLogs.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  createdBy: one(users, {
    fields: [blogPosts.createdBy],
    references: [users.id],
  }),
}));

export const mcpApiKeysRelations = relations(mcpApiKeys, ({ one }) => ({
  user: one(users, {
    fields: [mcpApiKeys.userId],
    references: [users.id],
  }),
}));

export const mmfcApiKeysRelations = relations(mmfcApiKeys, ({ one, many }) => ({
  user: one(users, {
    fields: [mmfcApiKeys.userId],
    references: [users.id],
  }),
  products: many(mmfcProducts),
  schedulingLinks: many(mmfcSchedulingLinks),
}));

export const mmfcProductsRelations = relations(mmfcProducts, ({ one }) => ({
  apiKey: one(mmfcApiKeys, {
    fields: [mmfcProducts.apiKeyId],
    references: [mmfcApiKeys.id],
  }),
}));

export const mmfcSchedulingLinksRelations = relations(mmfcSchedulingLinks, ({ one }) => ({
  apiKey: one(mmfcApiKeys, {
    fields: [mmfcSchedulingLinks.apiKeyId],
    references: [mmfcApiKeys.id],
  }),
}));

export const mmfcServicesRelations = relations(mmfcServices, ({ one }) => ({
  apiKey: one(mmfcApiKeys, {
    fields: [mmfcServices.apiKeyId],
    references: [mmfcApiKeys.id],
  }),
}));

export const notionProductsRelations = relations(notionProducts, ({ one }) => ({
  createdBy: one(users, {
    fields: [notionProducts.createdBy],
    references: [users.id],
  }),
}));

// Dashboard Products - Products created directly in dashboard with Stripe integration
export const dashboardProducts = pgTable('dashboard_products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  shortDescription: text('short_description'),
  coverImageUrl: text('cover_image_url'),
  productType: varchar('product_type', { length: 20 }).notNull().default('one_time'), // 'one_time' | 'subscription'
  priceInCents: integer('price_in_cents').notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('usd'),
  yearlyPriceInCents: integer('yearly_price_in_cents'), // For subscriptions with yearly option
  stripeProductId: varchar('stripe_product_id', { length: 255 }),
  stripePriceId: varchar('stripe_price_id', { length: 255 }),
  stripeYearlyPriceId: varchar('stripe_yearly_price_id', { length: 255 }),
  stripeSyncedAt: timestamp('stripe_synced_at'),
  deliveryType: varchar('delivery_type', { length: 20 }).notNull().default('download'), // 'download' | 'access' | 'email'
  downloadUrl: text('download_url'),
  accessInstructions: text('access_instructions'),
  // SEO / Open Graph fields
  seoTitle: varchar('seo_title', { length: 70 }), // Optimal 50-60 chars for search
  seoDescription: varchar('seo_description', { length: 160 }), // Optimal 150-160 chars for search
  ogTitle: varchar('og_title', { length: 95 }), // Social media title
  ogDescription: text('og_description'), // Social media description
  ogImageUrl: text('og_image_url'), // Social media share image (1200x630 recommended)
  isPublished: boolean('is_published').default(false),
  isFeatured: boolean('is_featured').default(false),
  displayOrder: integer('display_order').default(0),
  createdBy: integer('created_by')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Product Upsells - Junction table for upsell relationships
export const productUpsells = pgTable('product_upsells', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .notNull()
    .references(() => dashboardProducts.id, { onDelete: 'cascade' }),
  upsellProductId: integer('upsell_product_id')
    .notNull()
    .references(() => dashboardProducts.id, { onDelete: 'cascade' }),
  displayOrder: integer('display_order').default(0),
  discountPercent: integer('discount_percent'), // Optional discount for upsell
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  uniqueUpsell: unique('product_upsells_product_upsell_key').on(table.productId, table.upsellProductId),
}));

// Purchases - Track customer purchases
export const purchases = pgTable('purchases', {
  id: serial('id').primaryKey(),
  customerEmail: varchar('customer_email', { length: 255 }).notNull(),
  customerName: varchar('customer_name', { length: 255 }),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  productId: integer('product_id')
    .notNull()
    .references(() => dashboardProducts.id),
  amountPaidCents: integer('amount_paid_cents').notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('usd'),
  billingInterval: varchar('billing_interval', { length: 10 }), // 'month' | 'year' for subscriptions
  status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending' | 'completed' | 'failed' | 'refunded'
  deliveryEmailSentAt: timestamp('delivery_email_sent_at'),
  accessGrantedAt: timestamp('access_granted_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Purchase Items - Individual items in a purchase (for upsells)
export const purchaseItems = pgTable('purchase_items', {
  id: serial('id').primaryKey(),
  purchaseId: integer('purchase_id')
    .notNull()
    .references(() => purchases.id, { onDelete: 'cascade' }),
  productId: integer('product_id')
    .notNull()
    .references(() => dashboardProducts.id),
  priceAtPurchaseCents: integer('price_at_purchase_cents').notNull(),
  isUpsell: boolean('is_upsell').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Relations for Dashboard Products
export const dashboardProductsRelations = relations(dashboardProducts, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [dashboardProducts.createdBy],
    references: [users.id],
  }),
  upsells: many(productUpsells, { relationName: 'productUpsells' }),
  upsellFor: many(productUpsells, { relationName: 'upsellProducts' }),
  purchases: many(purchases),
  purchaseItems: many(purchaseItems),
}));

export const productUpsellsRelations = relations(productUpsells, ({ one }) => ({
  product: one(dashboardProducts, {
    fields: [productUpsells.productId],
    references: [dashboardProducts.id],
    relationName: 'productUpsells',
  }),
  upsellProduct: one(dashboardProducts, {
    fields: [productUpsells.upsellProductId],
    references: [dashboardProducts.id],
    relationName: 'upsellProducts',
  }),
}));

export const purchasesRelations = relations(purchases, ({ one, many }) => ({
  product: one(dashboardProducts, {
    fields: [purchases.productId],
    references: [dashboardProducts.id],
  }),
  items: many(purchaseItems),
}));

export const purchaseItemsRelations = relations(purchaseItems, ({ one }) => ({
  purchase: one(purchases, {
    fields: [purchaseItems.purchaseId],
    references: [purchases.id],
  }),
  product: one(dashboardProducts, {
    fields: [purchaseItems.productId],
    references: [dashboardProducts.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type TeamDataWithMembers = Team & {
  teamMembers: (TeamMember & {
    user: Pick<User, 'id' | 'name' | 'email'>;
  })[];
};
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type SeoSettings = typeof seoSettings.$inferSelect;
export type NewSeoSettings = typeof seoSettings.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type LinkSettings = typeof linkSettings.$inferSelect;
export type NewLinkSettings = typeof linkSettings.$inferInsert;
export type McpApiKey = typeof mcpApiKeys.$inferSelect;
export type NewMcpApiKey = typeof mcpApiKeys.$inferInsert;
export type MmfcApiKey = typeof mmfcApiKeys.$inferSelect;
export type NewMmfcApiKey = typeof mmfcApiKeys.$inferInsert;
export type MmfcProduct = typeof mmfcProducts.$inferSelect;
export type NewMmfcProduct = typeof mmfcProducts.$inferInsert;
export type MmfcSchedulingLink = typeof mmfcSchedulingLinks.$inferSelect;
export type NewMmfcSchedulingLink = typeof mmfcSchedulingLinks.$inferInsert;
export type MmfcService = typeof mmfcServices.$inferSelect;
export type NewMmfcService = typeof mmfcServices.$inferInsert;
export type AnalyticsSettings = typeof analyticsSettings.$inferSelect;
export type NewAnalyticsSettings = typeof analyticsSettings.$inferInsert;
export type NotionProduct = typeof notionProducts.$inferSelect;
export type NewNotionProduct = typeof notionProducts.$inferInsert;
export type DashboardProduct = typeof dashboardProducts.$inferSelect;
export type NewDashboardProduct = typeof dashboardProducts.$inferInsert;
export type ProductUpsell = typeof productUpsells.$inferSelect;
export type NewProductUpsell = typeof productUpsells.$inferInsert;
export type Purchase = typeof purchases.$inferSelect;
export type NewPurchase = typeof purchases.$inferInsert;
export type PurchaseItem = typeof purchaseItems.$inferSelect;
export type NewPurchaseItem = typeof purchaseItems.$inferInsert;

// Leads - Capture name/email for free product downloads
export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  productSlug: varchar('product_slug', { length: 500 }).notNull(), // Which free product they claimed
  productName: varchar('product_name', { length: 500 }).notNull(),
  source: varchar('source', { length: 50 }).default('free_product'), // 'free_product', 'newsletter', etc.
  deliveryEmailSentAt: timestamp('delivery_email_sent_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

// =============================================
// EDUCATION PLATFORM TABLES (Studio Systems)
// =============================================

// User Profiles - Extended user data for education/membership
export const userProfiles = pgTable('user_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id)
    .unique(),
  displayName: varchar('display_name', { length: 100 }),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  points: integer('points').notNull().default(0),
  streak: integer('streak').notNull().default(0),
  lastActivityAt: timestamp('last_activity_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Courses
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  shortDescription: text('short_description'),
  coverImageUrl: text('cover_image_url'),
  difficulty: varchar('difficulty', { length: 20 }).default('beginner'), // beginner, intermediate, advanced
  estimatedMinutes: integer('estimated_minutes'),
  isPublished: boolean('is_published').default(false),
  isFeatured: boolean('is_featured').default(false),
  requiredSubscriptionTier: varchar('required_subscription_tier', { length: 50 }), // null = free, 'member' = paid members only
  displayOrder: integer('display_order').default(0),
  createdBy: integer('created_by')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Course Modules (sections within a course)
export const courseModules = pgTable('course_modules', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id')
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Lessons
export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  moduleId: integer('module_id')
    .notNull()
    .references(() => courseModules.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  content: text('content'), // Markdown/HTML content
  videoUrl: text('video_url'), // YouTube, Vimeo, or direct URL
  videoDurationMinutes: integer('video_duration_minutes'),
  lessonType: varchar('lesson_type', { length: 20 }).default('video'), // video, text, quiz
  displayOrder: integer('display_order').notNull().default(0),
  isPreview: boolean('is_preview').default(false), // Free preview lesson
  pointsReward: integer('points_reward').default(10),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Enrollments (user enrolled in course)
export const enrollments = pgTable('enrollments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  courseId: integer('course_id')
    .notNull()
    .references(() => courses.id),
  enrolledAt: timestamp('enrolled_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  progressPercent: integer('progress_percent').default(0),
}, (table) => ({
  uniqueEnrollment: unique('enrollments_user_course_key').on(table.userId, table.courseId),
}));

// Lesson Completions (track which lessons user completed)
export const lessonCompletions = pgTable('lesson_completions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  lessonId: integer('lesson_id')
    .notNull()
    .references(() => lessons.id),
  completedAt: timestamp('completed_at').notNull().defaultNow(),
  timeSpentMinutes: integer('time_spent_minutes'),
  pointsAwarded: integer('points_awarded').default(0),
}, (table) => ({
  uniqueCompletion: unique('lesson_completions_user_lesson_key').on(table.userId, table.lessonId),
}));

// Community Posts
export const communityPosts = pgTable('community_posts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  title: varchar('title', { length: 255 }),
  content: text('content').notNull(),
  postType: varchar('post_type', { length: 20 }).default('discussion'), // discussion, question, win, resource
  courseId: integer('course_id').references(() => courses.id), // Optional course context
  isPinned: boolean('is_pinned').default(false),
  likesCount: integer('likes_count').default(0),
  commentsCount: integer('comments_count').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Post Comments
export const postComments = pgTable('post_comments', {
  id: serial('id').primaryKey(),
  postId: integer('post_id')
    .notNull()
    .references(() => communityPosts.id, { onDelete: 'cascade' }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  content: text('content').notNull(),
  parentId: integer('parent_id'), // For nested/threaded comments
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Post Likes
export const postLikes = pgTable('post_likes', {
  id: serial('id').primaryKey(),
  postId: integer('post_id')
    .notNull()
    .references(() => communityPosts.id, { onDelete: 'cascade' }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  uniqueLike: unique('post_likes_post_user_key').on(table.postId, table.userId),
}));

// Achievements
export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  iconUrl: text('icon_url'),
  pointsValue: integer('points_value').default(0),
  triggerType: varchar('trigger_type', { length: 50 }).notNull(), // lessons_completed, courses_completed, posts_created, streak_days
  triggerValue: integer('trigger_value'), // e.g., 5 lessons, 1 course, 7 day streak
  isSecret: boolean('is_secret').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// User Achievements (earned badges)
export const userAchievements = pgTable('user_achievements', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  achievementId: integer('achievement_id')
    .notNull()
    .references(() => achievements.id),
  earnedAt: timestamp('earned_at').notNull().defaultNow(),
}, (table) => ({
  uniqueUserAchievement: unique('user_achievements_user_achievement_key').on(table.userId, table.achievementId),
}));

// Points Transactions (audit log for points)
export const pointsTransactions = pgTable('points_transactions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  amount: integer('amount').notNull(), // Positive for earned, negative for spent
  reason: varchar('reason', { length: 100 }).notNull(), // lesson_complete, course_complete, post_created, comment_created, achievement_earned
  referenceType: varchar('reference_type', { length: 50 }), // lesson, course, post, comment, achievement
  referenceId: integer('reference_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Education Subscriptions (Studio Systems membership)
export const educationSubscriptions = pgTable('education_subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id)
    .unique(),
  tier: varchar('tier', { length: 50 }).notNull(), // 'monthly', 'yearly', 'lifetime', 'earlyBird_monthly', 'earlyBird_yearly'
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, canceled, past_due, trialing
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// =============================================
// EDUCATION PLATFORM RELATIONS
// =============================================

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [courses.createdBy],
    references: [users.id],
  }),
  modules: many(courseModules),
  enrollments: many(enrollments),
  communityPosts: many(communityPosts),
}));

export const courseModulesRelations = relations(courseModules, ({ one, many }) => ({
  course: one(courses, {
    fields: [courseModules.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(courseModules, {
    fields: [lessons.moduleId],
    references: [courseModules.id],
  }),
  completions: many(lessonCompletions),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

export const lessonCompletionsRelations = relations(lessonCompletions, ({ one }) => ({
  user: one(users, {
    fields: [lessonCompletions.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [lessonCompletions.lessonId],
    references: [lessons.id],
  }),
}));

export const communityPostsRelations = relations(communityPosts, ({ one, many }) => ({
  user: one(users, {
    fields: [communityPosts.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [communityPosts.courseId],
    references: [courses.id],
  }),
  comments: many(postComments),
  likes: many(postLikes),
}));

export const postCommentsRelations = relations(postComments, ({ one, many }) => ({
  post: one(communityPosts, {
    fields: [postComments.postId],
    references: [communityPosts.id],
  }),
  user: one(users, {
    fields: [postComments.userId],
    references: [users.id],
  }),
  parent: one(postComments, {
    fields: [postComments.parentId],
    references: [postComments.id],
    relationName: 'commentReplies',
  }),
  replies: many(postComments, { relationName: 'commentReplies' }),
}));

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  post: one(communityPosts, {
    fields: [postLikes.postId],
    references: [communityPosts.id],
  }),
  user: one(users, {
    fields: [postLikes.userId],
    references: [users.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

export const pointsTransactionsRelations = relations(pointsTransactions, ({ one }) => ({
  user: one(users, {
    fields: [pointsTransactions.userId],
    references: [users.id],
  }),
}));

export const educationSubscriptionsRelations = relations(educationSubscriptions, ({ one }) => ({
  user: one(users, {
    fields: [educationSubscriptions.userId],
    references: [users.id],
  }),
}));

// =============================================
// EDUCATION PLATFORM TYPE EXPORTS
// =============================================

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;
export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
export type CourseModule = typeof courseModules.$inferSelect;
export type NewCourseModule = typeof courseModules.$inferInsert;
export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;
export type Enrollment = typeof enrollments.$inferSelect;
export type NewEnrollment = typeof enrollments.$inferInsert;
export type LessonCompletion = typeof lessonCompletions.$inferSelect;
export type NewLessonCompletion = typeof lessonCompletions.$inferInsert;
export type CommunityPost = typeof communityPosts.$inferSelect;
export type NewCommunityPost = typeof communityPosts.$inferInsert;
export type PostComment = typeof postComments.$inferSelect;
export type NewPostComment = typeof postComments.$inferInsert;
export type PostLike = typeof postLikes.$inferSelect;
export type NewPostLike = typeof postLikes.$inferInsert;
export type Achievement = typeof achievements.$inferSelect;
export type NewAchievement = typeof achievements.$inferInsert;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type NewUserAchievement = typeof userAchievements.$inferInsert;
export type PointsTransaction = typeof pointsTransactions.$inferSelect;
export type NewPointsTransaction = typeof pointsTransactions.$inferInsert;
export type EducationSubscription = typeof educationSubscriptions.$inferSelect;
export type NewEducationSubscription = typeof educationSubscriptions.$inferInsert;

// =============================================
// RESOURCES (Templates, Guides, Materials)
// =============================================

export const resources = pgTable('resources', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  content: text('content'), // Full content/instructions
  category: varchar('category', { length: 50 }).notNull(), // templates, guides, tech-packs, mood-boards, patterns, general
  thumbnailUrl: text('thumbnail_url'),
  downloadUrl: text('download_url'), // Direct download link
  notionUrl: text('notion_url'), // Link to Notion page if applicable
  fileType: varchar('file_type', { length: 50 }), // pdf, xlsx, docx, notion, etc.
  isPublished: boolean('is_published').default(false),
  isFeatured: boolean('is_featured').default(false),
  requiredSubscriptionTier: varchar('required_subscription_tier', { length: 50 }), // null = free, 'member' = paid only
  displayOrder: integer('display_order').default(0),
  downloadCount: integer('download_count').default(0),
  createdBy: integer('created_by')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const resourcesRelations = relations(resources, ({ one }) => ({
  createdBy: one(users, {
    fields: [resources.createdBy],
    references: [users.id],
  }),
}));

export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  CREATE_TEAM = 'CREATE_TEAM',
  REMOVE_TEAM_MEMBER = 'REMOVE_TEAM_MEMBER',
  INVITE_TEAM_MEMBER = 'INVITE_TEAM_MEMBER',
  ACCEPT_INVITATION = 'ACCEPT_INVITATION',
}
