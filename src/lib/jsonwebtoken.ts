import { IJWT } from "./../interface/jsonwebtoken.interface";
import { EXPIRETIME, MESSAGE, SECRET_KEY } from "./../config/constants";
import jsonwebtoken from "jsonwebtoken";

class JWT {
  private secret_key = SECRET_KEY as string;

  sign(data: IJWT, expiresIn: number = EXPIRETIME.H24) {
    return jsonwebtoken.sign({ user: data.user }, this.secret_key, {
      expiresIn,
    });
  }

  verify(token: string) {
    try {
      return jsonwebtoken.verify(token, this.secret_key) as string;
    } catch (error) {
      return MESSAGE.TOKEN_VERIFICATION_FAILED;
    }
  }
}

export default JWT;
