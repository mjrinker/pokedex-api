const { envVars } = module.parent.exports; // import environment variables from parent
const { authServer } = envVars; // extract app from environment variables
const { models } = envVars; // extract app from environment variables
const { bcrypt } = envVars.requires;
const { jwt } = envVars.requires;
const { Sequelize } = envVars.requires;
const { Op } = Sequelize;

const generateAccessToken = (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });

authServer.post('/login', async (req, res, next) => {
  let message = 'There was a problem logging in.';
  const additionalMessage = 'Please check to make sure your email and password is correct and try again.';

  const trainer = await models.Trainer.findOne({
    where: {
      [Op.and]: {
        ...(req.body.email ? { email: req.body.email } : {}),
        ...(req.body.username ? { username: req.body.username } : {}),
      },
    },
    raw: true,
  });

  if (!trainer) {
    message += ` ${additionalMessage}`;
    res.status(404).send({
      message,
    });
  }

  try {
    if (!(await bcrypt.compare(req.body.password, trainer.password))) {
      message += ` ${additionalMessage}`;
      res.status(401).send({
        message,
      });

      return next();
    }
  } catch (err) {
    res.status(500).send({
      message,
    });

    return next();
  }

  const accessToken = generateAccessToken(trainer);
  const refreshToken = jwt.sign(trainer, process.env.REFRESH_TOKEN_SECRET);

  const salt = await bcrypt.genSalt();
  const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

  await models.Token.create({
    trainerId: trainer.id,
    refreshToken: hashedRefreshToken,
  });

  res.json({
    expiresInSeconds: 1800,
    accessToken,
    refreshToken,
  });

  return next();
});

authServer.delete('/logout', async (req, res, next) => {
  const { refreshToken } = req.body;

  const message = 'There was a problem logging out.';

  if (!refreshToken) {
    return res.status(401)
      .send({
        message,
      });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, trainer) => {
    if (err) {
      return res.status(403)
        .send({
          message,
        });
    }

    return models.Token.findAll({
      where: {
        trainerId: trainer.id,
      },
    })
      .then(async (tokens) => {
        if (tokens.length === 0) {
          res.status(200)
            .send({
              message: 'You have successfully logged out.',
            });
          return next();
        }

        let tokenToDelete = null;
        for (const token of tokens) {
          if (await bcrypt.compare(refreshToken, token.refreshToken)) {
            tokenToDelete = token;
            break;
          }
        }

        if (!tokenToDelete) {
          return res.status(403)
            .send({
              message,
            });
        }

        await models.Token.destroy({
          where: {
            id: tokenToDelete.id,
          },
        });

        res.status(200)
          .send({
            message: 'You have successfully logged out.',
          });
        return next();
      });
  });
});

authServer.put('/refresh_token', async (req, res, next) => {
  const { refreshToken } = req.body;

  const message = 'There was a problem refreshing your access token.';

  if (!refreshToken) {
    return res.status(401).send({
      message,
    });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, trainer) => {
    if (err) {
      return res.status(403).send({
        message,
      });
    }

    return models.Token.findAll({
      where: {
        user_id: trainer.id,
      },
    }).then(async (tokens) => {
      let tokenFound = false;
      for (const token of tokens) {
        if (await bcrypt.compare(refreshToken, token.refreshToken)) {
          tokenFound = true;
          break;
        }
      }

      if (!tokenFound) {
        return res.status(403).send({
          message,
        });
      }

      const accessToken = generateAccessToken({ email: trainer.email });
      res.send({
        expiresInSeconds: 1800,
        accessToken,
      });
      return next();
    });
  });
});

authServer.post('/register', async (req, res) => {
  let message = 'There was a problem registering.';

  const { password } = req.body;
  if (!password
    || password.length < parseInt(process.env.MIN_PASSWORD_LENGTH, 10)) {
    message += ' Make sure your password follows the guidelines.';
    return res.status(400).send({
      message,
    });
  }

  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    await models.Trainer.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      picture: req.body.picture || null,
      hometownId: req.body.hometownId || null,
      gender: req.body.gender || null,
      birthday: req.body.birthday ? new Date(req.body.birthday) : null,
    });

    return res.status(201).send({
      message: 'Thank you for registering!',
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      message += ' A trainer with that email and/or username already exists.';
      return res.status(409).send({
        message,
      });
    }
    return res.status(500).send({
      message,
    });
  }
});
