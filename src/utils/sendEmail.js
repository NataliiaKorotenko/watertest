import nodemailer from 'nodemailer';
import 'dotenv/config';

/*const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } =
  process.env;

const nodemailerConfig = {
  host: SMTP_HOST,
  port: Number(SMTP_PORT), // Обычно 587 для Brevo
  secure: Number(SMTP_PORT) === 465, // true для порта 465, false для 587
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = (data) => {
  const email = { ...data, from: SMTP_FROM };
  return transport.sendMail(email);
};*/

const { UKR_NET_PASSWORD, UKR_NET_FROM } = process.env;

const nodemailerConfig = {
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_FROM,
    pass: UKR_NET_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = (data) => {
  const email = { ...data, from: UKR_NET_FROM };
  return transport.sendMail(email);
};
