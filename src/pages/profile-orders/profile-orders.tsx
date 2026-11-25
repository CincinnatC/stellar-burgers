import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { fetchOrders } from '@services/slices/ordersSlice';
import { useDispatch, useSelector } from '@services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);

  useEffect(() => {
    void dispatch(fetchOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
