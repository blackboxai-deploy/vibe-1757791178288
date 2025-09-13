export interface GenerationOptions {
  prompt: string;
  style?: string;
  aspectRatio?: string;
  quality?: string;
}

export interface GenerationResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
  metadata?: {
    prompt: string;
    style: string;
    aspectRatio: string;
    quality: string;
    generatedAt: string;
  };
}

const AI_ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
const DEFAULT_MODEL = 'replicate/black-forest-labs/flux-1.1-pro';

const AI_HEADERS = {
  'customerId': 'cus_T2p2cVuFbFoUPu',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer xxx'
} as const;

export class AIImageGenerator {
  private static async makeRequest(prompt: string, options: GenerationOptions): Promise<Response> {
    const enhancedPrompt = AIImageGenerator.enhancePrompt(prompt, options);
    
    const requestBody = {
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'user',
          content: enhancedPrompt
        }
      ]
    };

    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: AI_HEADERS,
      body: JSON.stringify(requestBody),
    });

    return response;
  }

  private static enhancePrompt(prompt: string, options: GenerationOptions): string {
    let enhancedPrompt = prompt;

    // Add style guidance
    if (options.style && options.style !== 'default') {
      const stylePrompts = {
        photorealistic: 'photorealistic, highly detailed, professional photography, 8K resolution',
        artistic: 'artistic style, painterly, creative interpretation, vibrant colors',
        abstract: 'abstract art style, geometric patterns, creative composition',
        sketch: 'pencil sketch style, hand-drawn, artistic line work',
        digital: 'digital art style, modern, clean, professional illustration',
        cinematic: 'cinematic lighting, dramatic composition, movie-like quality'
      };
      
      const stylePrompt = stylePrompts[options.style as keyof typeof stylePrompts];
      if (stylePrompt) {
        enhancedPrompt = `${prompt}, ${stylePrompt}`;
      }
    }

    // Add quality enhancement
    if (options.quality === 'high' || options.quality === 'ultra') {
      enhancedPrompt += ', high quality, detailed, professional';
    }

    // Add aspect ratio guidance
    if (options.aspectRatio && options.aspectRatio !== '1:1') {
      const ratioMap = {
        '16:9': 'wide landscape format',
        '9:16': 'vertical portrait format',
        '4:3': 'standard photograph format',
        '3:4': 'portrait format'
      };
      
      const ratioPrompt = ratioMap[options.aspectRatio as keyof typeof ratioMap];
      if (ratioPrompt) {
        enhancedPrompt += `, ${ratioPrompt}`;
      }
    }

    return enhancedPrompt;
  }

  public static async generateImage(options: GenerationOptions): Promise<GenerationResult> {
    try {
      if (!options.prompt || options.prompt.trim().length === 0) {
        return {
          success: false,
          error: 'Prompt is required'
        };
      }

      const response = await AIImageGenerator.makeRequest(options.prompt, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `AI service error: ${response.status} - ${errorText}`
        };
      }

      const data = await response.json();
      
      // Extract image URL from response
      let imageUrl: string | undefined;
      
      if (data.choices?.[0]?.message?.content) {
        const content = data.choices[0].message.content;
        
        // Try to extract URL from various response formats
        if (typeof content === 'string') {
          // Look for URLs in the response
          const urlMatch = content.match(/https?:\/\/[^\s<>"{}|\\^`[\]]+\.(jpg|jpeg|png|webp|gif)/i);
          if (urlMatch) {
            imageUrl = urlMatch[0];
          }
        }
      }

      if (!imageUrl) {
        return {
          success: false,
          error: 'No image URL found in response'
        };
      }

      return {
        success: true,
        imageUrl,
        metadata: {
          prompt: options.prompt,
          style: options.style || 'default',
          aspectRatio: options.aspectRatio || '1:1',
          quality: options.quality || 'standard',
          generatedAt: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('AI Image Generation Error:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public static validatePrompt(prompt: string): { valid: boolean; message?: string } {
    if (!prompt || prompt.trim().length === 0) {
      return { valid: false, message: 'Prompt cannot be empty' };
    }

    if (prompt.length < 3) {
      return { valid: false, message: 'Prompt is too short (minimum 3 characters)' };
    }

    if (prompt.length > 1000) {
      return { valid: false, message: 'Prompt is too long (maximum 1000 characters)' };
    }

    // Check for potentially inappropriate content patterns
    const inappropriatePatterns = [
      /\b(nude|naked|nsfw|explicit|sexual)\b/i,
      /\b(violence|violent|blood|gore|kill)\b/i
    ];

    for (const pattern of inappropriatePatterns) {
      if (pattern.test(prompt)) {
        return { 
          valid: false, 
          message: 'Prompt contains inappropriate content. Please modify your request.' 
        };
      }
    }

    return { valid: true };
  }
}