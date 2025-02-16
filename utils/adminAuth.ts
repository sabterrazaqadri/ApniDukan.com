import Cookies from 'js-cookie';

export const setAdminToken = (token: string) => {
  Cookies.set('adminToken', token, { expires: 7 }); // Token expires in 7 days
};

export const removeAdminToken = () => {
  Cookies.remove('adminToken');
  localStorage.removeItem('adminAuthenticated');
};

export const getAdminToken = () => {
  return Cookies.get('adminToken');
};

export const isAdmin = () => {
  const token = getAdminToken();
  const localAuth = localStorage.getItem('adminAuthenticated');
  return !!token && localAuth === 'true';
};

export const loginAdmin = (email: string, password: string): boolean => {
  // Replace these with your actual admin credentials
  const ADMIN_EMAIL = 'admin@apnidukan.com';
  const ADMIN_PASSWORD = 'admin123';

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Set both cookie and localStorage for better persistence
    setAdminToken('admin-authenticated');
    localStorage.setItem('adminAuthenticated', 'true');
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  removeAdminToken();
};
