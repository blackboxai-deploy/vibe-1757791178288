'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  aspectRatio: string;
  quality: string;
  generatedAt: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [styleFilter, setStyleFilter] = useState('all')

  const [filteredImages, setFilteredImages] = useState<GeneratedImage[]>([])

  // Load images from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ai-generation-history')
    if (saved) {
      try {
        const parsedImages = JSON.parse(saved)
        setImages(parsedImages)
        setFilteredImages(parsedImages)
      } catch (e) {
        console.error('Failed to load images:', e)
      }
    }
  }, [])

  // Filter images based on search and style
  useEffect(() => {
    let filtered = images

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(image =>
        image.prompt.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by style
    if (styleFilter !== 'all') {
      filtered = filtered.filter(image => image.style === styleFilter)
    }

    setFilteredImages(filtered)
  }, [images, searchTerm, styleFilter])

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

  const clearGallery = () => {
    if (window.confirm('Are you sure you want to clear all images? This action cannot be undone.')) {
      localStorage.removeItem('ai-generation-history')
      setImages([])
      setFilteredImages([])
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getUniqueStyles = () => {
    const styles = Array.from(new Set(images.map(img => img.style)))
    return styles.filter((style: string) => style !== 'default')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Image Gallery</h1>
        <p className="text-muted-foreground">
          Browse and manage your AI-generated images
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-sm font-medium">Search prompts</Label>
              <Input
                id="search"
                placeholder="Search by prompt keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="min-w-[200px]">
              <Label htmlFor="style-filter" className="text-sm font-medium">Filter by style</Label>
              <Select value={styleFilter} onValueChange={setStyleFilter}>
                <SelectTrigger id="style-filter" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Styles</SelectItem>
                  <SelectItem value="default">Default</SelectItem>
                  {getUniqueStyles().map(style => (
                    <SelectItem key={style} value={style}>
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {images.length > 0 && (
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={clearGallery}
                  className="mt-1"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredImages.length} of {images.length} images
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      {filteredImages.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mx-auto opacity-50"></div>
              {images.length === 0 ? (
                <>
                  <h3 className="text-xl font-semibold">No images yet</h3>
                  <p className="text-muted-foreground">
                    Start generating images to build your gallery
                  </p>
                  <Button asChild className="mt-4">
                    <a href="/generate">Generate Your First Image</a>
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold">No matching images</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <Card key={image.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-muted">
                <Dialog>
                  <DialogTrigger asChild>
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/caf042db-f5c7-4b24-afb8-bf97fda9cfd0.png';
                      }}
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle>Generated Image</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="max-h-[60vh] overflow-auto">
                        <img
                          src={image.url}
                          alt={image.prompt}
                          className="w-full rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c2af44a9-03b4-424a-ae73-afbb8e38d310.png';
                          }}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Prompt:</Label>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                          {image.prompt}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{image.style}</Badge>
                        <Badge variant="secondary">{image.aspectRatio}</Badge>
                        <Badge variant="secondary">{image.quality}</Badge>
                        <Badge variant="outline">
                          {formatDate(image.generatedAt)}
                        </Badge>
                      </div>
                      
                      <Button 
                        onClick={() => downloadImage(image.url, `ai-generated-${image.id}.png`)}
                        className="w-full"
                      >
                        Download Image
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {image.prompt}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {image.style}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {image.aspectRatio}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDate(image.generatedAt)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}