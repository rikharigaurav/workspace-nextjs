import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const create = mutation({
    args: {
        orgId: v.string(),
        date: v.string(),
        title: v.string(),
        description: v.string(),
        time: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        // const indentity = await ctx.auth.getUserIdentity()
        // console.log("the user identity", indentity)

        // if (!indentity) {
        //   throw new Error('Unuthorized')
        // }

        const event = await ctx.db.insert('userCalendar', {
            title: args.title,
            orgId: args.orgId,
            description: args.description,
            currentDate: args.date,
            time: args.time
        })


    return event 
    },
})


export const get = query({
    args: {
        date: v.string(),
        orgId: v.string()
    }, 
    handler: async (ctx, args) => {
        // console.log("date", args.date)
        // const indentity = await ctx.auth.getUserIdentity()

        // if(indentity){
        //     throw new Error('Unuthorized')
        // }

        const calendar = await ctx.db
          .query('userCalendar')
          .filter((q) => q.eq(q.field('currentDate'), args.date))
          .collect()

        if(!calendar.length){
          return []
        }

        return calendar
    }
})


export const remove = mutation({
  args: {
    id: v.id('userCalendar'),
  },
  handler: async (ctx, args) => {
    console.log('The remove function received', args.id)
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Unauthorized User')
    }

    const removeResult = await ctx.db.delete(args.id)

    return removeResult
  },
})
