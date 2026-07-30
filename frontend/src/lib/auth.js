const STORAGE_KEY = "campusconnect_session";

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }

  return data;
}

/** Create a new account. Throws with a user-friendly message on failure. */
export async function signUpUser({ name, email, password }) {
  const session = await requestJson("http://127.0.0.1:8000/api/auth/signup/", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

/** Log in an existing account. Throws with a user-friendly message on failure. */
export async function loginUser({ email, password }) {
  const session = await requestJson("http://127.0.0.1:8000/api/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

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
