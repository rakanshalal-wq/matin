export async function logoutUser(router: any) {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch {}
  try {
    localStorage.removeItem('matin_token');
    localStorage.removeItem('matin_user');
  } catch {}
  router.push('/login');
}
