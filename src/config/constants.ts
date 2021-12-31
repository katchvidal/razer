import enviroment from "./enviroments";

if (process.env.NODE_ENV !== "production") {
  const env = enviroment;
}

export const SECRET_KEY = process.env.SECRET_KEY || "PALABRASECRETAPORDEFAULT";
export const PORT = process.env.PORT || 4000;
export const MONGOCDN = process.env.MONGOCDN || "INVALIDSTRINGCONNECTION";

export enum COLLECTIONS {
  USERS = "users",
  GENRES = "genres",
}

export enum MESSAGE {
  TOKEN_VERIFICATION_FAILED = "TOKEN INVALID SIGN IN AGAIN",
}

/**
 *  H = Horas
 *  M = Minutos
 *  D = Dias
 */

export enum EXPIRETIME {
  H1 = 60 * 60,
  H24 = 24 * H1,
  M15 = H1 / 4,
  M20 = H1 / 3,
  D3 = H24 * 3,
}
