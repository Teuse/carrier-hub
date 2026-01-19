export const login = (email: string) => {
  localStorage.setItem('user', JSON.stringify({
    email,
    name: 'IVECO User',
    avatar: 'https://i.pravatar.cc/40'
  }));
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getUser = () => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};