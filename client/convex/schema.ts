import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  boards: defineTable({
    title: v.string(),
    orgId: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    imageUrl: v.string(),
  })
    .index('by_org', ['orgId'])
    .searchIndex('search_title', {
      searchField: 'title',
      filterFields: ['orgId'],
    }),

  userDocument: defineTable({
    orgId: v.string(),
    Filename: v.string(),
    documenturl: v.string(),
    filekey: v.string(),
  }).index('by_org', ['orgId']),

  userCalendar: defineTable({
    orgId: v.string(),
    currentDate: v.string(),
    title: v.string(),
    description: v.string(),
    time: v.optional(v.string()),
  })
    .index('by_org', ['orgId'])
    .searchIndex('Current_Date', {
      searchField: 'currentDate',
      filterFields: ['orgId'],
    }),

  userBot: defineTable({
    orgId: v.string(),
    userRole: v.string(),
    message: v.string(),
  }).index('by_org', ['orgId']),

  ChatApp: defineTable({
    orgId: v.string(),
    name: v.string(),
    role: v.string(),
    message: v.string(),
  }).index('by_org', ['orgId']),
})
