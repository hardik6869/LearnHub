declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: string;
      PORT?: string;
      CLIENT_URL?: string;
      MONGO_URI?: string;
      FILE_UPLOAD_PATH?: string;
      MAX_FILE_UPLOAD?: string;
      JWT_SECRET?: string;
      JWT_EXPIRE?: string;
      JWT_COOKIE_EXPIRE?: string;
      SMTP_HOST?: string;
      SMTP_PORT?: string;
      SMTP_EMAIL?: string;
      SMTP_PASSWORD?: string;
      FROM_NAME?: string;
      FROM_EMAIL?: string;
    }
  }
}

export {};
