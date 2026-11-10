import { Module } from '@nestjs/common';
import { GithubClient } from './github.client';

@Module({
  providers: [GithubClient],
  exports: [GithubClient],
})
export class GithubModule {}
