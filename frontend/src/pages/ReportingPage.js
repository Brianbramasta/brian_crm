import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import {
  DateRange as DateRangeIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import axios from 'axios';
import { saveAs } from 'file-type-utils';

const ReportingPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('leads');
  const [reportData, setReportData] = useState(null);

  // Fetch report data based on selected filters
  const { data: reportResults, isLoading, refetch } = useQuery(
    ['report', startDate, endDate, reportType],
    async () => {
      const { data } = await axios.get(`/api/reports/${reportType}`, {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });
      return data;
    },
    {
      enabled: false, // Only fetch when user clicks generate
      staleTime: 0,
    }
  );

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    refetch();
  };

  const handleExportExcel = async () => {
    if (!startDate || !endDate || !reportResults) {
      alert('Please generate a report first');
      return;
    }

    try {
      const response = await axios.get(`/api/reports/${reportType}/export`, {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
        responseType: 'blob',
      });

      const fileName = `ptsmart_crm_${reportType}_report_${startDate}_to_${endDate}.xlsx`;
      saveAs(response.data, fileName);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report');
    }
  };

  const reportTypes = [
    { value: 'leads', label: 'Leads Report' },
    { value: 'sales', label: 'Sales Report' },
    { value: 'customers', label: 'Customer Activity' },
    { value: 'revenue', label: 'Revenue Analysis' },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Reporting Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExportExcel}
          disabled={!reportResults}
        >
          Export to Excel
        </Button>
      </Box>

      {/* Report Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Report Type"
            select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            fullWidth
          >
            {reportTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<DateRangeIcon />}
            onClick={handleGenerateReport}
          >
            Generate Report
          </Button>
        </Box>
      </Paper>

      {/* Report Content */}
      {reportResults && (
        <>
          {reportType === 'leads' && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Lead Sources
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Source</TableCell>
                            <TableCell align="right">Count</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(reportResults.sources || {}).map(([source, count]) => (
                            <TableRow key={source}>
                              <TableCell>{source}</TableCell>
                              <TableCell align="right">{count}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Lead Status
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Count</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(reportResults.statuses || {}).map(([status, count]) => (
                            <TableRow key={status}>
                              <TableCell>{status}</TableCell>
                              <TableCell align="right">{count}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Lead Conversion Funnel
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Stage</TableCell>
                            <TableCell align="right">Count</TableCell>
                            <TableCell align="right">Conversion Rate</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reportResults.funnel.map((stage, index) => (
                            <TableRow key={stage.stage}>
                              <TableCell>{stage.stage}</TableCell>
                              <TableCell align="right">{stage.count}</TableCell>
                              <TableCell align="right">
                                {index === 0 ? '100%' : `${stage.conversion_rate}%`}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {reportType === 'sales' && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Sales Performance
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Salesperson</TableCell>
                            <TableCell align="right">Leads</TableCell>
                            <TableCell align="right">Deals</TableCell>
                            <TableCell align="right">Conversion Rate</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reportResults.salespeople.map((salesperson) => (
                            <TableRow key={salesperson.id}>
                              <TableCell>{salesperson.name}</TableCell>
                              <TableCell align="right">{salesperson.leads}</TableCell>
                              <TableCell align="right">{salesperson.deals}</TableCell>
                              <TableCell align="right">{salesperson.conversion_rate}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Revenue Analysis
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Units Sold</TableCell>
                            <TableCell align="right">Revenue</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reportResults.products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>{product.name}</TableCell>
                              <TableCell align="right">{product.units_sold}</TableCell>
                              <TableCell align="right">{product.revenue}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell><strong>Total</strong></TableCell>
                            <TableCell align="right"><strong>{reportResults.total_units_sold}</strong></TableCell>
                            <TableCell align="right"><strong>{reportResults.total_revenue}</strong></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {reportType === 'customers' && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Customer Growth
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Month</TableCell>
                          <TableCell align="right">New Customers</TableCell>
                          <TableCell align="right">Churn</TableCell>
                          <TableCell align="right">Net Growth</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reportResults.growth.map((monthData) => (
                          <TableRow key={monthData.month}>
                            <TableCell>{monthData.month}</TableCell>
                            <TableCell align="right">{monthData.new_customers}</TableCell>
                            <TableCell align="right">{monthData.churn}</TableCell>
                            <TableCell align="right">{monthData.net_growth}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell><strong>Total</strong></TableCell>
                          <TableCell align="right"><strong>{reportResults.total_new}</strong></TableCell>
                          <TableCell align="right"><strong>{reportResults.total_churn}</strong></TableCell>
                          <TableCell align="right"><strong>{reportResults.total_net}</strong></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Customer Retention
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Category</TableCell>
                          <TableCell align="right">Count</TableCell>
                          <TableCell align="right">Percentage</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Active</TableCell>
                          <TableCell align="right">{reportResults.retention.active}</TableCell>
                          <TableCell align="right">{reportResults.retention.active_percentage}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Churned</TableCell>
                          <TableCell align="right">{reportResults.retention.churned}</TableCell>
                          <TableCell align="right">{reportResults.retention.churned_percentage}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Lost</TableCell>
                          <TableCell align="right">{reportResults.retention.lost}</TableCell>
                          <TableCell align="right">{reportResults.retention.lost_percentage}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {reportType === 'revenue' && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Revenue by Product
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Units Sold</TableCell>
                            <TableCell align="right">Revenue</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reportResults.products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>{product.name}</TableCell>
                              <TableCell align="right">{product.units_sold}</TableCell>
                              <TableCell align="right">{product.revenue}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell><strong>Total</strong></TableCell>
                            <TableCell align="right"><strong>{reportResults.total_units_sold}</strong></TableCell>
                            <TableCell align="right"><strong>{reportResults.total_revenue}</strong></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Monthly Revenue
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Month</TableCell>
                            <TableCell align="right">Revenue</TableCell>
                            <TableCell align="right">Growth</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reportResults.monthly.map((monthData) => (
                            <TableRow key={monthData.month}>
                              <TableCell>{monthData.month}</TableCell>
                              <TableCell align="right">{monthData.revenue}</TableCell>
                              <TableCell align="right" sx={{ color: monthData.growth >= 0 ? 'success.main' : 'error.main' }}>
                                {monthData.growth}%
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell><strong>Total</strong></TableCell>
                            <TableCell align="right"><strong>{reportResults.total_revenue}</strong></TableCell>
                            <TableCell align="right"></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </>
      )}

      {/* Report Empty State */}
      {!reportResults && (
        <Paper sx={{ p: 5, textAlign: 'center' }}>
          <DateRangeIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No report generated yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select date range and report type above, then click "Generate Report"
          </Typography>
          <br />
          <Button variant="contained" onClick={handleGenerateReport} disabled={!startDate || !endDate}>
            Generate Report
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default ReportingPage;
