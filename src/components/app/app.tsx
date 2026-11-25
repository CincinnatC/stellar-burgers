import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

import { fetchIngredients } from '@services/slices/ingredientsSlice';
import { getUser } from '@services/slices/userSlice';
import { useDispatch, useSelector } from '@services/store';

import type { AppContentProps } from './type';
import type { TIngredient } from '@utils-types';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const ingredients: TIngredient[] = useSelector(
    (state) => state.ingredients.ingredients
  );
  const isIngredientsLoading = useSelector((state) => state.ingredients.isLoading);
  const ingredientsError = useSelector((state) => state.ingredients.error);
  const dispatch = useDispatch();
  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(getUser());
  }, [dispatch]);
  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};

export default App;

/* Маршруты показываются только когда ингредиенты загружены: без них не
   отрисовать ни конструктор, ни состав заказа. */
const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => {
  const user = useSelector((state) => state.user.user);
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as {
    background?: ReturnType<typeof useLocation>;
  } | null;
  const background = locationState?.background;

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route
          path="/login"
          element={
            isAuthChecked ? (
              user ? (
                <Navigate to="/" replace />
              ) : (
                <Login />
              )
            ) : (
              <Preloader />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthChecked ? (
              user ? (
                <Navigate to="/" replace />
              ) : (
                <Register />
              )
            ) : (
              <Preloader />
            )
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/profile"
          element={
            isAuthChecked ? (
              user ? (
                <Profile />
              ) : (
                <Navigate to="/login" replace />
              )
            ) : (
              <Preloader />
            )
          }
        />
        <Route
          path="/profile/orders"
          element={
            isAuthChecked ? (
              user ? (
                <ProfileOrders />
              ) : (
                <Navigate to="/login" replace />
              )
            ) : (
              <Preloader />
            )
          }
        />
        <Route path="/feed/:number" element={<OrderInfo />} />
        <Route path="/ingredients/:id" element={<IngredientDetails />} />
        <Route
          path="/profile/orders/:number"
          element={
            isAuthChecked ? (
              user ? (
                <OrderInfo />
              ) : (
                <Navigate to="/login" replace />
              )
            ) : (
              <Preloader />
            )
          }
        />

        <Route path="*" element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path="/feed/:number"
            element={
              <Modal title="" onClose={() => void navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="" onClose={() => void navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <Modal title="" onClose={() => void navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};
