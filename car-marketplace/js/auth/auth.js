/* ============================================
   Authentication Module
   ============================================ */
const Auth = (() => {
  const SESSION_KEY = '_cm_session';
  const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

  async function register(userData) {
    const { fullName, email, password, phone, location } = userData;
    if (!fullName || !email || !password) throw new Error('All fields are required');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email format');

    const existing = await CarDB.getByIndex('users', 'email', email);
    if (existing.length > 0) throw new Error('Email already registered');

    const hashedPassword = await SecurityUtil.hashPassword(password);
    const userId = await CarDB.add('users', {
      fullName,
      email,
      password: hashedPassword,
      phone: phone || '',
      location: location || '',
      role: 'user',
      avatar: '',
    });

    return await createSession(userId);
  }

  async function login(email, password) {
    if (!email || !password) throw new Error('Email and password are required');

    const users = await CarDB.getByIndex('users', 'email', email);
    if (users.length === 0) throw new Error('Invalid email or password');

    const user = users[0];
    const valid = await SecurityUtil.verifyPassword(password, user.password);
    if (!valid) throw new Error('Invalid email or password');

    return await createSession(user.id);
  }

  async function createSession(userId) {
    const token = SecurityUtil.generateToken();
    const expiry = Date.now() + TOKEN_EXPIRY;

    await CarDB.put('sessions', { token, userId, expiry, createdAt: Date.now() });

    const sessionData = SecurityUtil.encryptData({ token, userId, expiry });
    sessionStorage.setItem(SESSION_KEY, sessionData);

    return { token, userId };
  }

  async function getSession() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const data = SecurityUtil.decryptData(raw);
    if (!data || !data.token) return null;

    if (Date.now() > data.expiry) {
      await logout();
      return null;
    }

    const session = await CarDB.get('sessions', data.token);
    if (!session || Date.now() > session.expiry) {
      await logout();
      return null;
    }

    return data;
  }

  async function getCurrentUser() {
    const session = await getSession();
    if (!session) return null;

    const user = await CarDB.get('users', session.userId);
    if (!user) return null;

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async function logout() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const data = SecurityUtil.decryptData(raw);
      if (data && data.token) {
        try { await CarDB.remove('sessions', data.token); } catch (e) { /* ignore */ }
      }
    }
    sessionStorage.removeItem(SESSION_KEY);
  }

  async function isAuthenticated() {
    const session = await getSession();
    return !!session;
  }

  async function isAdmin() {
    const user = await getCurrentUser();
    return user && user.role === 'admin';
  }

  async function requireAuth(redirectUrl) {
    const authed = await isAuthenticated();
    if (!authed) {
      window.location.href = (redirectUrl || 'login.html') + '?redirect=' + encodeURIComponent(window.location.href);
      return false;
    }
    return true;
  }

  async function requireAdmin() {
    const admin = await isAdmin();
    if (!admin) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }

  async function updateProfile(updates) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const fullUser = await CarDB.get('users', user.id);
    Object.assign(fullUser, updates);
    await CarDB.put('users', fullUser);
    return true;
  }

  return { register, login, logout, getSession, getCurrentUser, isAuthenticated, isAdmin, requireAuth, requireAdmin, updateProfile };
})();

window.Auth = Auth;
