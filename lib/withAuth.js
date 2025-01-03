import { getToken } from 'next-auth/jwt';

export function withAuth(handler, allowedRoles) {
  return async (req, res) => {
    const token = await getToken({ req });

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(token.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    return handler(req, res);
  };
}

export function withPageAuth(getServerSidePropsFunc, allowedRoles) {
  return async (context) => {
    const token = await getToken(context);

    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    if (!allowedRoles.includes(token.role)) {
      return {
        redirect: {
          destination: '/unauthorized',
          permanent: false,
        },
      };
    }

    if (getServerSidePropsFunc) {
      return await getServerSidePropsFunc(context);
    }

    return { props: {} };
  };
}