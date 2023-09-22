import nodemailer from 'nodemailer';

const from = process.env.MAIL_FROM_ADDRESS;

export const sendMail = async (email: string[], subject: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 0,
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      },
    });

    var mail = {
      from: from,
      to: email,
      subject: subject,
      html: html,
    };

    return transporter.sendMail(mail);
  } catch (error) {
    return { ok: false, msg: "Failed to send email" };
  }
  
};