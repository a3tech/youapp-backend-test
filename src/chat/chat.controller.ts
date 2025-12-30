import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Chat')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('send-message')
  send(@Req() req, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(
      req.user.userId,
      dto.receiverId,
      dto.content,
    );
  }

  @Get('view-messages')
  view(@Req() req, @Query('userId') userId: string) {
    return this.chatService.viewMessages(req.user.userId, userId);
  }
}
