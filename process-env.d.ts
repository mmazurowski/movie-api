export interface ProcessEnvironments {
  NODE_ENV: 'development' | 'test' | 'staging' | 'production';

  APP_HOST: string;
  APP_PORT: number;

  LOG_LEVEL: 'error' | 'debug' | 'log' | 'warn' | 'verbose' | 'info';

  CORS_WHITELIST: string;
}

declare namespace NodeJS {
  type ProcessEnv = ProcessEnvironments;
}
