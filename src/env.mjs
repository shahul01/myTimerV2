// import { z } from 'zod';

// TODO: Get all env var from this file
// const server = z.object({ DATABASE_URL: z.string().url(), });

// const client = z.object({});

// const processEnv = { DATABASE_URL: process.env.DATABASE_URL };

const { env } = process;

export default env;
