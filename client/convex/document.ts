import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const Createdoc = mutation({
  args: {
    orgId: v.string(),
    Filename: v.string(),
    documenturl: v.string(),
    filekey: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Unauthorized')
    }

    const existingDocument = await ctx.db
      .query('userDocument')
      .filter((q) => q.eq(q.field('Filename'), args.Filename))
      .collect()

    if (existingDocument.length > 0) {
      throw new Error('Document already exists')
    }

    const createdDocument = await ctx.db.insert('userDocument', {
      orgId: args.orgId,
      Filename: args.Filename,
      documenturl: args.documenturl,
      filekey: args.filekey,
    })

    return createdDocument
  },
})

export const getAllDocs = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check user identity for authorization
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Unauthorized: User not authenticated')
    }
    
    // console.log("the function is beign called and orgid", args.orgId)

    try {
      // Fetch all documents associated with the given organization ID
      const allDocs = await ctx.db
        .query('userDocument')
        .withIndex('by_org', (q) => q.eq('orgId', args.orgId))
        .order('desc')
        .collect()

        console.log("all Docs", allDocs)
      // Return the fetched documents
      return allDocs
    } catch (error) {
      // Handle any errors during the database query
      console.error('Error fetching documents:', error)
      throw new Error('Failed to fetch documents. Please try again later.')
    }
  },
})
