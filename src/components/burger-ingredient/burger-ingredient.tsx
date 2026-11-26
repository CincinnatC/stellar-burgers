import { nanoid } from '@reduxjs/toolkit';
import { BurgerIngredientUI } from '@ui';
import { memo } from 'react';
import { useLocation } from 'react-router-dom';

import { setBun, addIngredient } from '@services/slices/constructorSlice';
import { useDispatch } from '@services/store';

import type { TBurgerIngredientProps } from './type';
import type { TConstructorIngredient } from '@utils-types';

export const BurgerIngredient = memo(function BurgerIngredient({
  ingredient,
  count,
}: TBurgerIngredientProps): React.JSX.Element {
  const location = useLocation();
  const dispatch = useDispatch();

  const handleAdd = (): void => {
    const constructorIngredient: TConstructorIngredient = {
      ...ingredient,
      id: nanoid(),
    };
    if (ingredient.type === 'bun') {
      dispatch(setBun(constructorIngredient));
    } else {
      dispatch(addIngredient(constructorIngredient));
    }
  };

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={count}
      locationState={{ background: location }}
      handleAdd={handleAdd}
    />
  );
});
