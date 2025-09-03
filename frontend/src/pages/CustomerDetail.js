import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, this would come from API based on ID
  const customer = {
    id: parseInt(id),
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    company: 'Acme Corp',
    position: 'CEO',
    status: 'Active',
    address: '123 Business St, New York, NY 10001',
    notes: 'Important client with multiple projects. Prefers email communication.',
    createdAt: '2024-01-15',
    lastContact: '2024-02-28',
    totalValue: '$25,000',
  };

  const InfoCard = ({ icon, title, value }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          {icon}
          <Typography variant="subtitle2" sx={{ ml: 1, color: 'text.secondary' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body1">{value}</Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/customers')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Customer Details
        </Typography>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/customers/${id}/edit`)}
        >
          Edit Customer
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="start" mb={3}>
              <Box>
                <Typography variant="h5" gutterBottom>
                  {customer.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {customer.position} at {customer.company}
                </Typography>
                <Chip
                  label={customer.status}
                  color={customer.status === 'Active' ? 'success' : 'default'}
                  size="small"
                />
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <InfoCard
                  icon={<EmailIcon color="primary" />}
                  title="Email"
                  value={customer.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoCard
                  icon={<PhoneIcon color="primary" />}
                  title="Phone"
                  value={customer.phone}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoCard
                  icon={<BusinessIcon color="primary" />}
                  title="Company"
                  value={customer.company}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoCard
                  icon={<CalendarIcon color="primary" />}
                  title="Customer Since"
                  value={customer.createdAt}
                />
              </Grid>
            </Grid>

            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                Address
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {customer.address}
              </Typography>
            </Box>

            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                Notes
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {customer.notes}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Last Contact
              </Typography>
              <Typography variant="body1">{customer.lastContact}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Total Value
              </Typography>
              <Typography variant="h6" color="primary">
                {customer.totalValue}
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No recent activity recorded.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerDetail;
