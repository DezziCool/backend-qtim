import { EntityRepository, MikroORM } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { UserDto } from 'src/dto';
import { UserEntity } from 'src/entities';
import * as nodeCrypto from 'node:crypto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
    readonly orm: MikroORM,
  ) { }

  async create(newUser: UserDto) {
    try {
      const checkUser = await this.get(newUser.email);
      if (checkUser) return { success: false, description: `User exist!` };

      const user = new UserEntity();
      user.email = newUser.email;

      user.password = nodeCrypto
        .createHash(`sha256`)
        .update(newUser.password)
        .digest(`hex`);
      user.refreshTokens = [];

      await this.orm.em.persistAndFlush(user);
      return user;
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }

  async get(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ email });
    return user;
  }

  public async login(user: UserDto) {
    const userEntity = await this.get(user.email);
    if (!userEntity) return { success: false, description: `User not found!` };

    const password = nodeCrypto
      .createHash(`sha256`)
      .update(user.password)
      .digest(`hex`);

    if (password !== userEntity.password) {
      return { success: false, description: `Invalid password` };
    } else {
      return { success: true, user: userEntity };
    }
  }

  async updateTokens(params: {
    email: string;
    refresh: string;
    oldRefresh?: string;
  }) {
    try {
      const { email, refresh, oldRefresh } = params;
      const user = await this.get(email);
      if (!user) return { success: false, description: `User not found!` };

      if (!oldRefresh) user.refreshTokens.push(refresh);
      else {
        const newTokens = user.refreshTokens.map((token) =>
          token !== oldRefresh ? token : refresh,
        );
        user.refreshTokens = newTokens;
      }

      await this.orm.em.persistAndFlush(user);
      return { success: true };
    } catch (err) {
      this.logger.error(err);
      return { success: false, description: `Bad update tokens!` };
    }
  }
}
