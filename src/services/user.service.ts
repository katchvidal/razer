import {
  FindOneElement,
  AssignDocumentID,
  InserOneElement,
} from "./../lib/MongoOperation";
import { COLLECTIONS, MESSAGE } from "./../config/constants";
import { IContextData } from "./../interface/context-data.interfaces";
import ResolverOperationService from "./resolver.service";
import JsonWebToken from "../lib/jsonwebtoken";
import bcrypt from "bcrypt";

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
  async items() {
    const result = await this.List(this.collection, "Users");
    return {
      status: result.status,
      message: result.message,
      users: result.items,
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
        status: true,
        user: null,
      };
    }
    const UserExist = await FindOneElement(this.getMongoDB(), this.collection, {
      email: user?.email,
    });
    if (UserExist) {
      return {
        message: `${user?.email} has already taken`,
        status: true,
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

    if (User === null || User === undefined || User === "") {
      return {
        status: false,
        message: "User its undefined",
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
