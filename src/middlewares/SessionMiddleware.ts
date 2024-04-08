import expressSession from 'express-session';

declare module 'express-session' {
  interface SessionData {
    views: number;
    userId: number;
  }
}

const SessionMiddleware = expressSession({
  secret: 'my_secret',
  resave: false,
  saveUninitialized: false,
  name: 'session_id',
});

export default SessionMiddleware;
