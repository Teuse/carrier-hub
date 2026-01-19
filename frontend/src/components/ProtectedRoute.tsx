import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { getUser } from '../auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}