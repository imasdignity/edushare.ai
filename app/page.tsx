import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/95">
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 blur-[100px]" />
        </div>
        
        <div className="container relative z-10 flex flex-col items-center justify-center py-20 md:py-32 lg:py-40">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex items-center justify-center space-x-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/75 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              <span>Next-Gen Learning Platform</span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="neon-text">EduSphere</span> AI
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Revolutionizing education with AI-powered learning experiences for students, parents, and educators.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button size="lg" className="btn-pulse group relative overflow-hidden" asChild>
                <Link href="/login">
                  Get Started
                  <Icons.arrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="group" asChild>
                <Link href="#features">
                  Learn More
                  <Icons.chevronDown className="ml-2 h-4 w-4 opacity-70 transition-transform group-hover:translate-y-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Powerful Features</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need for modern education, powered by AI
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Icons.brain className="h-8 w-8" />,
                title: "AI-Powered Learning",
                description: "Personalized learning paths and feedback powered by advanced AI algorithms."
              },
              {
                icon: <Icons.users className="h-8 w-8" />,
                title: "Parent Portal",
                description: "Real-time progress tracking and performance insights for parents."
              },
              {
                icon: <Icons.bookOpen className="h-8 w-8" />,
                title: "Teacher Dashboard",
                description: "Comprehensive tools for managing classes and assignments."
              },
              {
                icon: <Icons.barChart className="h-8 w-8" />,
                title: "Progress Analytics",
                description: "Detailed insights into student performance and learning patterns."
              },
              {
                icon: <Icons.messageSquare className="h-8 w-8" />,
                title: "AI Feedback",
                description: "Instant, personalized feedback on assignments and quizzes."
              },
              {
                icon: <Icons.bell className="h-8 w-8" />,
                title: "Smart Notifications",
                description: "Stay updated with real-time alerts and reminders."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={cn(
                  "group relative rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md",
                  "hover:border-primary/50 card-hover"
                )}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 blur-[100px]" />
        </div>
        
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to transform education?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Join thousands of educators, students, and parents already using EduSphere AI.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" className="btn-pulse" asChild>
                <Link href="/signup">
                  Get Started for Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/demo">
                  Watch Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
