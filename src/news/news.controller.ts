import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { User } from "src/decorators";
import { NewsDto } from "src/dto";
import { AuthGuard } from "src/guards";
import { NewsService } from "./news.service";

@Controller(`/news`)
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Post(`/create`)
  @UseGuards(AuthGuard)
  async createNews(
    @Body() body: NewsDto,
    @User() user: any,
  ) {
    console.log(user);

    return await this.newsService.create(body, user.email);
  }

  @Post(`/update/:id`)
  @UseGuards(AuthGuard)
  async updateNews(
    @Param(`id`, ParseIntPipe) id: number,
    @Body() body: NewsDto,
    @User() user: any,
  ) {
    return await this.newsService.update(id, body, user.email);
  }

  @Post(`/remove/:id`)
  @UseGuards(AuthGuard)
  async removeNews(
    @Param(`id`, ParseIntPipe) id: number,
    @User() user: any,
  ) {
    return await this.newsService.remove(id, user.email);
  }

  @Get(`/`)
  async getNews() {
    return await this.newsService.getLastCreate();
  }
}