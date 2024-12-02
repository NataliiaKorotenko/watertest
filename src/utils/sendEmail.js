import nodemailer from 'nodemailer';

import { SMTP } from '../constants/contacts.js';
import { env } from '../utils/env.js';

const transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: Number(env(SMTP.SMTP_PORT)),
  secure: false,
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
});

export const sendEmail = async (options) => {
return await transporter.sendMail(options);
};

 /*Тестова функція для перевірки
const testEmail = async () => {
  try {
    const result = await sendEmail({
      from: env(SMTP.SMTP_USER), // Ваш email (відправник)
      to: 'recipient@example.com', // Email отримувача
      subject: 'Test Email',
      text: 'This is a test email sent from Node.js',
    });
    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Виклик тестової функції
testEmail();

/*const { UKR_NET_PASSWORD, UKR_NET_FROM } = process.env;

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
};*/
