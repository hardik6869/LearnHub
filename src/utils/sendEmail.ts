import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import type SMTPPool from "nodemailer/lib/smtp-pool";

export interface EmailOptions {
  to: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  // Note: maxConnections/maxMessages are SMTP pool options and only take effect with `pool: true` (see review)
  const transportOptions: SMTPTransport.Options &
    Pick<SMTPPool.Options, "maxConnections" | "maxMessages"> = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    maxConnections: 5, // Maximum number of simultaneous connections (default: 5)
    maxMessages: 100, // Messages per connection before reconnecting (default: 100)
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  };
  const transporter = nodemailer.createTransport(transportOptions);

  // Send emails using the shared transporter.
  // Do NOT create a new transporter for each message - that defeats the purpose of pooling.
  const info = await transporter.sendMail({
    from: `"${String(process.env.FROM_NAME)}" <${String(process.env.FROM_EMAIL)}>`,
    to: options.to,
    subject: options.subject,
    text: options.message,
  });

  console.log("Message sent: %s", info.messageId);
};

export default sendEmail;
