import { createCookieSessionStorage } from 'remix';

const {
  getSession,
  commitSession,
  destroySession
} = createCookieSessionStorage({
  cookie: {
    name: '__recipes',
  },
});

export { getSession, commitSession, destroySession };
