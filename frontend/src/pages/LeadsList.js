import React, { useState, useEffect } from 'react';
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
  Fab,
  Alert,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  TrendingUp as ConvertIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import leadsService from '../services/leadsService';

const statusColors = {
  new: 'primary',
  contacted: 'warning',
  qualified: 'success',
  lost: 'error',
};

const statusLabels = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  lost: 'Lost',
};

const LeadsList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedLead, setSelectedLead] = useState(null);
  const [filters, setFilters] = useState({});

  const queryClient = useQueryClient();

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      contact: '',
      address: '',
      kebutuhan: '',
      status: 'new',
    },
  });

  // Fetch leads
  const { data: leadsData, isLoading, error } = useQuery(
    ['leads', page, rowsPerPage, filters],
    () => leadsService.getLeads({
      page: page + 1,
      per_page: rowsPerPage,
      ...filters,
    }),
    {
      keepPreviousData: true,
    }
  );

  // Create lead mutation
  const createMutation = useMutation(leadsService.createLead, {
    onSuccess: () => {
      queryClient.invalidateQueries('leads');
      toast.success('Lead created successfully');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create lead');
    },
  });

  // Update lead mutation
  const updateMutation = useMutation(
    ({ id, data }) => leadsService.updateLead(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('leads');
        toast.success('Lead updated successfully');
        handleCloseDialog();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update lead');
      },
    }
  );

  // Delete lead mutation
  const deleteMutation = useMutation(leadsService.deleteLead, {
    onSuccess: () => {
      queryClient.invalidateQueries('leads');
      toast.success('Lead deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete lead');
    },
  });

  const handleOpenDialog = (mode, lead = null) => {
    setDialogMode(mode);
    setSelectedLead(lead);
    setOpenDialog(true);
    
    if (mode === 'edit' && lead) {
      reset(lead);
    } else {
      reset({
        name: '',
        contact: '',
        address: '',
        kebutuhan: '',
        status: 'new',
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLead(null);
    reset();
  };

  const onSubmit = (data) => {
    if (dialogMode === 'create') {
      createMutation.mutate(data);
    } else if (dialogMode === 'edit') {
      updateMutation.mutate({ id: selectedLead.id, data });
    }
  };

  const handleDelete = (lead) => {
    if (window.confirm(`Are you sure you want to delete lead "${lead.name}"?`)) {
      deleteMutation.mutate(lead.id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (error) {
    return (
      <Alert severity="error">
        Failed to load leads: {error.message}
      </Alert>
    );
  }

  const leads = leadsData?.data || [];
  const total = leadsData?.total || 0;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Leads Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('create')}
        >
          Add New Lead
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Leads
              </Typography>
              <Typography variant="h4">
                {total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                New Leads
              </Typography>
              <Typography variant="h4">
                {leads.filter(lead => lead.status === 'new').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Qualified
              </Typography>
              <Typography variant="h4">
                {leads.filter(lead => lead.status === 'qualified').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Contacted
              </Typography>
              <Typography variant="h4">
                {leads.filter(lead => lead.status === 'contacted').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Leads Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Requirements</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Loading leads...
                  </TableCell>
                </TableRow>
              ) : leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No leads found
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead.id} hover>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>{lead.contact}</TableCell>
                    <TableCell>{lead.address}</TableCell>
                    <TableCell>{lead.kebutuhan}</TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabels[lead.status]}
                        color={statusColors[lead.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{lead.owner?.name}</TableCell>
                    <TableCell>
                      {new Date(lead.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog('view', lead)}
                        title="View"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog('edit', lead)}
                        title="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(lead)}
                        title="Delete"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                      {lead.status === 'qualified' && (
                        <IconButton
                          size="small"
                          title="Convert to Deal"
                          color="primary"
                        >
                          <ConvertIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Lead Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' && 'Add New Lead'}
          {dialogMode === 'edit' && 'Edit Lead'}
          {dialogMode === 'view' && 'Lead Details'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Company/Person Name"
                      fullWidth
                      margin="normal"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      disabled={dialogMode === 'view'}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="contact"
                  control={control}
                  rules={{ required: 'Contact is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Contact Number"
                      fullWidth
                      margin="normal"
                      error={!!errors.contact}
                      helperText={errors.contact?.message}
                      disabled={dialogMode === 'view'}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="address"
                  control={control}
                  rules={{ required: 'Address is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Address"
                      fullWidth
                      margin="normal"
                      multiline
                      rows={2}
                      error={!!errors.address}
                      helperText={errors.address?.message}
                      disabled={dialogMode === 'view'}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="kebutuhan"
                  control={control}
                  rules={{ required: 'Requirements are required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Requirements/Needs"
                      fullWidth
                      margin="normal"
                      multiline
                      rows={3}
                      error={!!errors.kebutuhan}
                      helperText={errors.kebutuhan?.message}
                      disabled={dialogMode === 'view'}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Status"
                      fullWidth
                      margin="normal"
                      disabled={dialogMode === 'view'}
                    >
                      <MenuItem value="new">New</MenuItem>
                      <MenuItem value="contacted">Contacted</MenuItem>
                      <MenuItem value="qualified">Qualified</MenuItem>
                      <MenuItem value="lost">Lost</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>
              {dialogMode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {dialogMode !== 'view' && (
              <Button
                type="submit"
                variant="contained"
                disabled={createMutation.isLoading || updateMutation.isLoading}
              >
                {dialogMode === 'create' ? 'Create' : 'Update'}
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default LeadsList;