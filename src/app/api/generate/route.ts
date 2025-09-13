import { NextRequest, NextResponse } from 'next/server'
import { AIImageGenerator, type GenerationOptions } from '@/lib/ai-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { prompt, style, aspectRatio, quality } = body
    
    // Validate required fields
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Validate prompt
    const validation = AIImageGenerator.validatePrompt(prompt)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.message },
        { status: 400 }
      )
    }

    // Prepare generation options
    const options: GenerationOptions = {
      prompt: prompt.trim(),
      style: style || 'default',
      aspectRatio: aspectRatio || '1:1',
      quality: quality || 'standard'
    }

    // Generate image using AI client
    const result = await AIImageGenerator.generateImage(options)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        imageUrl: result.imageUrl,
        metadata: result.metadata
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('API Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Image Generation API',
    endpoint: 'POST /api/generate',
    requiredFields: ['prompt'],
    optionalFields: ['style', 'aspectRatio', 'quality']
  })
}