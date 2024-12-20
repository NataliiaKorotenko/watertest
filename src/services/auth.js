import createHttpError from 'http-errors';

import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import Handlebars from 'handlebars';
import jwt from 'jsonwebtoken';

import UserCollection from '../db/models/User.js';
import SessionCollection from '../db/models/Session.js';
/*import WaterCollection from '../db/models/water.js';*/

import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/users.js';

import { sendEmail } from '../utils/sendEmail.js';
import { env } from '../utils/env.js';


import { TEMPLATE_DIR } from '../constants/contacts.js';
import WaterCollection from '../db/models/water.js';

const emailTemplatePath = path.join(TEMPLATE_DIR, 'verify-email.html');

const appDomain = env('APP_DOMAIN');
const jwtSecret = env('JWT_SECRET');
const smtpFrom = env('SMTP_FROM');

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + accessTokenLifetime,
    refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
  };
};

export const register = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email already in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await UserCollection.create({
    ...payload,
    password: hashPassword,
  });

   const templateSource = await fs.readFile(emailTemplatePath, 'utf-8');

  const template = Handlebars.compile(templateSource);

  const token = jwt.sign({ email }, jwtSecret, { expiresIn: '24h' });

  const html = template({
     link: `${appDomain}/auth/verify?token=${token}`,
   });

  const verifyEmail = {
     to: email,
     subject: 'Verify email',
     html,
   };

  await sendEmail(verifyEmail);

  return newUser;
};

export const verify = async (token) => {
  try {
    const { email } = jwt.verify(token, jwtSecret);
    const user = await findUser({ email });
    if (!user) {
      throw createHttpError(404, `${email} not found`);
    }
    return await UserCollection.findByIdAndUpdate(user._id, { verify: true });
  } catch (error) {
    throw createHttpError(401, error.message);
  }
};

export const login = async ({ email, password }) => {
    const user = await UserCollection.findOne({ email });
    if (!user) {
        throw createHttpError(401, 'Email or password invalid');
    }


    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw createHttpError(401, 'Email or password invalid');
    }

  await SessionCollection.deleteOne({ userId: user._id });

    const newSession = createSession();

    return SessionCollection.create({
      userId: user._id,
      ...newSession,
    });
}

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  if (Date.now() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionCollection.deleteOne({ _id: session._id });

  const newSession = createSession();

  return SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

 export const sendResetEmail = async (email) => {
   const user = await UserCollection.findOne({ email });
   if (!user) {
     throw createHttpError(404, 'User not found!');
   }

   const token = jwt.sign({ email }, jwtSecret, { expiresIn: '5m' });

   const resetLink = `${appDomain}/reset-password?token=${token}`;

   const emailTemplate = `
    <p>To reset your password, please click the link below:</p>
    <a href="${resetLink}">${resetLink}</a>
  `;

   const resetEmail = {
     from: smtpFrom,
     to: email,
     subject: 'Reset Password',
     html: emailTemplate,
   };

   try {
     await sendEmail(resetEmail);
   } catch (error) {
     throw createHttpError(
       500,
       'Failed to send the email, please try again later.',
     );
   }

   return {
     status: 200,
     message: 'Reset password email has been successfully sent.',
     data: {},
   };
 };

 export const resetPassword = async ({ token, password }) => {
   try {
     const { email } = jwt.verify(token, jwtSecret);

     const user = await UserCollection.findOne({ email });
     if (!user) {
       throw createHttpError(404, 'User not found!');
     }

     const hashPassword = await bcrypt.hash(password, 10);

     await UserCollection.findByIdAndUpdate(user._id, {
       password: hashPassword,
     });

     await SessionCollection.deleteMany({ userId: user._id });

     return {
       status: 200,
       message: 'Password has been successfully reset.',
       data: {},
     };
   } catch (error) {
     throw createHttpError(401, 'Token is expired or invalid.');
   }
 };


export const logout = (sessionId) =>
  SessionCollection.deleteOne({ _id: sessionId });

export const findSession = (filter) => SessionCollection.findOne(filter);

export const findUser = (filter) => UserCollection.findOne(filter);

/*export const findWater = (filter) => WaterCollection.findOne(filter);*/
