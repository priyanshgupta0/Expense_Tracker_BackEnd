import { Request } from "express";
import { IUser } from "../models/User";

export interface IUserRequest extends Request {
  user: IUser;
}
