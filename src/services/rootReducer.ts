import { constructorReducer } from './slices/constructorSlice';
import { feedReducer } from './slices/feedSlice';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { orderInfoReducer } from './slices/orderInfoSlice';
import { orderReducer } from './slices/orderSlice';
import { ordersReducer } from './slices/ordersSlice';
import { userReducer } from './slices/userSlice';
// в курсе вроде бы нас учили корневой редусер объектом делать, а тут функцией предлагается,
// так что я переделал в объект
// export const rootReducer = (): Record<string, never> => ({
export const rootReducer = {
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  feed: feedReducer,
  orders: ordersReducer,
  user: userReducer,
  orderInfo: orderInfoReducer,
};
