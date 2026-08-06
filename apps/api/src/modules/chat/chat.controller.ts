import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Every request fans out into model + tool calls (embeddings, DB, Gemini),
  // so this endpoint gets a much stricter budget than the global default.
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @Post()
  async chat(@Body() createChatDto: CreateChatDto, @Res() res: Response, @Req() req: Request) {
    const abortController = new AbortController();
    req.on('close', () => abortController.abort());

    await this.chatService.streamChat(createChatDto.messages ?? [], res, abortController.signal);
  }
}
