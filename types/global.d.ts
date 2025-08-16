// Global TypeScript declarations
declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    NODE_ENV: 'development' | 'production';
  }
}

declare global {
  // Extend the global File interface to include arrayBuffer
  interface File {
    arrayBuffer(): Promise<ArrayBuffer>;
  }

  // For development mode MongoDB connection caching
  var _mongoClientPromise: Promise<import('mongodb').MongoClient> | undefined;
}

export {};
