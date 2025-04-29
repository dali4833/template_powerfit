import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  choices?: {
    message: {
      content: string;
    };
  }[];
  error?: {
    message: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NutritionistAIService {
  private readonly apiKey = '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';
  private readonly apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly model = 'tngtech/deepseek-r1t-chimera:free';
  private conversationHistory: ChatMessage[] = [];

  constructor(private http: HttpClient) {}

  async initializeConversation(profileData: any): Promise<string> {
    this.clearHistory();
    
    // System message sets the AI's role and context
    this.conversationHistory.push({
      role: 'system',
      content: this.createSystemPrompt(profileData)
    });
    
    // User message contains the specific request
    const userMessage = this.createUserPrompt(profileData);
    this.conversationHistory.push({
      role: 'user',
      content: userMessage
    });
    
    return this.sendChatRequest();
  }

  async continueConversation(userMessage: string): Promise<string> {
    this.conversationHistory.push({
      role: 'user',
      content: userMessage
    });
    return this.sendChatRequest();
  }

  private async sendChatRequest(): Promise<string> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.href,
      'X-Title': 'Nutritionist AI'
    });

    const requestBody = {
      model: this.model,
      messages: this.conversationHistory,
      temperature: 0.7,
      max_tokens: 1500
    };

    try {
      const response = await this.http.post<OpenRouterResponse>(
        this.apiUrl,
        requestBody,
        { headers }
      ).pipe(
        catchError(this.handleError)
      ).toPromise();

      if (!response?.choices?.[0]?.message?.content) {
        throw new Error('Empty server response');
      }

      const aiResponse = response.choices[0].message.content;
      
      // Add AI response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse
      });

      return aiResponse;
    } catch (error: any) {
      console.error('API Error:', error);
      throw error;
    }
  }

  private createSystemPrompt(profileData: any): string {
    return `You are a professional nutritionist. The user has the following profile:
- Gender: ${profileData.gender}
- Height: ${profileData.height}cm
- Weight: ${profileData.weight}kg
- Activity Level: ${profileData.trainingPreferences}
- Goals: ${profileData.dietaryGoals}

Provide detailed recommendations in French including:
1. Daily calorie needs
2. Macronutrient distribution
3. Water intake recommendation
4. Meal plan suggestions
5. General nutrition advice

Format with clear headings and bullet points.`;
  }

  private createUserPrompt(profileData: any): string {
    return `Based on my profile, please provide:
1. My nutritional needs analysis
2. A personalized meal plan
3. Hydration recommendations
4. Practical tips to achieve my goals`;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Client error:', error.error.message);
      return throwError(() => 'Network error');
    } else {
      console.error(`Server error ${error.status}:`, error.error);
      if (typeof error.error === 'string' && error.error.startsWith('<!DOCTYPE')) {
        return throwError(() => 'Server returned HTML instead of JSON');
      }
      return throwError(() => error.error?.error?.message || 'Server error');
    }
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }
}