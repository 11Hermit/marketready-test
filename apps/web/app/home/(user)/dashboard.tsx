// MarketReady.ai Dashboard Main Content
'use client';

import { useUserWorkspace } from '@kit/accounts/hooks/use-user-workspace';
import { Heading } from '@kit/ui/heading';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@kit/ui/card';
import { cn } from '../../../../lib/utils';
import { Button } from '@kit/ui/button';
import { 
  LucideSparkles, 
  LucideBell, 
  LucideHome, 
  LucideLineChart, 
  LucideUsers, 
  LucideDollarSign,
  LucideCalendar,
  LucidePlus
} from 'lucide-react';
import { Badge } from '@kit/ui/badge';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@kit/ui/table';

// Mock data for dashboard
const marketTrendsData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 500 },
  { name: 'Apr', value: 400 },
  { name: 'May', value: 600 },
  { name: 'Jun', value: 700 },
];

const recentListings = [
  { id: 1, address: '123 Main St', price: '$750,000', status: 'Active', days: 3 },
  { id: 2, address: '456 Oak Ave', price: '$1,200,000', status: 'Pending', days: 7 },
  { id: 3, address: '789 Pine Rd', price: '$950,000', status: 'Active', days: 1 },
];

const quickActions = [
  { title: 'New Listing', icon: LucideHome, action: '/listings/new' },
  { title: 'Market Analysis', icon: LucideLineChart, action: '/analytics' },
  { title: 'Add Client', icon: LucideUsers, action: '/clients/new' },
  { title: 'Schedule Showing', icon: LucideCalendar, action: '/calendar' },
];

export default function Dashboard() {
  const { workspace, user } = useUserWorkspace();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Heading level={2} className="text-primary font-semibold text-2xl md:text-3xl">
            Welcome back, {user?.firstName || 'Agent'}
          </Heading>
          <p className="text-muted-foreground mt-1 max-w-xl">
            Here's what's happening with your real estate business today.
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Active Listings" 
          value="12" 
          change="+2" 
          trend="up" 
          icon={LucideHome}
        />
        <StatCard 
          title="Total Value" 
          value="$8.4M" 
          change="+12%" 
          trend="up" 
          icon={LucideDollarSign}
        />
        <StatCard 
          title="New Leads" 
          value="8" 
          change="+3" 
          trend="up" 
          icon={LucideUsers}
        />
        <StatCard 
          title="Showings Today" 
          value="4" 
          change="-1" 
          trend="down" 
          icon={LucideCalendar}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Trends Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Market Trends</CardTitle>
            <CardDescription>Average home prices in your area</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marketTrendsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action) => (
              <Button 
                key={action.title}
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => console.log(`Navigating to ${action.action}`)}
              >
                <action.icon className="h-4 w-4" />
                {action.title}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Listings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Listings</CardTitle>
              <CardDescription>Your most recent property listings</CardDescription>
            </div>
            <Button size="sm" variant="outline" className="gap-2">
              <LucidePlus className="h-4 w-4" />
              Add New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Days Listed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentListings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">{listing.address}</TableCell>
                  <TableCell>{listing.price}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={listing.status === 'Active' ? 'success' : 'outline'}
                      className="capitalize"
                    >
                      {listing.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{listing.days} days ago</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, change, trend, icon: Icon }: { 
  title: string; 
  value: string; 
  change: string; 
  trend: 'up' | 'down' | 'stale';
  icon: React.ComponentType<{ className?: string }>;
}) {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold">{value}</span>
              <span className={cn(
                "text-sm font-medium flex items-center mb-0.5",
                isPositive ? "text-green-500" : "",
                isNegative ? "text-red-500" : ""
              )}>
                {isPositive ? '↑' : isNegative ? '↓' : '→'} {change}
              </span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-brand/10">
            <Icon className="h-6 w-6 text-brand" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
