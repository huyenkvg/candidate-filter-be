import { IsOptional } from "class-validator";

export class User {
  id: number;
  username: string;
  password: string;
  role_id: number;

  @IsOptional()
  role: any;

  active: boolean;
  profile: any;
}
