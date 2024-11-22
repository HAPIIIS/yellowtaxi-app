import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import Map from "../components/Map";
import Filters from "../components/Filters";
import Charts from "../components/Charts";
import { CircularProgress, Box, Typography, Grid } from "@mui/material";
import Navigation from "../components/Navigation";

const Home = () => {
  const location = useLocation();
  const [filters, setFilters] = useState({
    timeRange: "",
    fareSort: "",
    distanceFilter: "",
    paymentType: "",
  });
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchFilteredTrips = async (currentFilters) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data from the API
      const response = await axios.get(API_URL);
      let filteredTrips = response.data;

      // Apply filters to the data
      if (currentFilters.timeRange) {
        const timeRanges = {
          morning: { start: 6, end: 12 },
          afternoon: { start: 12, end: 18 },
          evening: { start: 18, end: 24 },
          night: { start: 0, end: 6 },
        };
        const { start, end } = timeRanges[currentFilters.timeRange] || {};
        filteredTrips = filteredTrips.filter((trip) => {
          const hour = new Date(trip.pickup_datetime).getHours();
          return hour >= start && hour < end;
        });
      }

      if (currentFilters.paymentType) {
        filteredTrips = filteredTrips.filter(
          (trip) => trip.payment_type === currentFilters.paymentType
        );
      }

      if (currentFilters.distanceFilter) {
        filteredTrips = filteredTrips.filter((trip) => {
          const distance = parseFloat(trip.trip_distance);
          if (currentFilters.distanceFilter === 'under10') {
            return distance < 10;
          } else if (currentFilters.distanceFilter === 'above10') {
            return distance >= 10;
          }
          return true;
        });
      }

      if (currentFilters.fareSort) {
        filteredTrips = filteredTrips.sort((a, b) => {
          return currentFilters.fareSort === 'lowToHigh'
            ? parseFloat(a.fare_amount) - parseFloat(b.fare_amount)
            : parseFloat(b.fare_amount) - parseFloat(a.fare_amount);
        });
      }

      setTrips(filteredTrips);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    fetchFilteredTrips(newFilters); // Fetch data only when filters are applied
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" textAlign="center">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Typography variant="body2">
          Please try again later or check your connection.
        </Typography>
      </Box>
    );
  }

  return (
    <div className="bg-white">
      <Navigation />
      <Grid container spacing={2} padding={2}>
        <Grid item xs={12} md={3}>
          <Filters onApplyFilters={handleApplyFilters} />
        </Grid>

        <Grid item xs={12} md={9}>
          <Map id="Maps" trips={Array.isArray(trips) ? trips : []} />
        </Grid>
      </Grid>

      <div id="Charts" style={{ marginTop: '20px' }}>
        <Charts data={trips} />
      </div>
    </div>
  );
};

export default Home;
