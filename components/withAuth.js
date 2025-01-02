import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const withAuth = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return;
      
      // Redirect if not authenticated or role not allowed
      if (!session || (allowedRoles && !allowedRoles.includes(session.user.role))) {
        router.push('/');
      }
    }, [session, status, router]);

    if (status === 'loading' || !session) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;