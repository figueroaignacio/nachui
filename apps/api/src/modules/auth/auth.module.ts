import { Module } from '@nestjs/common';
import { GithubModule } from '../github/github.module';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { SessionGuard } from './session.guard';
import { studioConfigProvider } from './studio-config';

@Module({
  imports: [GithubModule],
  controllers: [AuthController],
  providers: [studioConfigProvider, AuthRepository, AuthService, SessionGuard],
  exports: [studioConfigProvider, AuthService, SessionGuard],
})
export class AuthModule {}
