import createError from 'http-errors';
import { Config } from '@/constants';

// Centralised and safe point of accessing `process.env` variables
export const getConfig = (
  key: Config | string,
  isRequired = true,
  fallbackValue?: string,
): string | undefined => {
  const value: string | undefined = process.env[String(key)];

  if (!value?.length) {
    const message = `Configuration error: '${key}' is required`;

    if (isRequired) {
      throw createError(500, message);
    }
    // eslint-disable-next-line no-console
    console.warn(
      `Configuration warning: Optional key '${key}' accessed, but not present in runtime config. Fallback value: ${fallbackValue}`,
    );
    return fallbackValue || undefined;
  }
  return value;
};

// serverless-offline plug-in
export const isOffline = (env: NodeJS.ProcessEnv = process.env): boolean =>
  env.IS_OFFLINE === 'true';

// Returns true when runtime environment is AWS Lambda
export const isAWS = (env: NodeJS.ProcessEnv = process.env): boolean =>
  'AWS_LAMBDA_FUNCTION_NAME' in env &&
  'LAMBDA_TASK_ROOT' in env &&
  !isOffline();
