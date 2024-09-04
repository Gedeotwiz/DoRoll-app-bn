// import { Injectable } from '@nestjs/common';
// import * as sgMail from '@sendgrid/mail'; 

// @Injectable()
// export class EmailService {
//   constructor() {
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//   }

//   async sendEmail(
//     to: string,
//     subject: string,
//     text: string,
//     html?: string,
//   ): Promise<void> {
//     const msg = {
//       to,
//       from: process.env.SENDGRID_SENDER_EMAIL,
//       subject,
//       text,
//       html,
//     };

//     try {
//       await sgMail.send(msg);
//       console.log('Email sent successfully');
//     } catch (error) {
//       console.error('Error sending email:', error);
//       console.log(error.response.body.errors);

//       throw new Error('Failed to send email');
//     }
//   }
// }


import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, 
    auth: {
      user: "maddison53@ethereal.email",
      pass: "jn7jnAPss4f63QBp6D",
    },
  });

  async function main() {

    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', 
      to: "bar@example.com, baz@example.com", 
      subject: "Hello ✔", 
      text: "Hello world?", 
      html: "<b>Hello world?</b>", 
    });
  
    console.log("Message sent: %s", info.messageId);
    
  }