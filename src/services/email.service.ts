import { transporter } from "../config/mailer";
import { IMailOption } from "./../interface/mail.interface";

class MailService {
  /**
   *
   * @param mail
   * @returns Mail to User
   */
  sent(mail: IMailOption) {
    return new Promise((resolver, reject) => {
      transporter.sendMail(
        {
          from: '"Test Katchvidal Online Shop 👻" <vfktechnologies@gmail.com>', // sender address
          to: mail.to, //"katchvidal@gmail.com", // list of receivers
          subject: mail.subject, //"Hello ✔", // Subject line
          //text: "Hello world?", // plain text body
          html: mail.html, //"<b>Hello world?</b>", // html body
        },
        (err, _) => {
          err
            ? reject({
                status: false,
                message: err,
              })
            : resolver({
                status: true,
                message: `Mail Succesfull Sento to: ${mail.to}`,
                mail,
              });
        }
      );
    });
  }
}

export default MailService;
