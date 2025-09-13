'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AIImageGenerator, type GenerationOptions, type GenerationResult } from '@/lib/ai-client'

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  aspectRatio: string;
  quality: string;
  generatedAt: string;
}

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('default')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [quality, setQuality] = useState('standard')
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null)
  const [generationHistory, setGenerationHistory] = useState<GeneratedImage[]>([])
  const [error, setError] = useState<string | null>(null)

  // Load generation history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ai-generation-history')
    if (saved) {
      try {
        setGenerationHistory(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load generation history:', e)
      }
    }
  }, [])

  // Save generation history to localStorage
  const saveToHistory = (image: GeneratedImage) => {
    const updated = [image, ...generationHistory].slice(0, 50) // Keep last 50 generations
    setGenerationHistory(updated)
    localStorage.setItem('ai-generation-history', JSON.stringify(updated))
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    const validation = AIImageGenerator.validatePrompt(prompt)
    if (!validation.valid) {
      setError(validation.message!)
      return
    }

    setIsGenerating(true)
    setError(null)
    setCurrentImage(null)

    const options: GenerationOptions = {
      prompt: prompt.trim(),
      style,
      aspectRatio,
      quality
    }

    try {
      const result: GenerationResult = await AIImageGenerator.generateImage(options)
      
      if (result.success && result.imageUrl && result.metadata) {
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          url: result.imageUrl,
          prompt: result.metadata.prompt,
          style: result.metadata.style,
          aspectRatio: result.metadata.aspectRatio,
          quality: result.metadata.quality,
          generatedAt: result.metadata.generatedAt
        }
        
        setCurrentImage(newImage)
        saveToHistory(newImage)
      } else {
        setError(result.error || 'Failed to generate image')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const loadFromHistory = (image: GeneratedImage) => {
    setPrompt(image.prompt)
    setStyle(image.style)
    setAspectRatio(image.aspectRatio)
    setQuality(image.quality)
    setCurrentImage(image)
    setError(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Generation Controls */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate AI Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Prompt Input */}
              <div className="space-y-2">
                <Label htmlFor="prompt">Describe your image</Label>
                <Textarea
                  id="prompt"
                  placeholder="A majestic mountain landscape at sunrise with misty valleys and golden light..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Be descriptive for better results. Include style, colors, mood, and composition details.
                </p>
              </div>

              {/* Generation Options */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="style">Art Style</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger id="style">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="photorealistic">Photorealistic</SelectItem>
                      <SelectItem value="artistic">Artistic</SelectItem>
                      <SelectItem value="abstract">Abstract</SelectItem>
                      <SelectItem value="sketch">Sketch</SelectItem>
                      <SelectItem value="digital">Digital Art</SelectItem>
                      <SelectItem value="cinematic">Cinematic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger id="aspect-ratio">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1:1">Square (1:1)</SelectItem>
                      <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                      <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                      <SelectItem value="4:3">Standard (4:3)</SelectItem>
                      <SelectItem value="3:4">Portrait (3:4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality">Quality</Label>
                  <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger id="quality">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="ultra">Ultra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !prompt.trim()}
                size="lg"
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Generate Image'}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Image Display */}
          {(currentImage || isGenerating) && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Image</CardTitle>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-muted-foreground">Creating your image...</p>
                      <p className="text-xs text-muted-foreground">This may take up to 5 minutes</p>
                    </div>
                  </div>
                ) : currentImage ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={currentImage.url}
                        alt={currentImage.prompt}
                        className="w-full rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3f6bc909-b3a6-4733-819d-7d76cb2dfeb9.png';
                        }}
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{currentImage.style}</Badge>
                      <Badge variant="secondary">{currentImage.aspectRatio}</Badge>
                      <Badge variant="secondary">{currentImage.quality}</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Prompt:</Label>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        {currentImage.prompt}
                      </p>
                    </div>
                    
                    <Button 
                      onClick={() => downloadImage(currentImage.url, `ai-generated-${currentImage.id}.png`)}
                      variant="outline"
                      className="w-full"
                    >
                      Download Image
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Generation History Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Generation History</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {generationHistory.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No generations yet. Create your first image!
                    </p>
                  ) : (
                    generationHistory.map((image, index) => (
                      <div key={image.id}>
                        <div 
                          className="cursor-pointer group"
                          onClick={() => loadFromHistory(image)}
                        >
                          <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-2">
                            <img
                              src={image.url}
                              alt={image.prompt}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b05651d1-94cb-4893-8297-085303c31252.png';
                              }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors">
                            {image.prompt}
                          </p>
                          <div className="flex gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {image.style}
                            </Badge>
                          </div>
                        </div>
                        {index < generationHistory.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}