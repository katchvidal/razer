import { FindOneElement, AssignDocumentID } from "./../lib/MongoOperation";
import {
  ACTIVE_VALUES_FILTERS,
  COLLECTIONS,
  EXPIRETIME,
  MESSAGE,
} from "./../config/constants";
import { IContextData } from "./../interface/context-data.interfaces";
import ResolverOperationService from "./resolver.service";
import JsonWebToken from "../lib/jsonwebtoken";
import bcrypt from "bcrypt";
import JWT from "../lib/jsonwebtoken";
import MailService from "./email.service";

class UserService extends ResolverOperationService {
  collection = COLLECTIONS.USERS;

  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }

  /**
   * List of Users
   * @requires String-Name
   * @requires Collection
   * @requires Database
   * @returns
   */
  async items(active: string = ACTIVE_VALUES_FILTERS.ACTIVE) {
    let filter: object = { active: { $ne: false } };
    if (active === ACTIVE_VALUES_FILTERS.ALL) {
      filter = {};
    } else if (active === ACTIVE_VALUES_FILTERS.INACTIVE) {
      filter = { active: false };
    }
    const page = this.getVariables().pagination?.page;
    const items = this.getVariables().pagination?.items;
    const result = await this.List(
      this.collection,
      "Users",
      page,
      items,
      filter
    );
    return {
      status: result.status,
      message: result.message,
      users: result.items,
      info: result.pagination,
    };
  }

  /**
   * Shown a Especific User
   * @requires ID
   * @returns
   */
  async item() {
    const result = await this.GetOne(this.collection, "User");
    return {
      status: result.status,
      message: result.message,
      genre: result.item,
    };
  }

  /**
   * Create New One User
   * @requires UserInput
   * @requires Collection
   * @requires Database
   * @returns
   */
  async Add() {
    const user = this.getVariables().user;
    if (
      user?.password === null ||
      user?.password === undefined ||
      user?.password === ""
    ) {
      return {
        message: `Password has empty please give one`,
        status: false,
        user: null,
      };
    }
    const UserExist = await FindOneElement(this.getMongoDB(), this.collection, {
      email: user?.email,
    });
    if (UserExist) {
      return {
        message: `${user?.email} has already taken`,
        status: false,
        user: null,
      };
    }
    user!.id = await AssignDocumentID(this.getMongoDB(), this.collection);
    user!.create_At = new Date().toISOString();
    user!.password = bcrypt.hashSync(user!.password || "", 10);
    const result = await this.CreateOne(this.collection, user || {}, "User");
    return {
      status: result.status,
      message: result.message,
      user: result.element,
    };
  }

  /**
   * Modify Item "User" Only if Have a Valid Token
   * @requires id
   * @requires UserInput
   * @returns
   */
  async Update() {
    const User = this.getVariables().user;
    if (User === null) {
      return {
        status: false,
        message: "User its not defined",
        user: null,
      };
    }
    const filter = { id: User?.id };
    const result = await this.UpdateOne(this.collection, filter, User!, "User");
    return {
      status: result.status,
      message: result.message,
      user: result.element,
    };
  }

  /**
   * @requires id
   * @returns
   */
  async Delete() {
    const id = this.getVariables().id;
    if (id === null || id === undefined || id === "") {
      return {
        status: true,
        message: `ID Propierty has null or undefined`,
        user: null,
      };
    }
    const result = await this.DeleteOne(this.collection, { id }, "User ");
    return {
      status: result.status,
      message: result.message,
      user: result.element,
    };
  }

  /**
   * @requires email
   * @requires password
   * @returns
   */
  async Login() {
    try {
      const variables = this.getVariables().user;
      const user = await FindOneElement(this.getMongoDB(), this.collection, {
        email: variables?.email,
      });

      if (!user) {
        return {
          status: true,
          message: "Password / Email not valid",
          token: null,
          user: null,
        };
      }

      const PasswordValid = bcrypt.compareSync(
        variables?.password || "",
        user.password
      );

      if (PasswordValid) {
        delete user.password;
        delete user.birthday;
        delete user.create_At;
        delete user.role;
      }

      return {
        status: true,
        message: PasswordValid
          ? "Generate the Token Succesfull Shown Below"
          : "Password / Email not valid",
        user: PasswordValid ? user : null,
        token: PasswordValid ? new JsonWebToken().sign({ user }) : null,
      };
    } catch (error) {
      return {
        status: false,
        message: "Warning Something Went Wrong Contact to Admin",
        user: null,
        token: null,
      };
    }
  }

  /**
   * @requires JSON_WEB_TOKEN
   * @returns
   */
  async auth() {
    let info = new JsonWebToken().verify(this.getContext().token!);
    if (info === MESSAGE.TOKEN_VERIFICATION_FAILED) {
      return {
        message: info,
        status: true,
        user: null,
      };
    }
    return {
      message: "User Authenticated by Token Succesfull",
      status: true,
      user: Object.values(info)[0],
    };
  }

  /**
   * @requires ID
   * @returns Block User
   */
  async Block() {
    const id = this.getVariables().id;

    if (this.fillValue(String(id))) {
      return {
        status: false,
        message: `The identifier has empty`,
        user: null,
      };
    }

    const objectUpdate = {
      active: false,
    };

    const result = await this.UpdateOne(
      this.collection,
      { id },
      objectUpdate,
      "User"
    );

    return {
      status: result.status,
      message: result.message
        ? "Block Active Succesfull"
        : "Something Went Wrong try again",
      user: result.element,
    };
  }

  /**
   *
   * @param unblock
   * @returns User Unblocked
   */
  async Unblock(unblock: boolean) {
    const id = this.getVariables().id;
    const birthday = this.getVariables();
    console.log(birthday);

    if (this.fillValue(String(id))) {
      return {
        status: false,
        message: `The identifier has empty`,
        user: null,
      };
    }

    const objectUpdate = {
      active: unblock,
    };

    const result = await this.UpdateOne(
      this.collection,
      { id },
      objectUpdate,
      "User"
    );
    console.log(result);

    const action = unblock ? "Unblock Succesfull" : "Block Succesfull";
    return {
      status: result.status,
      message: result.message ? `${action}` : "Something Went Wrong try again",
      user: result.element,
    };
  }

  /**
   * @requires ID
   * @requires EMAIL
   * @returns Email to User to Verify it Account
   */
  async Active() {
    const id = this.getVariables().user?.id;
    const email = this.getVariables().user?.email;
    if (email === undefined || email === "") {
      return {
        status: false,
        message: "Email is Empty ",
      };
    }
    const token = new JWT().sign({ user: { id, email } }, EXPIRETIME.H1);
    const html = `Active User Account Click Here: <a href="${process.env.CLIENT_URL}/active/${token}">Click Here </a>`;
    const mail = {
      to: email,
      subject: "Activate User Account",
      html,
    };
    return new MailService().sent(mail);
  }

  //  Funcionalidades
  private fillValue(value: string) {
    return value === "" || value === undefined ? true : false;
  }

  private async checkInDatabase(value: string) {
    return await FindOneElement(this.getMongoDB(), this.collection, {
      name: value,
    });
  }
}

export default UserService;
