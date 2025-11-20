import { pgTable, unique, serial, varchar, timestamp, text, foreignKey, integer, boolean, jsonb, numeric } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const teams = pgTable("teams", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	stripeCustomerId: text("stripe_customer_id"),
	stripeSubscriptionId: text("stripe_subscription_id"),
	stripeProductId: text("stripe_product_id"),
	planName: varchar("plan_name", { length: 50 }),
	subscriptionStatus: varchar("subscription_status", { length: 20 }),
}, (table) => [
	unique("teams_stripe_customer_id_unique").on(table.stripeCustomerId),
	unique("teams_stripe_subscription_id_unique").on(table.stripeSubscriptionId),
]);

export const activityLogs = pgTable("activity_logs", {
	id: serial().primaryKey().notNull(),
	teamId: integer("team_id").notNull(),
	userId: integer("user_id"),
	action: text().notNull(),
	timestamp: timestamp({ mode: 'string' }).defaultNow().notNull(),
	ipAddress: varchar("ip_address", { length: 45 }),
}, (table) => [
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.id],
			name: "activity_logs_team_id_teams_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "activity_logs_user_id_users_id_fk"
		}),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }),
	email: varchar({ length: 255 }).notNull(),
	passwordHash: text("password_hash").notNull(),
	role: varchar({ length: 20 }).default('member').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const invitations = pgTable("invitations", {
	id: serial().primaryKey().notNull(),
	teamId: integer("team_id").notNull(),
	email: varchar({ length: 255 }).notNull(),
	role: varchar({ length: 50 }).notNull(),
	invitedBy: integer("invited_by").notNull(),
	invitedAt: timestamp("invited_at", { mode: 'string' }).defaultNow().notNull(),
	status: varchar({ length: 20 }).default('pending').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.id],
			name: "invitations_team_id_teams_id_fk"
		}),
	foreignKey({
			columns: [table.invitedBy],
			foreignColumns: [users.id],
			name: "invitations_invited_by_users_id_fk"
		}),
]);

export const teamMembers = pgTable("team_members", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	teamId: integer("team_id").notNull(),
	role: varchar({ length: 50 }).notNull(),
	joinedAt: timestamp("joined_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "team_members_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.id],
			name: "team_members_team_id_teams_id_fk"
		}),
]);

export const blogPosts = pgTable("blog_posts", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	author: varchar({ length: 100 }).notNull(),
	excerpt: text(),
	content: text().notNull(),
	coverImageUrl: text("cover_image_url"),
	ogImageUrl: text("og_image_url"),
	ogTitle: varchar("og_title", { length: 255 }),
	ogDescription: text("og_description"),
	metaTitle: varchar("meta_title", { length: 60 }),
	metaDescription: varchar("meta_description", { length: 160 }),
	metaKeywords: text("meta_keywords"),
	focusKeyword: varchar("focus_keyword", { length: 100 }),
	canonicalUrl: text("canonical_url"),
	metaRobots: varchar("meta_robots", { length: 50 }).default('index, follow'),
	articleType: varchar("article_type", { length: 50 }).default('BlogPosting'),
	industry: varchar({ length: 100 }),
	targetAudience: text("target_audience"),
	keyConcepts: text("key_concepts"),
	publishedAt: timestamp("published_at", { mode: 'string' }),
	isPublished: boolean("is_published").default(false),
	readingTimeMinutes: integer("reading_time_minutes"),
	createdBy: integer("created_by").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	contentJson: jsonb("content_json"),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "blog_posts_created_by_users_id_fk"
		}),
	unique("blog_posts_slug_unique").on(table.slug),
]);

export const seoSettings = pgTable("seo_settings", {
	id: serial().primaryKey().notNull(),
	page: varchar({ length: 50 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	keywords: text(),
	ogTitle: varchar("og_title", { length: 255 }),
	ogDescription: text("og_description"),
	ogImageUrl: text("og_image_url"),
	ogType: varchar("og_type", { length: 50 }).default('website'),
	twitterCard: varchar("twitter_card", { length: 50 }).default('summary_large_image'),
	twitterTitle: varchar("twitter_title", { length: 255 }),
	twitterDescription: text("twitter_description"),
	twitterImageUrl: text("twitter_image_url"),
	canonicalUrl: text("canonical_url"),
	metaRobots: varchar("meta_robots", { length: 50 }).default('index, follow'),
	updatedBy: integer("updated_by"),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [users.id],
			name: "seo_settings_updated_by_users_id_fk"
		}),
	unique("seo_settings_page_unique").on(table.page),
]);

export const applications = pgTable("applications", {
	id: serial().primaryKey().notNull(),
	type: varchar({ length: 50 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 50 }).notNull(),
	socialHandle: varchar("social_handle", { length: 255 }).notNull(),
	interest: text().notNull(),
	experiences: text().notNull(),
	growthAreas: text("growth_areas").notNull(),
	obstacles: text().notNull(),
	willingToInvest: varchar("willing_to_invest", { length: 10 }).notNull(),
	additionalInfo: text("additional_info"),
	status: varchar({ length: 20 }).default('pending').notNull(),
	notes: text(),
	reviewedBy: integer("reviewed_by"),
	reviewedAt: timestamp("reviewed_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.reviewedBy],
			foreignColumns: [users.id],
			name: "applications_reviewed_by_users_id_fk"
		}),
]);

