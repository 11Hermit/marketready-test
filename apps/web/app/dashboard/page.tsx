'use client';

import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const quickActions = [
    { title: 'Listings', description: 'View and manage property listings', path: '/listings' },
    { title: 'Clients', description: 'Manage your clients and leads', path: '/clients' },
    { title: 'Analytics', description: 'View market analytics', path: '/analytics' },
    { title: 'Calendar', description: 'Manage showings and appointments', path: '/calendar' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button>Create New</Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Listings" value="12" />
        <StatCard title="Total Value" value="$8.4M" />
        <StatCard title="New Leads" value="8" />
        <StatCard title="Showings Today" value="4" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Card 
            key={action.title} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push(action.path)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{action.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your recent activity will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
