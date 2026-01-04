import { z } from 'zod';
export const VenueIdParams = z.object({
    id: z
        .string()
        .refine((val) => {
        const num = Number(val);
        return Number.isInteger(num) && num > 0;
    }, { message: 'Id á stað ekki gilt' })
        .transform(Number),
});
