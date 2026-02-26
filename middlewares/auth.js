function requireLogin(req, res, next) {
  if (!req.currentUser) {
    return res.redirect('/login?error=Silakan login terlebih dahulu');
  }

  next();
}

function redirectIfLoggedIn(req, res, next) {
  if (req.currentUser) {
    return res.redirect('/homes');
  }

  next();
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const currentRole = (req.currentUser?.role || '').toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map((role) => role.toLowerCase());

    if (!currentRole || !normalizedAllowedRoles.includes(currentRole)) {
      return res.redirect('/homes?error=Akses ditolak untuk role Anda');
    }

    next();
  };
}

module.exports = {
  requireLogin,
  redirectIfLoggedIn,
  authorizeRoles
};
