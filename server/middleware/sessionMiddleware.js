const { v4: uuidv4 } = require('uuid');
const fileCleanupManager = require('../utils/fileCleanup');

const activeSessions = new Map();

function sessionMiddleware(req, res, next) {
  let sessionId = req.headers['x-session-id'] || req.query.sessionId;
  
  if (!sessionId) {
    sessionId = uuidv4();
    res.setHeader('X-Session-Id', sessionId);
  }

  if (!activeSessions.has(sessionId)) {
    activeSessions.set(sessionId, {
      id: sessionId,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      connected: true
    });
    console.log(`New session created: ${sessionId}`);
  } else {
    activeSessions.get(sessionId).lastActivity = Date.now();
  }

  req.sessionId = sessionId;

  res.on('close', () => {
    const session = activeSessions.get(sessionId);
    if (session) {
      session.connected = false;
      console.log(`Connection closed for session: ${sessionId}`);
      
      setTimeout(() => {
        const currentSession = activeSessions.get(sessionId);
        if (currentSession && !currentSession.connected) {
          console.log(`Session timeout, cleaning up: ${sessionId}`);
          fileCleanupManager.cleanupSessionFiles(sessionId);
          activeSessions.delete(sessionId);
        }
      }, 30000);
    }
  });

  next();
}

function checkInactiveSessions() {
  const now = Date.now();
  const inactivityTimeout = 10 * 60 * 1000;

  for (const [sessionId, session] of activeSessions.entries()) {
    if (now - session.lastActivity > inactivityTimeout) {
      console.log(`Session inactive for 10+ minutes: ${sessionId}`);
      fileCleanupManager.cleanupSessionFiles(sessionId);
      activeSessions.delete(sessionId);
    }
  }
}

setInterval(checkInactiveSessions, 60000);

module.exports = { sessionMiddleware, activeSessions };
