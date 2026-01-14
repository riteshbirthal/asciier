let sessionId = sessionStorage.getItem('asciier-session-id');

export function getSessionId() {
  return sessionId;
}

export function setSessionId(id) {
  sessionId = id;
  if (id) {
    sessionStorage.setItem('asciier-session-id', id);
  } else {
    sessionStorage.removeItem('asciier-session-id');
  }
}

export function getSessionHeaders() {
  const headers = {};
  if (sessionId) {
    headers['X-Session-Id'] = sessionId;
  }
  return headers;
}

export function extractSessionId(response) {
  const sessionIdFromHeader = response.headers['x-session-id'];
  if (sessionIdFromHeader && sessionIdFromHeader !== sessionId) {
    setSessionId(sessionIdFromHeader);
  }
}
