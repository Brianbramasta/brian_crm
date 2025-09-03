import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import dealsService from '../services/dealsService';
import leadsService from '../services/leadsService';
import productsService from '../services/productsService';
import { useAuth } from '../hooks/useAuth';

const statusColors = {
  waiting_approval: 'warning',
  approved: 'success',
  rejected: 'error',
};

const statusLabels = {
  waiting_approval: 'Waiting Approval',
  approved: 'Approved',
  rejected: 'Rejected',
};

const DealsPipeline = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [filters, setFilters] = useState({});

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      lead_id: '',
      items: [],
    },
  });

  // Fetch deals
  const { data: dealsData, isLoading, error } = useQuery(
    ['deals', page, rowsPerPage, filters],
    () => dealsService.getDeals({
      page: page + 1,
      per_page: rowsPerPage,
      ...filters,
    }),
    {
      keepPreviousData: true,
    }
  );

  // Fetch qualified leads for creating deals
  const { data: leadsData } = useQuery(
    'qualified-leads',
    () => leadsService.getLeads({ status: 'qualified' })
  );

  // Fetch products for deal items
  const { data: productsData } = useQuery(
    'products',
    () => productsService.getProducts()
  );

  // Approve deal mutation (manager only)
  const approveMutation = useMutation(dealsService.approveDeal, {
    onSuccess: () => {
      queryClient.invalidateQueries('deals');
      toast.success('Deal approved successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to approve deal');
    },
  });

  // Reject deal mutation (manager only)
  const rejectMutation = useMutation(dealsService.rejectDeal, {
    onSuccess: () => {
      queryClient.invalidateQueries('deals');
      toast.success('Deal rejected successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reject deal');
    },
  });

  // Delete deal mutation
  const deleteMutation = useMutation(dealsService.deleteDeal, {
    onSuccess: () => {
      queryClient.invalidateQueries('deals');
      toast.success('Deal deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete deal');
    },
  });

  const handleOpenDialog = (mode, deal = null) => {
    setDialogMode(mode);
    setSelectedDeal(deal);
    setOpenDialog(true);
    
    if (mode === 'edit' && deal) {
      reset({
        lead_id: deal.lead_id,
        items: deal.items || [],
      });
    } else {
      reset({
        lead_id: '',
        items: [],
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDeal(null);
    reset();
  };

  const handleApprove = (deal) => {
    if (window.confirm(`Are you sure you want to approve deal for \"${deal.lead?.name}\"?`)) {
      approveMutation.mutate(deal.id);
    }
  };

  const handleReject = (deal) => {
    if (window.confirm(`Are you sure you want to reject deal for \"${deal.lead?.name}\"?`)) {
      rejectMutation.mutate(deal.id);
    }
  };

  const handleDelete = (deal) => {
    if (window.confirm(`Are you sure you want to delete deal for \"${deal.lead?.name}\"?`)) {
      deleteMutation.mutate(deal.id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (error) {
    return (
      <Alert severity=\"error\">
        Failed to load deals: {error.message}
      </Alert>
    );
  }

  const deals = dealsData?.data || [];
  const total = dealsData?.total || 0;
  const qualifiedLeads = leadsData?.data || [];
  const products = productsData?.data || [];

  const isManager = user?.role === 'manager';

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant=\"h4\" component=\"h1\">
          Deal Pipeline
        </Typography>
        <Button
          variant=\"contained\"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('create')}
        >
          Create New Deal
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color=\"textSecondary\" gutterBottom>
                Total Deals
              </Typography>
              <Typography variant=\"h4\">
                {total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color=\"textSecondary\" gutterBottom>
                Waiting Approval
              </Typography>
              <Typography variant=\"h4\">
                {deals.filter(deal => deal.status === 'waiting_approval').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color=\"textSecondary\" gutterBottom>
                Approved
              </Typography>
              <Typography variant=\"h4\">
                {deals.filter(deal => deal.status === 'approved').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color=\"textSecondary\" gutterBottom>
                Total Value
              </Typography>
              <Typography variant=\"h6\">
                {formatCurrency(
                  deals
                    .filter(deal => deal.status === 'approved')
                    .reduce((sum, deal) => sum + deal.total_amount, 0)
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Deals Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Lead/Customer</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell align=\"right\">Total Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align=\"center\">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align=\"center\">
                    Loading deals...
                  </TableCell>
                </TableRow>
              ) : deals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align=\"center\">
                    No deals found
                  </TableCell>
                </TableRow>
              ) : (
                deals.map((deal) => (
                  <TableRow key={deal.id} hover>
                    <TableCell>{deal.lead?.name}</TableCell>
                    <TableCell>{deal.lead?.contact}</TableCell>
                    <TableCell align=\"right\">{formatCurrency(deal.total_amount)}</TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabels[deal.status]}
                        color={statusColors[deal.status]}
                        size=\"small\"
                      />
                    </TableCell>
                    <TableCell>{deal.lead?.owner?.name}</TableCell>
                    <TableCell>
                      {new Date(deal.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align=\"center\">
                      <IconButton
                        size=\"small\"
                        onClick={() => handleOpenDialog('view', deal)}
                        title=\"View\"
                      >
                        <ViewIcon />
                      </IconButton>
                      {deal.status === 'waiting_approval' && (
                        <>
                          <IconButton
                            size=\"small\"
                            onClick={() => handleOpenDialog('edit', deal)}
                            title=\"Edit\"
                          >
                            <EditIcon />
                          </IconButton>
                          {isManager && (
                            <>
                              <IconButton
                                size=\"small\"
                                onClick={() => handleApprove(deal)}
                                title=\"Approve\"
                                color=\"success\"
                              >
                                <ApproveIcon />
                              </IconButton>
                              <IconButton
                                size=\"small\"
                                onClick={() => handleReject(deal)}
                                title=\"Reject\"
                                color=\"error\"
                              >
                                <RejectIcon />
                              </IconButton>
                            </>
                          )}
                        </>
                      )}
                      <IconButton
                        size=\"small\"
                        onClick={() => handleDelete(deal)}
                        title=\"Delete\"
                        color=\"error\"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component=\"div\"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Deal Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth=\"lg\" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' && 'Create New Deal'}
          {dialogMode === 'edit' && 'Edit Deal'}
          {dialogMode === 'view' && 'Deal Details'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {dialogMode === 'create' ? (
                <Controller
                  name=\"lead_id\"
                  control={control}
                  rules={{ required: 'Lead is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label=\"Select Lead\"
                      fullWidth
                      margin=\"normal\"
                      error={!!errors.lead_id}
                      helperText={errors.lead_id?.message}
                    >
                      {qualifiedLeads.map((lead) => (
                        <MenuItem key={lead.id} value={lead.id}>
                          {lead.name} - {lead.contact}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              ) : (
                <TextField
                  label=\"Lead/Customer\"
                  value={selectedDeal?.lead?.name || ''}
                  fullWidth
                  margin=\"normal\"
                  disabled
                />
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label=\"Status\"
                value={statusLabels[selectedDeal?.status] || ''}
                fullWidth
                margin=\"normal\"
                disabled
              />
            </Grid>
          </Grid>

          {dialogMode === 'view' && selectedDeal && (
            <Box sx={{ mt: 3 }}>
              <Typography variant=\"h6\" gutterBottom>
                Deal Items
              </Typography>
              <Paper sx={{ p: 2 }}>
                <List>
                  {selectedDeal.items?.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={item.product?.name}
                          secondary={
                            <Grid container spacing={2}>
                              <Grid item xs={3}>
                                <Typography variant=\"body2\">
                                  Qty: {item.qty}
                                </Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <Typography variant=\"body2\">
                                  Price: {formatCurrency(item.harga_nego)}
                                </Typography>
                              </Grid>
                              <Grid item xs={5}>
                                <Typography variant=\"body2\" color=\"primary\">
                                  Subtotal: {formatCurrency(item.subtotal)}
                                </Typography>
                              </Grid>
                            </Grid>
                          }
                        />
                      </ListItem>
                      {index < selectedDeal.items.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                  <Typography variant=\"h6\" color=\"primary\">
                    Total: {formatCurrency(selectedDeal.total_amount)}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {dialogMode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {dialogMode !== 'view' && (
            <Button type=\"submit\" variant=\"contained\">
              {dialogMode === 'create' ? 'Create' : 'Update'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DealsPipeline;", "original_text": "", "replace_all": false}]