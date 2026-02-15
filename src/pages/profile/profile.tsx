import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { updateUser } from '../../services/slices/user';

type FormState = {
  name: string;
  email: string;
  password: string;
};

export const Profile: FC = () => {
  const dispatch = useDispatch();

  /** TODO: взять переменную из стора */
  const user = useSelector((store) => store.user.data);

  const [formValue, setFormValue] = useState<FormState>({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  }, [user]);

  const isFormChanged = useMemo(
    () =>
      formValue.name !== (user?.name || '') ||
      formValue.email !== (user?.email || '') ||
      Boolean(formValue.password),
    [formValue, user]
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isFormChanged) return;

    dispatch(
      updateUser({
        name: formValue.name,
        email: formValue.email,
        password: formValue.password
      })
    );
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValue((prev) => ({
      ...prev,
      [name]: value
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
