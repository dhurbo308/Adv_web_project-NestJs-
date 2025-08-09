import { Matches, IsEmail, IsIn, IsInt, Min } from "class-validator";
import { SellerName } from "./validators/name.validator";

export class SellerDTO {
  @SellerName()
  fullName: string;

  @IsEmail({}, { message: "Email must be valid and contain @ character" })
  @Matches(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.xyz$/, {
    message: "Email must end with .xyz domain",
  })
  email: string;

  @Matches(/^\d{10,17}$/, {
    message: "NID must be a number with 10 to 17 digits",
  })
  nid: string;

  @IsInt({ message: "Age must be an integer" })
  @Min(0, { message: "Age must be a non-negative number" })
  age: number;

  @IsIn(["active", "inactive"], {
    message: "Status must be either 'active' or 'inactive'",
  })
  status: string = "active";
  
}

