import { relations } from "drizzle-orm/relations";
import { teams, activityLogs, users, invitations, teamMembers, blogPosts, seoSettings, applications, linkSettings, mcpApiKeys, mmfcApiKeys, mmfcProducts, analyticsSettings, mmfcSchedulingLinks, mmfcServices } from "./schema";

export const activityLogsRelations = relations(activityLogs, ({one}) => ({
	team: one(teams, {
		fields: [activityLogs.teamId],
		references: [teams.id]
	}),
	user: one(users, {
		fields: [activityLogs.userId],
		references: [users.id]
	}),
}));

export const teamsRelations = relations(teams, ({many}) => ({
	activityLogs: many(activityLogs),
	invitations: many(invitations),
	teamMembers: many(teamMembers),
}));

export const usersRelations = relations(users, ({many}) => ({
	activityLogs: many(activityLogs),
	invitations: many(invitations),
	teamMembers: many(teamMembers),
	blogPosts: many(blogPosts),
	seoSettings: many(seoSettings),
	applications: many(applications),
	linkSettings: many(linkSettings),
	mcpApiKeys: many(mcpApiKeys),
	mmfcApiKeys: many(mmfcApiKeys),
	analyticsSettings: many(analyticsSettings),
}));

export const invitationsRelations = relations(invitations, ({one}) => ({
	team: one(teams, {
		fields: [invitations.teamId],
		references: [teams.id]
	}),
	user: one(users, {
		fields: [invitations.invitedBy],
		references: [users.id]
	}),
}));

export const teamMembersRelations = relations(teamMembers, ({one}) => ({
	user: one(users, {
		fields: [teamMembers.userId],
		references: [users.id]
	}),
	team: one(teams, {
		fields: [teamMembers.teamId],
		references: [teams.id]
	}),
}));

export const blogPostsRelations = relations(blogPosts, ({one}) => ({
	user: one(users, {
		fields: [blogPosts.createdBy],
		references: [users.id]
	}),
}));

export const seoSettingsRelations = relations(seoSettings, ({one}) => ({
	user: one(users, {
		fields: [seoSettings.updatedBy],
		references: [users.id]
	}),
}));

export const applicationsRelations = relations(applications, ({one}) => ({
	user: one(users, {
		fields: [applications.reviewedBy],
		references: [users.id]
	}),
}));

export const linkSettingsRelations = relations(linkSettings, ({one}) => ({
	user: one(users, {
		fields: [linkSettings.updatedBy],
		references: [users.id]
	}),
}));

export const mcpApiKeysRelations = relations(mcpApiKeys, ({one}) => ({
	user: one(users, {
		fields: [mcpApiKeys.userId],
		references: [users.id]
	}),
}));

export const mmfcApiKeysRelations = relations(mmfcApiKeys, ({one, many}) => ({
	user: one(users, {
		fields: [mmfcApiKeys.userId],
		references: [users.id]
	}),
	mmfcProducts: many(mmfcProducts),
	mmfcSchedulingLinks: many(mmfcSchedulingLinks),
	mmfcServices: many(mmfcServices),
}));

export const mmfcProductsRelations = relations(mmfcProducts, ({one}) => ({
	mmfcApiKey: one(mmfcApiKeys, {
		fields: [mmfcProducts.apiKeyId],
		references: [mmfcApiKeys.id]
	}),
}));

export const analyticsSettingsRelations = relations(analyticsSettings, ({one}) => ({
	user: one(users, {
		fields: [analyticsSettings.userId],
		references: [users.id]
	}),
}));

export const mmfcSchedulingLinksRelations = relations(mmfcSchedulingLinks, ({one}) => ({
	mmfcApiKey: one(mmfcApiKeys, {
		fields: [mmfcSchedulingLinks.apiKeyId],
		references: [mmfcApiKeys.id]
	}),
}));

export const mmfcServicesRelations = relations(mmfcServices, ({one}) => ({
	mmfcApiKey: one(mmfcApiKeys, {
		fields: [mmfcServices.apiKeyId],
		references: [mmfcApiKeys.id]
	}),
}));