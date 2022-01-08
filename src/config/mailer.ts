import chalk from "chalk";
import nodemailer from "nodemailer";

// create reusable transporter object using the default SMTP transport
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.USER_EMAIL, // generated ethereal user
    pass: process.env.USER_PASSWORD, // generated ethereal password
  },
});

transporter
  .verify()
  .then(() => {
    console.log("================SERVER EMAIL NODEMAILER================");
    console.log(`STATUS: ${chalk.greenBright("ONLINE")}`);
    console.log(`SERVER EMAIL: ${chalk.greenBright("CONNECT")}`);
  })
  .catch((err) => {
    console.log("================SERVER EMAIL NODEMAILER================");
    console.log(`STATUS: ${chalk.redBright("OFFLINE")}`);
    console.log(`SERVER EMAIL: ${chalk.redBright(err)}`);
  });
