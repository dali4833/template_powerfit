import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError, firstValueFrom } from 'rxjs';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
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
  private readonly model = 'google/gemini-2.5-pro-preview-03-25';
  private conversationHistory: ChatMessage[] = [];

  constructor(private http: HttpClient) {}

  async initializeConversation(profileData: any): Promise<string> {
    this.clearHistory();
    const systemPrompt = this.createSystemPrompt(profileData);
    const userPrompt = this.createUserPrompt(profileData);
    
    this.conversationHistory.push(
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    );
    
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
      const response = await firstValueFrom(
        this.http.post<OpenRouterResponse>(this.apiUrl, requestBody, { headers }).pipe(
          catchError(this.handleError)
        )
      );

      return this.validateAndProcessResponse(response);
    } catch (error: any) {
      console.error('API Request Failed:', error);
      throw new Error(error.message || 'Erreur de communication avec le serveur');
    }
  }

  private validateAndProcessResponse(response: OpenRouterResponse): string {
    if (!response) {
      throw new Error('Réponse vide du serveur');
    }

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.choices?.[0]?.message?.content) {
      console.warn('Unexpected response structure:', response);
      throw new Error('Structure de réponse inattendue');
    }

    const aiResponse = response.choices[0].message.content;
    this.conversationHistory.push({
      role: 'assistant',
      content: aiResponse
    });

    return aiResponse;
  }

  private createSystemPrompt(profileData: any): string {
    return `Vous êtes un nutritionniste expert français. L'utilisateur a:
- Sexe: ${profileData.gender}
- Taille: ${profileData.height}cm
- Poids: ${profileData.weight}kg
- Activité: ${profileData.trainingPreferences}
- Objectif: ${profileData.dietaryGoals}

Fournissez des conseils précis et personnalisés en français.`;
  }

  private createUserPrompt(profileData: any): string {
    return `Sur la base de mon profil, veuillez me fournir:
1. Mes besoins nutritionnels quotidiens
2. Un plan alimentaire détaillé
3. Des conseils pratiques
4. Des recommandations d'hydratation`;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      return throwError(() => 'Erreur de connexion au serveur');
    }
    
    if (error.error instanceof ErrorEvent) {
      return throwError(() => 'Erreur côté client');
    }

    try {
      const apiError = error.error as OpenRouterResponse;
      return throwError(() => apiError.error?.message || 'Erreur inconnue du serveur');
    } catch (e) {
      return throwError(() => 'Erreur de traitement de la réponse');
    }
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }
}