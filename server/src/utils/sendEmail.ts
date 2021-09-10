import nodemailer from "nodemailer";
import { env } from "process";

const output = (emailTo: string, token: string) => {
  return `
 <p>You have access to the Church Mutual Assignment Tool.</p>
 <p>Follow this link to create new password for your account ${emailTo}:</p>
   <a href="Reset Password">
     ${env.CORS_ORIGIN}/${token}
   </a>
   <p>Thanks,</p>
   <p>Cedryc</p>
`;
};
// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(emailTo: string, token: string) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let transporter = await nodemailer.createTransport({
    host: process.env.DOMAIN_SMTP,
    port: 587,
    secure: true, // upgrade later with STARTTLS
    auth: {
      user: process.env.DOMAIN_USER,
      pass: process.env.DOMAIN_PW,
    },
  });
  // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  //   host: "smtp.ethereal.email",
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: 'lbyszgm7ka7qs5gh@ethereal.email',
  //     pass: 'EsHdsk34Z5G6QNpaRp',
  //   },
  // });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"🛹 ForUm! 🛹" <info@cedryc.me>', // sender address
    to: emailTo, // list of receivers
    subject: "Change Password", // Subject line
    html: output(emailTo, token),
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
/*testAccount {

  smtp: { host: 'smtp.ethereal.email', port: 587, secure: false },
  imap: { host: 'imap.ethereal.email', port: 993, secure: true },
  pop3: { host: 'pop3.ethereal.email', port: 995, secure: true },
  web: 'https://ethereal.email'
} */
