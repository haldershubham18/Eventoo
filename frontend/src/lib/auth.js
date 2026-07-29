/**
 * ------------------------------------------------------------------
 *  Auth service (PLACEHOLDER)
 * ------------------------------------------------------------------
 *  This file mocks a backend using localStorage so Login/Sign Up are
 *  fully functional out of the box. It is the ONLY file that needs to
 *  change when a real backend is ready — every component just calls
 *  loginUser / signUpUser / logoutUser / getCurrentUser.
 *
 *  To connect a real API, replace the bodies below, e.g.:
 *
 *    export async function loginUser({ email, password }) {
 *      const res = await fetch("/api/auth/login", {
 *        method: "POST",
 *        headers: { "Content-Type": "application/json" },
 *        body: JSON.stringify({ email, password }),
 *      });
 *      if (!res.ok) {
 *        const { message } = await res.json().catch(() => ({}));
 *        throw new Error(message || "Invalid email or password.");
 *      }
 *      const session = await res.json(); // { id, name, email, token }
 *      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
 *      return session;
 *    }
 *
 *  Do the same for signUpUser (POST /api/auth/signup) and, if you add
 *  server-side sessions/JWTs, adjust getCurrentUser/logoutUser to read
 *  and clear whatever token strategy you use.
 * ------------------------------------------------------------------
 */

const STORAGE_KEY = "campusconnect_session";
const USERS_KEY = "campusconnect_users"; // demo-only "database" of signed-up users

function delay(ms = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/** Create a new account. Throws with a user-friendly message on failure. */
export async function signUpUser({ name, email, password }) {
  // TODO: swap for POST /api/auth/signup
  await delay();
  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with this email already exists.");
  }
  // NOTE: storing plain-text passwords in localStorage is only OK for this
  // front-end demo. A real backend must hash & salt passwords server-side.
  const user = { id: `u-${Date.now()}`, name, email, password };
  writeUsers([...users, user]);

  const session = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

/** Log in an existing account. Throws with a user-friendly message on failure. */
export async function loginUser({ email, password }) {
  // TODO: swap for POST /api/auth/login
  await delay();
  const users = readUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    throw new Error("Incorrect email or password.");
  }

  const session = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

/** Returns the currently signed-in session, or null. */
export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}

/** Clears the current session. */
export function logoutUser() {
  localStorage.removeItem(STORAGE_KEY);
}
