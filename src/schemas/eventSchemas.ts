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


export const EventIdParams = z.object({
  id: z
    .string()
    .refine((val) => {
      const num = Number(val);
      return Number.isInteger(num) && num > 0;
    }, {
      message: 'Id er ekki gilt',
    })
    .transform((val) => Number(val)),
});