import React, { useState } from "react";
import { Grid, Select, MenuItem, FormControl, InputLabel, Button } from "@mui/material";

const Filters = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    timeRange: "",
    fareSort: "",
    distanceFilter: "",
    paymentType: "",
  });

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters); 
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Time Range</InputLabel>
          <Select
            name="timeRange"
            value={filters.timeRange}
            label="Time Range"
            onChange={(e) => handleFilterChange('timeRange', e.target.value)}
          >
            <MenuItem value="">All Times</MenuItem>
            <MenuItem value="morning">Morning (6 AM - 12 PM)</MenuItem>
            <MenuItem value="afternoon">Afternoon (12 PM - 6 PM)</MenuItem>
            <MenuItem value="evening">Evening (6 PM - 12 AM)</MenuItem>
            <MenuItem value="night">Night (12 AM - 6 AM)</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Fare Amount</InputLabel>
          <Select
            name="fareSort"
            value={filters.fareSort}
            label="Fare Amount"
            onChange={(e) => handleFilterChange('fareSort', e.target.value)}
          >
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="lowToHigh">Low to High</MenuItem>
            <MenuItem value="highToLow">High to Low</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Distance</InputLabel>
          <Select
            name="distanceFilter"
            value={filters.distanceFilter}
            label="Distance"
            onChange={(e) => handleFilterChange('distanceFilter', e.target.value)}
          >
            <MenuItem value="">All Distances</MenuItem>
            <MenuItem value="under10">Under 10km</MenuItem>
            <MenuItem value="above10">10km and Above</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Payment Type</InputLabel>
          <Select
            name="paymentType"
            value={filters.paymentType}
            label="Payment Type"
            onChange={(e) => handleFilterChange('paymentType', e.target.value)}
          >
            <MenuItem value="">All Payment Types</MenuItem>
            <MenuItem value="CSH">Cash</MenuItem>
            <MenuItem value="CRD">Credit Card</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <Button 
          variant="contained" 
          color="warning" 
          fullWidth 
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
      </Grid>
    </Grid>
  );
};

export default Filters;
