// MarketReady.ai Dashboard Main Content
'use client';

import { useUserWorkspace } from '~/lib/hooks/use-user-workspace';
import { Heading } from '@kit/ui/heading';
import { Card, CardContent } from '@kit/ui/card';
import { cn } from '~/lib/utils';
import { Button } from '@kit/ui/button';
import { LucideSparkles, LucideBell } from 'lucide-react';

export default function Dashboard() {
  const { workspace, user } = useUserWorkspace();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Heading level={2} className="text-primary font-semibold text-2xl md:text-3xl">
            Welcome, {user?.firstName || user?.email || 'Agent'}
          </Heading>
          <p className="text-muted-foreground mt-1 max-w-xl">
            Your AI-powered real estate workspace. Use the sidebar to access tools, manage your listings, and explore new features.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" aria-label="AI Command Bar">
            <LucideSparkles className="h-5 w-5 text-brand" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Notifications">
            <LucideBell className="h-5 w-5 text-brand" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Example dashboard cards, replace with dynamic content */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <Heading level={4} className="mb-2 text-brand">Favourites</Heading>
            <p className="text-muted-foreground text-sm">Quick access to your favourite tools and properties.</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-6">
            <Heading level={4} className="mb-2 text-brand">Custom Tools</Heading>
            <p className="text-muted-foreground text-sm">Launch your custom AI tools, templates, and automations.</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-6">
            <Heading level={4} className="mb-2 text-brand">Recent Activity</Heading>
            <p className="text-muted-foreground text-sm">See what’s new in your workspace and team.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
