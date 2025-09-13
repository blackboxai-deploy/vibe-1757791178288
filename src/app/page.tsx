'use client'

import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Create Stunning Images with{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Technology
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your imagination into beautiful, high-quality images using advanced AI models. 
            Simply describe what you want to see, and our AI will bring it to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/generate">Start Generating</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link href="/gallery">View Gallery</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful AI Image Generation
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the latest in AI technology with our advanced image generation capabilities
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mb-4"></div>
                <CardTitle>High Quality</CardTitle>
                <CardDescription>
                  Generate stunning, high-resolution images with incredible detail and clarity
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mb-4"></div>
                <CardTitle>Multiple Styles</CardTitle>
                <CardDescription>
                  Choose from various artistic styles: photorealistic, artistic, abstract, and more
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-4"></div>
                <CardTitle>Fast Generation</CardTitle>
                <CardDescription>
                  Create beautiful images in minutes with our optimized AI processing pipeline
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample Gallery Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              See What's Possible
            </h2>
            <p className="text-xl text-muted-foreground">
              Explore some examples of AI-generated artwork
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                src: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/067c1ff1-d242-4345-98ec-67b743bdb3ef.png",
                alt: "Futuristic cityscape at sunset with flying cars and neon lights",
                title: "Futuristic Cityscape"
              },
              {
                src: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/325f82c5-68d4-4751-bb38-fab74381e2f4.png",
                alt: "Magical forest with glowing trees and fairy lights",
                title: "Enchanted Forest"
              },
              {
                src: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c346620d-f4db-4b96-a3f5-bc75968a5dd9.png",
                alt: "Abstract geometric art with vibrant colors and patterns",
                title: "Abstract Art"
              },
              {
                src: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/36deea9e-ab52-4bd7-bb6f-d294259b80f7.png",
                alt: "Steampunk robot in Victorian setting with brass details",
                title: "Steampunk Design"
              },
              {
                src: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/72fe56d7-0161-46ad-92ed-1240363dc326.png",
                alt: "Underwater scene with colorful coral reef and sea creatures",
                title: "Ocean Depths"
              },
              {
                src: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5cedeeba-fd1e-4c24-aaec-3a85ec913187.png",
                alt: "Space nebula with stars and cosmic dust in purple hues",
                title: "Cosmic Wonder"
              }
            ].map((image, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-[4/3]">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/7f7db625-fc32-4c56-8720-42a17d596295.png}`;
                    }}
                  />
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{image.title}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/generate">Create Your Own</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Amazing Images?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators using AI to bring their ideas to life
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link href="/generate">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}