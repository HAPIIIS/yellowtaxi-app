// import React, { useState, useEffect } from "react";
// import { useLocation } from 'react-router-dom';
// import axios from "axios";
// import Map from "../components/Map";
// import Filters from "../components/Filters";
// import Charts from "../components/Charts";
// import { CircularProgress, Box, Typography, Grid } from "@mui/material";
// import Navigation from "../components/Navigation";

// const Home = () => {
//   const location = useLocation();
//   const [filters, setFilters] = useState({
//     timeRange: "",
//     fareSort: "",
//     distanceFilter: "",
//     paymentType: "",
//   });
//   const [trips, setTrips] = useState([]);
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchTrips = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const response = await axios.get("/api/data");
//         let filteredTrips = response.data;

//         if (filters.timeRange) {
//           const timeRanges = {
//             morning: { start: 6, end: 12 },
//             afternoon: { start: 12, end: 18 },
//             evening: { start: 18, end: 24 },
//             night: { start: 0, end: 6 },
//           };
//           const { start, end } = timeRanges[filters.timeRange] || {};
//           filteredTrips = filteredTrips.filter((trip) => {
//             const hour = new Date(trip.pickup_datetime).getHours();
//             return hour >= start && hour < end;
//           });
//         }

//         if (filters.paymentType) {
//           filteredTrips = filteredTrips.filter((trip) => trip.payment_type === filters.paymentType);
//         }

//         if (filters.distanceFilter) {
//           filteredTrips = filteredTrips.filter((trip) => {
//             const distance = parseFloat(trip.trip_distance);
//             if (filters.distanceFilter === 'under10') {
//               return distance < 10;  
//             } else if (filters.distanceFilter === 'above10') {
//               return distance >= 10;  
//             }
//             return true;
//           });
//         }

//         if (filters.fareSort) {
//           filteredTrips = filteredTrips.sort((a, b) => {
//             return filters.fareSort === 'lowToHigh'
//               ? parseFloat(a.fare_amount) - parseFloat(b.fare_amount)
//               : parseFloat(b.fare_amount) - parseFloat(a.fare_amount);
//           });
//         }

//         setTrips(filteredTrips);
//         setChartData(filteredTrips);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTrips();
//   }, [filters]);

//   const handleFilterChange = (name, value) => {
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleApplyFilters = (newFilters) => {
//     setFilters(newFilters);
//   };

//   if (loading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         height="100vh"
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box
//         display="flex"
//         flexDirection="column"
//         justifyContent="center"
//         alignItems="center"
//         height="100vh"
//         textAlign="center"
//       >
//         <Typography variant="h6" color="error">
//           {error}
//         </Typography>
//         <Typography variant="body2">
//           Please try again later or check your connection.
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <div className="bg-white">
//       <Navigation />
//       <Grid container spacing={2} padding={2}>
//         <Grid item xs={12} md={3}>
//           <Filters onApplyFilters={handleApplyFilters} onFilterChange={handleFilterChange} />
//         </Grid>

//         <Grid item xs={12} md={9}>
//           <Map id="Maps" trips={Array.isArray(trips) ? trips : []} />
//         </Grid>
//       </Grid>

//       <div id="Charts" style={{ marginTop: '20px' }}>
//         <Charts data={chartData} />
//       </div>
//     </div>
//   );
// };

// export default Home;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("/api/data");
        let filteredTrips = response.data;

        // Filter the data based on the selected filters
        if (filters.timeRange) {
          const timeRanges = {
            morning: { start: 6, end: 12 },
            afternoon: { start: 12, end: 18 },
            evening: { start: 18, end: 24 },
            night: { start: 0, end: 6 },
          };
          const { start, end } = timeRanges[filters.timeRange] || {};
          filteredTrips = filteredTrips.filter((trip) => {
            const hour = new Date(trip.pickup_datetime).getHours();
            return hour >= start && hour < end;
          });
        }

        if (filters.paymentType) {
          filteredTrips = filteredTrips.filter((trip) => trip.payment_type === filters.paymentType);
        }

        if (filters.distanceFilter) {
          filteredTrips = filteredTrips.filter((trip) => {
            const distance = parseFloat(trip.trip_distance);
            if (filters.distanceFilter === 'under10') {
              return distance < 10;
            } else if (filters.distanceFilter === 'above10') {
              return distance >= 10;
            }
            return true;
          });
        }

        if (filters.fareSort) {
          filteredTrips = filteredTrips.sort((a, b) => {
            return filters.fareSort === 'lowToHigh'
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

    fetchTrips();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
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
          <Filters onApplyFilters={handleApplyFilters} onFilterChange={handleFilterChange} />
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
