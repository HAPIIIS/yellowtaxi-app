import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, Tooltip, ResponsiveContainer } from 'recharts';

const Charts = () => {
  const [selectedMetric, setSelectedMetric] = useState('fare_amount');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const metrics = [
    { value: 'fare_amount', label: 'Fare Amount' },
    { value: 'trip_distance', label: 'Trip Distance' },
    { value: 'tip_amount', label: 'Tip Amount' },
    { value: 'total_amount', label: 'Total Amount' },
    { value: 'passenger_count', label: 'Passenger Count' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    const processed = data
      .filter((trip) => trip[selectedMetric] != null && !isNaN(trip[selectedMetric])) 
      .map((trip, index) => ({
        tripId: trip.pickup_datetime
          ? new Date(trip.pickup_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : `Trip ${index + 1}`,
        value: Number(trip[selectedMetric]), 
        id: index,
      }))
      .slice(0, 20); 

    return processed;
  }, [data, selectedMetric]);

  const formatTooltipValue = (value) => {
    const numericValue = Number(value);
    switch (selectedMetric) {
      case 'fare_amount':
      case 'tip_amount':
      case 'total_amount':
        return `$${numericValue.toFixed(2)}`;
      case 'trip_distance':
        return `${numericValue.toFixed(2)} miles`;
      case 'passenger_count':
        return Math.round(numericValue);
      default:
        return numericValue.toFixed(2);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-2 text-gray-500">Loading taxi trip data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-white rounded-lg shadow-md">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">Error loading data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Taxi Trip Metrics</h2>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="w-48 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {metrics.map((metric) => (
              <option key={metric.value} value={metric.value}>
                {metric.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-[400px] w-full" style={{ height: 400 }}>
        {processedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="tripId"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
                label={{
                  value: 'Pickup Time',
                  position: 'bottom',
                  offset: 50,
                }}
              />
              <YAxis
                label={{
                  value: metrics.find((m) => m.value === selectedMetric)?.label,
                  angle: -90,
                  position: 'insideLeft',
                  offset: -10,
                }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [
                  formatTooltipValue(value),
                  metrics.find((m) => m.value === selectedMetric)?.label,
                ]}
              />
              <Bar
                dataKey="value"
                fill="#FFC300"
                name={metrics.find((m) => m.value === selectedMetric)?.label}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-96 flex items-center justify-center">
            <p className="text-gray-500">No data available to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts;
