import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NutritionistAIService } from '../../services/nutritionist-ai.service';



interface Message {
  role: 'user' | 'assistant';
  content: string;
  expanded?: boolean;
  previewContent?: string; // Add this property to track expanded state
}

@Component({
  selector: 'app-nutritionist-ai',
  templateUrl: './nutritionist-ai.component.html',
  styleUrls: ['./nutritionist-ai.component.css']
})
export class NutritionistAIComponent implements OnInit {
  nutritionForm: FormGroup;
  messages: Message[] = [];
  userQuery: string = '';
  isLoading: boolean = false;
    // Add these constants for message display
    readonly MESSAGE_PREVIEW_LENGTH = 300;
    readonly MAX_LINES_PREVIEW = 5;
    @ViewChild('messageContainer') private messageContainer!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private NutritionistAIService: NutritionistAIService
  ) {
    this.nutritionForm = this.fb.group({
      gender: ['male', Validators.required],
      height: [null, [Validators.required, Validators.min(100), Validators.max(250)]],
      weight: [null, [Validators.required, Validators.min(30), Validators.max(300)]],
      trainingPreferences: ['moderate', Validators.required],
      dietaryGoals: ['maintenance', Validators.required]
    });
  }

  ngOnInit(): void {
    this.addAssistantMessage("Bonjour ! Je suis votre nutritionniste AI. Remplissez votre profil pour obtenir des recommandations personnalisées.");
  }

 // In your component
// In your component
async submitProfile(): Promise<void> {
  if (this.nutritionForm.valid) {
    this.isLoading = true;
    try {
      const response = await this.NutritionistAIService.initializeConversation(
        this.nutritionForm.value
      );
      this.addAssistantMessage(response);
    } catch (error: any) {
      this.addAssistantMessage(error.message || 'Error creating profile');
      console.error('Profile error:', error);
    } finally {
      this.isLoading = false;
    }
  }
}

async sendMessage(): Promise<void> {
  if (this.userQuery.trim()) {
    this.addUserMessage(this.userQuery);
    this.isLoading = true;
    try {
      const response = await this.NutritionistAIService.continueConversation(this.userQuery);
      this.addAssistantMessage(response);
    } catch (error: any) {
      this.addAssistantMessage(error.message || 'Error in conversation');
    } finally {
      this.isLoading = false;
      this.userQuery = '';
    }
  }
}

  private addUserMessage(content: string): void {
    this.messages.push({ role: 'user', content });
    this.scrollToBottom();
  }

  private addAssistantMessage(content: string): void {
    // Formater les listes et les sauts de ligne
    const formattedContent = content.replace(/\n/g, '<br>')
                                   .replace(/\•/g, '•');
    this.messages.push({ role: 'assistant', content: formattedContent });
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      } catch(err) { }
    }, 100);
  }
  
    // Add this new method to toggle message expansion
    toggleMessageExpand(message: Message): void {
      message.expanded = !message.expanded;
      // Scroll to the message after toggling
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    }
  
    // Add this helper method to determine if message should be collapsible
    isLongMessage(content: string): boolean {
      return content.length > this.MESSAGE_PREVIEW_LENGTH || 
             (content.split('\n').length > this.MAX_LINES_PREVIEW);
    }
  
}
