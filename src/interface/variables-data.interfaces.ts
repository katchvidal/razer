import { IPaginatioOption } from "./pagination-option.interface";
import { IUser } from "./user.interface";

export interface IVariables {
  id?: string | number;
  genre?: string;
  user?: IUser;
  pagination?: IPaginatioOption;
  password?: string | number;
}
