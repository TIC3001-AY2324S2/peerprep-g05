import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ormFindUserByEmail, ormUpdateUser } from "../model/user-orm.js";
import { sendResetPasswordEmail } from "../nodemailer.js";

function generateRandomPassword(length) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

export async function handleLogin(req, res) {
  const { email, password } = req.body;
  if (email && password) {
    try {
      const user = await ormFindUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Wrong email and/or password" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: "Wrong email and/or password" });
      }

      const accessToken = jwt.sign({
        email: email,
      }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return res.status(200).json({
        message: "User logged in",
        token: accessToken,
        userInfo: {
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(400).json({ message: "Missing email and/or password" });
  }
}

export async function handleReset(req, res) {
  const { email } = req.body;
  if (email) {
    try {
      const user = await ormFindUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Wrong email." });
      }

      const password = generateRandomPassword(10);
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const update = await ormUpdateUser(user.id, user.username, email, hashedPassword);
      if (!update) {
        return res.status(500).json({
          message: "Failed to reset password.",
        });
      }
      const status = await sendResetPasswordEmail(email, password);
      if (!status) {
        return res.status(500).json({
          message: "Failed to send reset password email.",
        });
      }
      return res.status(200).json({
        message: "Password reset successfully!",
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(400).json({ message: "Missing email." });
  }
}

export async function handleVerifyToken(req, res) {
  try {
    const userInfo = req.userInfo;
    return res.status(200).json({ message: "Token verified", userInfo });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