export const linkSettings = pgTable("link_settings", {
	id: serial().primaryKey().notNull(),
	key: varchar({ length: 100 }).notNull(),
	label: varchar({ length: 255 }).notNull(),
	url: text().notNull(),
	updatedBy: integer("updated_by"),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [users.id],
			name: "link_settings_updated_by_users_id_fk"
		}),
	unique("link_settings_key_unique").on(table.key),
]);

export const mcpApiKeys = pgTable("mcp_api_keys", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	keyHash: text("key_hash").notNull(),
	keyPrefix: varchar("key_prefix", { length: 10 }).notNull(),
	permissions: jsonb().default({"blog":["read","write"]}).notNull(),
	lastUsedAt: timestamp("last_used_at", { mode: 'string' }),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "mcp_api_keys_user_id_users_id_fk"
		}),
]);

export const mmfcApiKeys = pgTable("mmfc_api_keys", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	apiKey: text("api_key").notNull(),
	baseUrl: varchar("base_url", { length: 500 }).default('https://makemoneyfromcoding.com').notNull(),
	autoSync: boolean("auto_sync").default(false).notNull(),
	syncFrequency: varchar("sync_frequency", { length: 20 }).default('daily'),
	lastSyncAt: timestamp("last_sync_at", { mode: 'string' }),
	lastSyncStatus: varchar("last_sync_status", { length: 20 }),
	lastSyncError: text("last_sync_error"),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "mmfc_api_keys_user_id_users_id_fk"
		}),
]);

export const mmfcProducts = pgTable("mmfc_products", {
	id: serial().primaryKey().notNull(),
	apiKeyId: integer("api_key_id").notNull(),
	externalId: integer("external_id").notNull(),
	title: varchar({ length: 500 }).notNull(),
	slug: varchar({ length: 500 }).notNull(),
	description: text(),
	pricingType: varchar("pricing_type", { length: 50 }),
	price: varchar({ length: 20 }),
	salePrice: varchar("sale_price", { length: 20 }),
	deliveryType: varchar("delivery_type", { length: 50 }),
	coverImage: text("cover_image"),
	featuredImageUrl: text("featured_image_url"),
	featuredImageAlt: varchar("featured_image_alt", { length: 500 }),
	images: jsonb(),
	videoUrl: text("video_url"),
	hasFiles: boolean("has_files").default(false).notNull(),
	fileCount: integer("file_count").default(0).notNull(),
	hasRepository: boolean("has_repository").default(false).notNull(),
	checkoutUrl: text("checkout_url"),
	isVisible: boolean("is_visible").default(true).notNull(),
	syncedAt: timestamp("synced_at", { mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.apiKeyId],
			foreignColumns: [mmfcApiKeys.id],
			name: "mmfc_products_api_key_id_mmfc_api_keys_id_fk"
		}),
]);

export const analyticsSettings = pgTable("analytics_settings", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	googleAnalyticsId: varchar("google_analytics_id", { length: 255 }),
	googleTagManagerId: varchar("google_tag_manager_id", { length: 255 }),
	plausibleDomain: varchar("plausible_domain", { length: 255 }),
	plausibleApiKey: text("plausible_api_key"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "analytics_settings_user_id_users_id_fk"
		}),
	unique("analytics_settings_user_id_unique").on(table.userId),
]);

export const mmfcSchedulingLinks = pgTable("mmfc_scheduling_links", {
	id: serial().primaryKey().notNull(),
	apiKeyId: integer("api_key_id").notNull(),
	externalId: integer("external_id").notNull(),
	slug: varchar({ length: 100 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	durationMinutes: integer("duration_minutes").notNull(),
	bookingUrl: text("booking_url").notNull(),
	maxAdvanceBookingDays: integer("max_advance_booking_days"),
	minNoticeMinutes: integer("min_notice_minutes"),
	isEnabled: boolean("is_enabled").default(true).notNull(),
	syncedAt: timestamp("synced_at", { mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.apiKeyId],
			foreignColumns: [mmfcApiKeys.id],
			name: "mmfc_scheduling_links_api_key_id_mmfc_api_keys_id_fk"
		}),
]);

export const mmfcServices = pgTable("mmfc_services", {
	id: serial().primaryKey().notNull(),
	apiKeyId: integer("api_key_id").notNull(),
	externalId: integer("external_id").notNull(),
	title: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	description: text(),
	price: numeric({ precision: 10, scale:  2 }),
	salePrice: numeric("sale_price", { precision: 10, scale:  2 }),
	featuredImageUrl: text("featured_image_url"),
	coverImage: text("cover_image"),
	isVisible: boolean("is_visible").default(true).notNull(),
	syncedAt: timestamp("synced_at", { mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	url: text(),
	pricingType: varchar("pricing_type", { length: 50 }),
}, (table) => [
	foreignKey({
			columns: [table.apiKeyId],
			foreignColumns: [mmfcApiKeys.id],
			name: "mmfc_services_api_key_id_mmfc_api_keys_id_fk"
		}).onDelete("cascade"),
	unique("mmfc_services_api_key_id_external_id_key").on(table.apiKeyId, table.externalId),
]);
