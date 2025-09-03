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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Grid,
  Card,
  CardContent,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm, Controller, watch } from 'react-hook-form';
import { toast } from 'react-toastify';
import productsService from '../services/productsService';

const ProductsList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedProduct, setSelectedProduct] = useState(null);

  const queryClient = useQueryClient();

  const { control, handleSubmit, reset, watch: watchForm, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      hpp: '',
      margin_percent: '',
    },
  });

  // Watch form values for auto-calculation
  const watchedHpp = watchForm('hpp');
  const watchedMargin = watchForm('margin_percent');

  // Auto-calculate selling price
  useEffect(() => {
    if (watchedHpp && watchedMargin && dialogMode !== 'view') {
      const hpp = parseFloat(watchedHpp);
      const margin = parseFloat(watchedMargin);
      if (!isNaN(hpp) && !isNaN(margin)) {
        const sellingPrice = hpp + (hpp * margin / 100);
        setValue('calculated_selling_price', sellingPrice.toFixed(0));
      }
    }
  }, [watchedHpp, watchedMargin, setValue, dialogMode]);

  // Fetch products
  const { data: productsData, isLoading, error } = useQuery(
    ['products', page, rowsPerPage],
    () => productsService.getProducts({
      page: page + 1,
      per_page: rowsPerPage,
    }),
    {
      keepPreviousData: true,
    }
  );

  // Create product mutation
  const createMutation = useMutation(productsService.createProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('products');
      toast.success('Product created successfully');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create product');
    },
  });

  // Update product mutation
  const updateMutation = useMutation(
    ({ id, data }) => productsService.updateProduct(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        toast.success('Product updated successfully');
        handleCloseDialog();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update product');
      },
    }
  );

  // Delete product mutation
  const deleteMutation = useMutation(productsService.deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('products');
      toast.success('Product deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    },
  });

  const handleOpenDialog = (mode, product = null) => {
    setDialogMode(mode);
    setSelectedProduct(product);
    setOpenDialog(true);
    
    if (mode === 'edit' && product) {
      reset({
        name: product.name,
        hpp: product.hpp,
        margin_percent: product.margin_percent,
        calculated_selling_price: product.harga_jual,
      });
    } else {
      reset({
        name: '',
        hpp: '',
        margin_percent: '',
        calculated_selling_price: '',
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    reset();
  };

  const onSubmit = (data) => {
    const submitData = {
      name: data.name,
      hpp: parseFloat(data.hpp),
      margin_percent: parseFloat(data.margin_percent),
    };

    if (dialogMode === 'create') {
      createMutation.mutate(submitData);
    } else if (dialogMode === 'edit') {
      updateMutation.mutate({ id: selectedProduct.id, data: submitData });
    }
  };

  const handleDelete = (product) => {
    if (window.confirm(`Are you sure you want to delete product "${product.name}"?`)) {
      deleteMutation.mutate(product.id);
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
      <Alert severity="error">
        Failed to load products: {error.message}
      </Alert>
    );
  }

  const products = productsData?.data || [];
  const total = productsData?.total || 0;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Products Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('create')}
        >
          Add New Product
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Products
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
                Avg. Margin
              </Typography>
              <Typography variant="h4">
                {products.length > 0 
                  ? (products.reduce((sum, p) => sum + p.margin_percent, 0) / products.length).toFixed(1)
                  : 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Highest Price
              </Typography>
              <Typography variant="h6">
                {products.length > 0 
                  ? formatCurrency(Math.max(...products.map(p => p.harga_jual)))
                  : formatCurrency(0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Lowest Price
              </Typography>
              <Typography variant="h6">
                {products.length > 0 
                  ? formatCurrency(Math.min(...products.map(p => p.harga_jual)))
                  : formatCurrency(0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Products Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell align="right">HPP</TableCell>
                <TableCell align="right">Margin %</TableCell>
                <TableCell align="right">Selling Price</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>{product.name}</TableCell>
                    <TableCell align="right">{formatCurrency(product.hpp)}</TableCell>
                    <TableCell align="right">{product.margin_percent}%</TableCell>
                    <TableCell align="right">{formatCurrency(product.harga_jual)}</TableCell>
                    <TableCell>
                      {new Date(product.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog('view', product)}
                        title="View"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog('edit', product)}
                        title="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(product)}
                        title="Delete"
                        color="error"
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
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Product Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' && 'Add New Product'}
          {dialogMode === 'edit' && 'Edit Product'}
          {dialogMode === 'view' && 'Product Details'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Product name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Product Name"
                      fullWidth
                      margin="normal"
                      placeholder="e.g., Internet 50 Mbps"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      disabled={dialogMode === 'view'}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="hpp"
                  control={control}
                  rules={{ 
                    required: 'HPP is required',
                    min: { value: 0, message: 'HPP must be positive' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="HPP (Cost Price)"
                      fullWidth
                      margin="normal"
                      type="number"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                      }}
                      error={!!errors.hpp}
                      helperText={errors.hpp?.message || 'Base cost of the product'}
                      disabled={dialogMode === 'view'}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="margin_percent"
                  control={control}
                  rules={{ 
                    required: 'Margin is required',
                    min: { value: 0, message: 'Margin must be positive' },
                    max: { value: 100, message: 'Margin cannot exceed 100%' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Margin Percentage"
                      fullWidth
                      margin="normal"
                      type="number"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      error={!!errors.margin_percent}
                      helperText={errors.margin_percent?.message || 'Profit margin percentage'}
                      disabled={dialogMode === 'view'}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="calculated_selling_price"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Calculated Selling Price"
                      fullWidth
                      margin="normal"
                      type="number"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                        readOnly: true,
                      }}
                      helperText="Automatically calculated: HPP + (HPP × Margin%)"
                      disabled
                      sx={{
                        '& .MuiInputBase-input': {
                          backgroundColor: '#f5f5f5',
                        },
                      }}
                    />
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

export default ProductsList;