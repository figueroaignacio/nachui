import 'dotenv/config';
import { validateEnv } from './env';

/**
 * Imported first by main.ts. `@repo/db` reads POSTGRES_URL as soon as it is
 * required, which happens before ConfigModule loads `.env`, so the file is
 * loaded and validated here to fail fast with a readable message.
 */
validateEnv(process.env);
