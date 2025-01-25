import Cookies from 'js-cookie';

export const setAdminToken = (token: string) => {
  Cookies.set('adminToken', token, { expires: 7 }); // Token expires in 7 days
};

export const removeAdminToken = () => {
  Cookies.remove('adminToken');
};

export const getAdminToken = () => {
  return Cookies.get('adminToken');
};

export const isAdmin = () => {
  return !!getAdminToken();
};
