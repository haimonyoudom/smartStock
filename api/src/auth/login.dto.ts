import { isEmail } from "class-validator";

export interface LoginDto {
    @isEmail()
    email: string;
    @isLength({ min: 6 })
    password: string;
}