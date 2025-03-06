import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().min(1000),
  IS_DEV_MODE: z.string().nonempty(),
  OPENAI_API_KEY: z.string().nonempty(),
  OPENAI_MODEL: z.string().nonempty(),
});

export const env = envSchema.parse(process.env);
