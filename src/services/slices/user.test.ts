import {
  userSlice,
  initialState,
  loginUser,
  registerUser,
  fetchUser,
  updateUser,
  logoutUser
} from './user';
import { TUser } from '@utils-types';

const reducer = userSlice.reducer;

describe('user slice reducer', () => {
  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  describe('loginUser', () => {
    it('pending: loading=true, loginUserError=null', () => {
      const state = reducer(initialState, { type: loginUser.pending.type });

      expect(state.loading).toBe(true);
      expect(state.loginUserError).toBeNull();
    });

    it('fulfilled: data=user, loading=false, isAuthenticated=true, isAuthChecked=true', () => {
      const state = reducer(
        { ...initialState, loading: true },
        { type: loginUser.fulfilled.type, payload: mockUser }
      );

      expect(state.data).toEqual(mockUser);
      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    it('rejected: loading=false, isAuthChecked=true, loginUserError из payload', () => {
      const state = reducer(
        { ...initialState, loading: true },
        { type: loginUser.rejected.type, payload: 'Ошибка авторизации' }
      );

      expect(state.loading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.loginUserError).toBe('Ошибка авторизации');
    });

    it('rejected: если payload нет — берётся action.error.message', () => {
      const state = reducer(
        { ...initialState, loading: true },
        { type: loginUser.rejected.type, error: { message: 'fail' } }
      );

      expect(state.loading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.loginUserError).toBe('fail');
    });
  });

  describe('registerUser', () => {
    it('pending: loading=true', () => {
      const state = reducer(initialState, { type: registerUser.pending.type });
      expect(state.loading).toBe(true);
    });

    it('fulfilled: data=user, loading=false, isAuthenticated=true, isAuthChecked=true', () => {
      const state = reducer(
        { ...initialState, loading: true },
        { type: registerUser.fulfilled.type, payload: mockUser }
      );

      expect(state.data).toEqual(mockUser);
      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    it('rejected: loading=false, loginUserError из payload', () => {
      const state = reducer(
        { ...initialState, loading: true },
        { type: registerUser.rejected.type, payload: 'Ошибка регистрации' }
      );

      expect(state.loading).toBe(false);
      expect(state.loginUserError).toBe('Ошибка регистрации');
    });
  });

  describe('fetchUser', () => {
    it('pending: loading=true', () => {
      const state = reducer(initialState, { type: fetchUser.pending.type });
      expect(state.loading).toBe(true);
    });

    it('fulfilled: data=user, loading=false, isAuthenticated=true, isAuthChecked=true', () => {
      const state = reducer(
        { ...initialState, loading: true },
        { type: fetchUser.fulfilled.type, payload: mockUser }
      );

      expect(state.data).toEqual(mockUser);
      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    it('rejected: loading=false, isAuthChecked=true, loginUserError из payload', () => {
      const state = reducer(
        { ...initialState, loading: true },
        {
          type: fetchUser.rejected.type,
          payload: 'Ошибка получения данных о пользователе'
        }
      );

      expect(state.loading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.loginUserError).toBe(
        'Ошибка получения данных о пользователе'
      );
    });
  });

  describe('updateUser', () => {
    it('pending: loading=true', () => {
      const state = reducer(initialState, { type: updateUser.pending.type });
      expect(state.loading).toBe(true);
    });

    it('fulfilled: data=user, loading=false', () => {
      const state = reducer(
        { ...initialState, loading: true },
        { type: updateUser.fulfilled.type, payload: mockUser }
      );

      expect(state.data).toEqual(mockUser);
      expect(state.loading).toBe(false);
    });

    it('rejected: loading=false, loginUserError из payload', () => {
      const state = reducer(
        { ...initialState, loading: true },
        {
          type: updateUser.rejected.type,
          payload: 'Ошибка обновления пользователя'
        }
      );

      expect(state.loading).toBe(false);
      expect(state.loginUserError).toBe('Ошибка обновления пользователя');
    });
  });

  describe('logoutUser', () => {
    it('pending: loading=true', () => {
      const state = reducer(initialState, { type: logoutUser.pending.type });
      expect(state.loading).toBe(true);
    });

    it('fulfilled: data=null, isAuthenticated=false, isAuthChecked=true, loading=false', () => {
      const prevState = {
        ...initialState,
        loading: true,
        data: mockUser,
        isAuthenticated: true
      };

      const state = reducer(prevState, { type: logoutUser.fulfilled.type });

      expect(state.data).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.loading).toBe(false);
    });

    it('rejected: loading=false, loginUserError из payload', () => {
      const state = reducer(
        { ...initialState, loading: true },
        {
          type: logoutUser.rejected.type,
          payload: 'Неизвестная ошибка выхода пользователя'
        }
      );

      expect(state.loading).toBe(false);
      expect(state.loginUserError).toBe(
        'Неизвестная ошибка выхода пользователя'
      );
    });
  });

  describe('sync actions', () => {
    it('authChecked: isAuthChecked=true', () => {
      const state = reducer(initialState, userSlice.actions.authChecked());
      expect(state.isAuthChecked).toBe(true);
    });

    it('setUser: data=user', () => {
      const state = reducer(initialState, userSlice.actions.setUser(mockUser));
      expect(state.data).toEqual(mockUser);
    });

    it('userLogout: data=null', () => {
      const state = reducer(
        { ...initialState, data: mockUser },
        userSlice.actions.userLogout()
      );
      expect(state.data).toBeNull();
    });
  });
});
