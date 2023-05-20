export const dev: boolean = process.env.NODE_ENV !== 'production';

export const server: string = dev ? 'http://localhost:9999' : 'web-production-9d8f.up.railway.app'