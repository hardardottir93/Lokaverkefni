import { z } from 'zod';


export const EventFilterQuery = z
  .object({
    categoryId: z.coerce.number().optional(),
    venueId: z.coerce.number().optional(),
    venueName: z.string().optional(),
    city: z.string().optional(),   

    fromDate: z
      .string()
      .refine(
        (val) => !isNaN(Date.parse(val)),
        'fromDate must be a valid date'
      )
      .optional(),

    toDate: z
      .string()
      .refine(
        (val) => !isNaN(Date.parse(val)),
        'toDate must be a valid date'
      )
      .optional(),
  })

  .refine(
    (data) =>
      !data.fromDate ||
      !data.toDate ||
      new Date(data.fromDate) <= new Date(data.toDate),
    {
      message: 'fromDate must be before toDate',
      path: ['fromDate'],
    }
  )
.strict();