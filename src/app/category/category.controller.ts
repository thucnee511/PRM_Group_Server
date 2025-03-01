import { Controller, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthenticationGuard } from "src/common/guards";

@Controller('category')
@ApiTags('Category')
@UseGuards(AuthenticationGuard)
export class CategoryController {

}