import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ActivityIcon,
  ArrowUpIcon,
  UsersIcon,
  DollarSignIcon,
  CreditCardIcon,
} from "lucide-react";

const DashBoard = () => {
  // Mock data
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      icon: <DollarSignIcon className="h-4 w-4" />,
    },
    {
      title: "Subscriptions",
      value: "+2350",
      change: "+180.1%",
      icon: <UsersIcon className="h-4 w-4" />,
    },
    {
      title: "Sales",
      value: "+12,234",
      change: "+19%",
      icon: <CreditCardIcon className="h-4 w-4" />,
    },
    {
      title: "Active Now",
      value: "+573",
      change: "+201",
      icon: <ActivityIcon className="h-4 w-4" />,
    },
  ];

  const recentActivities = [
    { user: "Olivia Martin", email: "olivia@example.com", amount: "$1,999.00" },
    { user: "Jackson Lee", email: "jackson@example.com", amount: "$39.00" },
    {
      user: "Isabella Nguyen",
      email: "isabella@example.com",
      amount: "$299.00",
    },
    { user: "William Kim", email: "will@example.com", amount: "$99.00" },
  ];

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex space-x-2">
            <Button variant="outline">Download Report</Button>
            <Button>New Project</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Performance</CardTitle>
              <CardDescription>Last 6 months analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-muted rounded-md flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-muted-foreground mb-2">
                    Chart Visualization
                  </p>
                  <p className="text-sm text-gray-500">
                    (Bar chart showing revenue growth)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>You made 265 sales this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="bg-gray-100 border-2 border-dashed rounded-xl w-10 h-10" />
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.user}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.email}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">{activity.amount}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Mobile App</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Website Redesign</span>
                    <span>42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>API Integration</span>
                    <span>90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Server Uptime</span>
                  <span className="text-green-500">99.9%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Database Load</span>
                  <span className="text-orange-500">Medium</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>API Response</span>
                  <span className="text-green-500">142ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active Users</span>
                  <span>1,342</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DashBoard;
