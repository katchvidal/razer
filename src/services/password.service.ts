import { FindOneElement, UpdateOneElement } from "./../lib/MongoOperation";
import { IContextData } from "./../interface/context-data.interfaces";
import { COLLECTIONS, EXPIRETIME, MESSAGE } from "./../config/constants";
import ResolverOperationService from "./resolver.service";
import JWT from "../lib/jsonwebtoken";
import MailService from "./email.service";
import bcrypt from "bcrypt";

class PasswordService extends ResolverOperationService {
  collection = COLLECTIONS.USERS;
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }

  /**
   * @requires email
   * @returns EMAIL MESSAGE TO RESET PASSWORD
   */
  async sendMail() {
    const email = this.getVariables().user?.email;
    if (email === undefined || email === "") {
      return {
        status: false,
        message: "Email is Empty",
      };
    }
    const User = await FindOneElement(this.getMongoDB(), this.collection, {
      email,
    });
    if (!User) {
      return {
        status: false,
        message: `User ${email} not Exist `,
      };
    }
    const newUser = {
      id: User.id,
      email,
    };
    const token = new JWT().sign({ user: newUser }, EXPIRETIME.H1);
    const html = `Request User Resset Password Click Here: <a href="${process.env.CLIENT_URL}/resset/${token}">Click Here </a>`;
    const mail = {
      to: email,
      subject: `Request Reset User Password`,
      html,
    };

    return new MailService().sent(mail);
  }

  /**
   * @requires ID
   * @requires PASSWORD
   * @returns
   */
  async ChangePasswordMail() {
    const id = this.getVariables().user?.id;
    let password = this.getVariables().user?.password;
    const token = this.getContext().token;
    const verificacion = VerifyToken(String(token), String(id));
    if (verificacion?.status === false) {
      return {
        status: verificacion.status,
        message: verificacion.message,
      };
    }

    if (password === undefined || password === "") {
      return {
        status: false,
        message: "Password is Empty or Undefined",
      };
    }
    // Encrypt Password
    password = bcrypt.hashSync(password, 10);
    // Actualizar Password en ID USER
    return await UpdateOneElement(
      this.getMongoDB(),
      this.collection,
      { id },
      { password }
    )
      .then((res) => {
        if (res.modifiedCount === 1) {
          return {
            status: true,
            message: "User Password Change Succesfull",
          };
        }
        return {
          stauts: false,
          message: "User not Found",
        };
      })
      .catch((err) => {
        if (err) {
          return {
            status: false,
            message: `Something Went Wrong: ${err}`,
          };
        }
      });
  }
}

/**
 *
 * @param token
 * @param id
 * @returns
 */
function VerifyToken(token: string, id: string) {
  const ValidToken = new JWT().verify(token);
  if (ValidToken === MESSAGE.TOKEN_VERIFICATION_FAILED) {
    return {
      status: false,
      message: "Token no valid / Try Again",
    };
  }

  const usuario: any = Object.values(ValidToken)[0];
  if (id !== usuario.id) {
    return {
      status: false,
      message:
        "Permission Denied You not Have Authorization to Change Other ID USER",
    };
  }
}

export default PasswordService;
