
import { HttpContext } from "@adonisjs/core/http";
import { testById, testAll } from "./test_validator.js";
import TestService from "./test_service.js";
import { inject } from "@adonisjs/core";

@inject()
export default class FetchController {
  constructor(private testService: TestService) {}

  public async testById({ request, response, params }: HttpContext) {
    const { id } = await request.validateUsing(testById, {
      data: {id: Number(params.id)}
    })

    const user = await this.testService.getUserById(id);

    return response.json({
      status: 'success',
      data: user
    })
  }

  public async testAll({ request, response }: HttpContext) {
    await request.validateUsing(testAll, {
      data: {}
    })

    const users = await this.testService.getAllUsers()

    return response.json({
      status: 'success',
      data: users
    })
  }
}