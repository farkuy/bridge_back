import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Token } from './token.entity';

@Injectable()
export class TokensRepository extends Repository<Token> {
  constructor(private dataSource: DataSource) {
    super(Token, dataSource.createEntityManager());
  }

  async findByUserId(id: number) {
    return await this.findOne({ where: { user: id } });
  }

  async saveNewToken(token: string) {
    return;
  }
}
