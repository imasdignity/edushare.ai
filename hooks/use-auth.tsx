'use client';

import { Session } from 'next-auth';
import { useSession as useNextAuthSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

type UseAuthProps = {
  required?: boolean;
  redirectTo?: string;
  onUnauthenticated?: () => void;
};

type UseAuthReturn = {
  user: Session['user'] | null;
  status: 'authenticated' | 'unauthenticated' | 'loading';
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  isParent: boolean;
  signIn: (provider?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<Session | null>;
};

export function useAuth({
  required = false,
  redirectTo = '/auth/signin',
  onUnauthenticated,
}: UseAuthProps = {}): UseAuthReturn {
  const { data: session, status, update } = useNextAuthSession();
  const router = useRouter();

  const user = session?.user || null;

  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';
  const isParent = user?.role === 'parent';

  useEffect(() => {
    if (required && status === 'unauthenticated') {
      if (onUnauthenticated) {
        onUnauthenticated();
      } else {
        router.push(redirectTo);
      }
    }
  }, [required, status, router, redirectTo, onUnauthenticated]);

  const signIn = async (provider = 'credentials') => {
    try {
      const response = await signIn(provider, { redirect: false });
      if (response?.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/auth/signin');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const refreshSession = async () => {
    try {
      const newSession = await update();
      return newSession;
    } catch (error) {
      console.error('Failed to refresh session:', error);
      return null;
    }
  };

  return useMemo(
    () => ({
      user,
      status: status as 'authenticated' | 'unauthenticated' | 'loading',
      isAdmin,
      isTeacher,
      isStudent,
      isParent,
      signIn,
      signOut,
      refreshSession,
    }),
    [user, status, isAdmin, isTeacher, isStudent, isParent]
  );
}

// Helper hook for client-side auth checks
export function useRole(requiredRole: 'admin' | 'teacher' | 'student' | 'parent') {
  const { user, status } = useAuth();
  const hasRole = user?.role === requiredRole;
  const isLoading = status === 'loading';

  return { hasRole, isLoading };
}

// Helper hook for protected content
export function useProtected(requiredRole?: 'admin' | 'teacher' | 'student' | 'parent') {
  const { user, status } = useAuth({ required: true });
  const isLoading = status === 'loading';
  const isAuthorized = requiredRole ? user?.role === requiredRole : true;

  return { user, isLoading, isAuthorized };
}
