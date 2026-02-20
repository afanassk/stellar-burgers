import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrders,
  getOrders,
  getOrderLoading
} from '../../services/slices/orders';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  /** TODO: взять переменную из стора */
  const orders = useSelector(getOrders);
  const isLoading = useSelector(getOrderLoading);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
