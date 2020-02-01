const { envVars } = module.parent.exports;
const { jwt } = envVars.requires;

module.exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).send({
      message: 'There was a problem logging in.',
    });
  }

  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, trainer) => {
    if (err) {
      return res.status(403).send({
        message: 'There was a problem logging in.',
      });
    }

    req.trainer = trainer;
    return next();
  });
};
