const TOKEN_KEY = 'heboard_token';
const USER_KEY = 'heboard_user';

export const authService = {
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  setUser(user: any) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  removeUser() {
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  logout() {
    this.removeToken();
    this.removeUser();
  }
};
