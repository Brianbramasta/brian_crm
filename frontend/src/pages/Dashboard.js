import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  People,
  TrendingUp,
  Assignment,
  AttachMoney,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const StatCard = ({ title, value, icon, color = 'primary' }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center">
        <Avatar sx={{ bgcolor: `${color}.main`, mr: 2 }}>
          {icon}
        </Avatar>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" component="h2">
            {value}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: 'Total Customers',
      value: '1,234',
      icon: <People />,
      color: 'primary',
    },
    {
      title: 'Active Leads',
      value: '87',
      icon: <TrendingUp />,
      color: 'success',
    },
    {
      title: 'Open Tasks',
      value: '23',
      icon: <Assignment />,
      color: 'warning',
    },
    {
      title: 'Revenue',
      value: '$45,678',
      icon: <AttachMoney />,
      color: 'info',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name || 'User'}!
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Here's what's happening with your CRM today.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography color="textSecondary">
              No recent activity to display. Start by adding some customers or tasks.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                • Add new customer
              </Typography>
              <Typography variant="body2" color="textSecondary">
                • Create task
              </Typography>
              <Typography variant="body2" color="textSecondary">
                • View reports
              </Typography>
              <Typography variant="body2" color="textSecondary">
                • Export data
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
