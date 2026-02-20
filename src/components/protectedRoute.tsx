import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { useSelector } from '../services/store';
import { getUserData, isAuthChecked } from '../services/slices/user';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const user = useSelector(getUserData);
  const authChecked = useSelector(isAuthChecked);
  const location = useLocation();

  // Пока идёт проверка авторизации - показываем прелоадер
  if (!authChecked) {
    return <Preloader />;
  }

  // Пользователь не авторизован, но должен быть авторизован
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Пользователь авторизован, но должен быть не авторизован
  if (onlyUnAuth && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} replace />;
  }

  return children;
};
