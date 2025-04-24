import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import 'emoji-picker-element';
import { User } from './model/User';
import { ChatMessage } from './model/ChatMessage';
import { WebSocketService } from './service/web-socket.service';
import { ChatService } from './service/chat.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  users: User[] = [];
  selectedUser: User | null = null;
  messages: ChatMessage[] = [];
  newMessage: string = '';
  currentUserId: number | null = null;
  showEmojiPicker = false;
  private messageSubscription: Subscription = new Subscription();
  private messagePollingInterval: any;

  hideRequiredControl = new FormControl(false);
  yourFormControl = new FormControl('');

  constructor(
    private chatService: ChatService,
    private webSocketService: WebSocketService,
    private StorageService: AuthService
  ) {}

  ngOnInit(): void {
    this.StorageService.getCurrentUser().subscribe(user => {
      this.currentUserId = user.id;
    });

    this.chatService.getUsers().subscribe(users => {
      this.users = users;
    });

    this.webSocketService.connect();

    this.messageSubscription = this.webSocketService.getMessageSubject().subscribe(message => {
      // Handle WebSocket message if needed
    });

    this.messagePollingInterval = setInterval(() => {
      if (this.selectedUser && this.selectedUser.id !== undefined) {
        this.chatService.getChatMessages(this.selectedUser.id).subscribe(fetchedMessages => {
          if (fetchedMessages.length > this.messages.length) {
            const newMessages = fetchedMessages.slice(this.messages.length);
            this.messages.push(...newMessages);
            setTimeout(() => this.scrollToBottom(), 100);
          }
        });
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
    this.messageSubscription.unsubscribe();
    clearInterval(this.messagePollingInterval);
  }

  selectUser(user: User): void {
    this.selectedUser = user;
    if (user.id !== undefined) {
      this.chatService.getChatMessages(user.id).subscribe(messages => {
        this.messages = messages;
        setTimeout(() => this.scrollToBottom(), 100);
      });
    } else {
      console.error('Selected user ID is undefined');
    }
  }

  sendMessage(): void {
    if (this.selectedUser && this.selectedUser.id !== undefined && this.newMessage.trim() !== '') {
      this.StorageService.getCurrentUser().subscribe(user => {
        if (user?.id !== undefined) {
          const message: ChatMessage = {
            senderId: user.id,
            recipientId: this.selectedUser!.id,
            content: this.newMessage,
            timestamp: new Date()
          };

          this.chatService.sendMessage(message).subscribe();
          this.webSocketService.sendMessage('/app/chat', message);
          this.messages.push(message);
          this.newMessage = '';
          setTimeout(() => this.scrollToBottom(), 100);
        } else {
          console.error('Current user ID is undefined');
        }
      });
    } else {
      console.error('Invalid selected user or message');
    }
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(emoji: string | undefined): void {
    if (emoji) {
      this.newMessage += emoji;
    }
  }
}
