import axios from "axios";

const USER_SVC_HOST = process.env.DOCKER_USER_SVC_URL || `http://localhost:${process.env.USER_SVC_PORT}`;

export function verifyAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Authentication failed" });
  }
  axios.get(`${USER_SVC_HOST}/api/auth/verify`, {
    headers: {
      Authorization: authHeader,
    },
  }).then(response => {
    const dbUser = response.data.userInfo;
    req.userInfo = { id: dbUser.id, username: dbUser.username, email: dbUser.email, isAdmin: dbUser.isAdmin };
    next();
  }).catch(error => {
    return res.status(error.status).json({ message: error.message });
  });
}

export function verifySameEmail(req, res, next) {
  let email = '';
  if (req.params.email) {
    email = req.params.email;
  } else if (req.body.email) {
    email = req.body.email;
  }
  if (req.userInfo && email === req.userInfo.email) {
    next();
  } else {
    return res.status(403).json({ message: "verifySameEmail failed" });
  }
}
