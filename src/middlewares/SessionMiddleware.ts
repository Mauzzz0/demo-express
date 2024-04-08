import expressSession from 'express-session';

declare module 'express-session' {
  interface SessionData {
    views: number;
  }
}

const SECRET_SESSION = 'my_secret';

const SessionMiddleware = expressSession({
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: false,
  name: 'session_id',
});

export default SessionMiddleware;
