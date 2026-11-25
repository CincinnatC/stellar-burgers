import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { registerUser } from '@services/slices/userSlice';
import { useDispatch, useSelector } from '@services/store';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.error);

  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      void navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(registerUser({ name: userName, email, password }));
  };

  return (
    <RegisterUI
      errorText={error?.message ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
