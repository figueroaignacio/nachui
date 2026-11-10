import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { GithubModule } from '../github/github.module';
import { RagModule } from '../rag/rag.module';
import { RegistryModule } from '../registry/registry.module';
import { CatalogService } from './catalog.service';
import { StudioController } from './studio.controller';
import { StudioRepository } from './studio.repository';
import { StudioService } from './studio.service';

@Module({
  imports: [AuthModule, GithubModule, RagModule, RegistryModule],
  controllers: [StudioController],
  providers: [CatalogService, StudioRepository, StudioService],
})
export class StudioModule {}
