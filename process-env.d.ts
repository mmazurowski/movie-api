export interface ProcessEnvironments {
    NODE_ENV: 'development' | 'test' | 'staging' | 'production'
    APP_HOST: string;
    APP_PORT: number;
    LOG_LEVEL: 'error' | 'debug' | 'log' | 'warn' | 'verbose' | 'info';

    POSTGRES_ENDPOINT: string;
    POSTGRES_PORT: number;
    POSTGRES_DATABASE_NAME:string;
    POSTGRES_USER:string;
    POSTGRES_PASSWORD:string;

    MONGO_PORT:number;
    MONGO_USER:string;
    MONGO_PASSWORD:string;
}

declare namespace NodeJS {
    type ProcessEnv = ProcessEnvironments;
}
