import { z } from "zod";

export const registerSchema = z
    .object({
        name: z.string().min(2, "Name is required"),
        email: z.string().email("Invalid email"),
        address: z.string().min(3, "Address is required"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6),
        role: z.enum(["Patient", "Doctor"], {
            errorMap: () => ({ message: "Role must be Patient or Doctor" }),
        }),
        image: z
            .any()
            .refine(
                (file) => !file || (file instanceof FileList && file.length > 0),
                "Image is required"
            )
            .refine(
                (file) =>
                    !file ||
                    (file instanceof FileList &&
                        ["image/jpeg", "image/png", "image/jpg"].includes(file[0]?.type)),
                "Only JPEG/PNG images are allowed"
            )
            .optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
