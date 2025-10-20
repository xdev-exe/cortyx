import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import heroBackground from "@assets/generated_images/Neural_network_hero_background_e816c873.png";
import { Brain, Shield, BarChart3, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-display font-semibold text-lg">Cortex</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="text-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              About
            </a>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login">
              <Button data-testid="button-login-nav">Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/95 via-stone-950/90 to-stone-950/95" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl mb-6 bg-gradient-to-br from-white via-stone-100 to-stone-300 bg-clip-text text-transparent leading-tight tracking-tight">
            Cortex: The Self-Operating ERP
          </h1>
          
          <p className="text-lg md:text-xl text-stone-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            The world's first AI-driven Enterprise Resource Planning system. 
            Automate your business operations with intelligent, self-operating workflows.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="px-8 py-6 text-lg" data-testid="button-explore-demo">
                Explore Demo
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-6 text-lg backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-semibold text-3xl md:text-4xl mb-4">
              Powered by Intelligence
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the future of enterprise management with AI-driven automation and insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-lg border border-border bg-background hover-elevate transition-all">
              <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-3">AI-Driven Automation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Self-operating workflows that learn from your business patterns and optimize operations automatically
              </p>
            </div>
            
            <div className="p-8 rounded-lg border border-border bg-background hover-elevate transition-all">
              <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Real-time Analytics</h3>
              <p className="text-muted-foreground leading-relaxed">
                Comprehensive insights and predictive analytics powered by advanced machine learning algorithms
              </p>
            </div>
            
            <div className="p-8 rounded-lg border border-border bg-background hover-elevate transition-all">
              <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Enterprise Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                Bank-level encryption and compliance with industry-leading security standards and protocols
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-primary" />
            <span className="font-display font-semibold">Cortex</span>
          </div>
          <p>&copy; 2025 Cortex ERP. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
