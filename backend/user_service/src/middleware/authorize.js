/**
 * permit(...roles)
 *    → only allow if req.user.role is in the list
 * permitSelfOr(...roles)
 *    → allow if user is operating on their own resource OR has one of the roles
 */
exports.permit = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

exports.permitSelfOr = (...roles) => (req, res, next) => {
  if (req.user.id === req.params.id) {
    return next();
  }
  if (roles.includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({ message: 'Access denied' });
};
