import { Preloader } from '@ui';
import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { updateUser } from '@services/slices/userSlice';
import { useDispatch, useSelector } from '@services/store';

export const Profile = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name ?? '',
      email: user?.email ?? '',
    }));
  }, [user]);

  if (!user) {
    return <Preloader />;
  }

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(updateUser(formValue));
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
