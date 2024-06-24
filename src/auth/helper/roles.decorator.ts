import { SetMetadata } from "@nestjs/common";
import { UserRoles } from "src/user/enum/user-roles.enum";

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);