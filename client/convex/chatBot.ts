import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const createChat = mutation({
  args: {
    orgId: v.string(),
    userRole: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {

    // const identity = await ctx.auth.getUserIdentity()

    // if(!identity){
    //     throw new Error("User not Identified")
    // }

    const message = await  ctx.db.insert('userBot', {
        orgId: args.orgId,
        userRole: args.userRole,
        message: args.message,
    })

    return message
  }
})

export const getAll = query({
  args: {
    orgId: v.string()
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity()

    // if (!identity) {
    //   throw new Error('User not Identified')
    // }

    const getchat = await ctx.db
      .query('userBot')
      .withIndex('by_org', (q) => q.eq('orgId', args.orgId))
      .collect()

      return getchat
  }
})