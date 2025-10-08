declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare global {
  var mongooseCache: {
    conn: typeof import('mongoose') | null;
    promise: Promise<typeof import('mongoose')> | null;
  };
}
