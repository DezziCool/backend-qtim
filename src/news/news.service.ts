import { EntityRepository, MikroORM } from "@mikro-orm/core";
import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { NewsDto } from "src/dto";
import { NewsEntity } from "src/entities";
import { InjectRepository } from "@mikro-orm/nestjs";
import { UserService } from "src/user/user.service";

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);

  constructor(
    readonly orm: MikroORM,
    @InjectRepository(NewsEntity)
    private readonly newsRepository: EntityRepository<NewsEntity>,
    private readonly userService: UserService,
  ) { }

  async getLastCreate() {
    return this.newsRepository.findAll({ limit: 10, orderBy: { createdAt: 'desc' } });
  }

  async getOne(params: { id: number; userEmail: string; }) {
    const { id, userEmail } = params;

    return this.newsRepository.findOne(
      { id, author: { email: userEmail } },
      { populate: ['author'] }
    );
  }

  async create(createNewsDto: NewsDto, email: string) {
    try {
      const user = await this.userService.get(email)
      if (!user) return { success: false, description: `User not found!` };

      const newsEntity = new NewsEntity();
      newsEntity.title = createNewsDto.title;
      newsEntity.description = createNewsDto.description;
      newsEntity.picture = createNewsDto.picture;
      newsEntity.author = user;

      await this.orm.em.persistAndFlush(newsEntity);
      return { success: true, description: 'Created!' };
    } catch (err) {
      this.logger.error(err);
      return { success: false, description: `Bad create news!` };
    }
  }

  async update(id: number, update: NewsDto, email: string) {
    try {
      let news = await this.getOne({ id, userEmail: email });
      if (!news) return { success: false, description: `News not found!` }

      news = Object.assign(news, update);

      await this.orm.em.persistAndFlush(news);

      return { success: true, description: 'News Updated!' };
    } catch (err) {
      this.logger.error(err);
      return { success: false, description: `Bad update news!` }
    }
  }

  async remove(id: number, email: string) {
    try {
      let news = await this.getOne({ id, userEmail: email });
      if (!news) return { error: true, code: `NEWS_NOT_FOUND` };

      await this.orm.em.removeAndFlush(news);
      return { success: true, description: 'News Removed!' };
    } catch (err) {
      this.logger.error(err);
      return { success: false, description: `Bad remove news!` }
    }
  }
}