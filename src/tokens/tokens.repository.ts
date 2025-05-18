import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Token } from './token.entity';
import { User } from '../users/users.entity';

@Injectable()
export class TokensRepository extends Repository<Token> {
  constructor(private dataSource: DataSource) {
    super(Token, dataSource.createEntityManager());
  }

  async findByUser(user: User) {
    return await this.findOne({ where: { user } });
  }
}
