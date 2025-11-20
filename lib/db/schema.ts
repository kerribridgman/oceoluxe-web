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
});

export const mmfcServices = pgTable('mmfc_services', {
  id: serial('id').primaryKey(),
  apiKeyId: integer('api_key_id')
    .notNull()
    .references(() => mmfcApiKeys.id, { onDelete: 'cascade' }),
  externalId: integer('external_id').notNull(), // Service ID from MMFC
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
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
