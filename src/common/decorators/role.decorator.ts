import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../models';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
