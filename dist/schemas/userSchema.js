import { z } from "zod";
export const signupSchema = z.object({
    name: z.string().min(1, "Nafn verður að vera útfyllt"),
    email: z.string().email("Netfang þarf að vera gilt"),
    password: z.string().min(6, "Lykilorð þarf að vera að minnsta kosti 6 stafir"),
});
export const loginSchema = z.object({
    email: z.string().email("Netfang þarf að vera gilt"),
    password: z.string(),
});
export const updateUserSchema = z.object({
    name: z.string().min(1, "Nafn verður að vera útfyllt").optional(),
    email: z.string().email("Netfang þarf að vera gilt").optional(),
    password: z.string().min(6, "Lykilorð þarf að vera að minnsta kosti 6 stafir").optional(),
}).refine((data) => !!(data.name || data.email || data.password), {
    message: "Upplýsingar vantar.",
});
