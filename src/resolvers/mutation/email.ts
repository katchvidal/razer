import { MESSAGE } from "./../../config/constants";
import { IResolvers } from "@graphql-tools/utils";
import JWT from "../../lib/jsonwebtoken";
import UserService from "../../services/user.service";
import MailService from "../../services/email.service";
import PasswordService from "../../services/password.service";

const EmailMutationResolvers: IResolvers = {
  Mutation: {
    async SendEmail(_, { mail }) {
      return new MailService().sent(mail);
    },

    async ActiveUserEmail(_, { id, email }) {
      return new UserService(_, { user: { id, email } }, {}).Active();
    },

    async ActiveUserActionEmail(
      _,
      { id, birthday, password },
      { token, MongoDB }
    ) {
      const verificacion = VerifyToken(token, id);
      if (verificacion?.status === false) {
        return {
          status: verificacion.status,
          message: verificacion.message,
        };
      }
      return new UserService(
        _,
        { id, birthday, password },
        { token, MongoDB }
      ).Unblock(true);
    },

    async ResetUserPassword(_, { email }, { MongoDB }) {
      return new PasswordService(
        _,
        { user: { email } },
        { MongoDB }
      ).sendMail();
    },

    async ResetUserPasswordAction(_, { password, id }, { MongoDB, token }) {
      return new PasswordService(
        _,
        { user: { password, id } },
        { token, MongoDB }
      ).ChangePasswordMail();
    },
  },
};

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

export default EmailMutationResolvers;
