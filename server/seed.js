const db = require('./db');
const axios = require('axios');

async function seed() {
    try {
        const response = await axios.get('https://data.cityofnewyork.us/resource/gkne-dk5s.json');
        const trips = response.data;

        await Promise.all(
            trips.map(trip =>
                db.query(
                    `INSERT INTO trips 
                     (vendor_id, pickup_datetime, dropoff_datetime, passenger_count, trip_distance, 
                      pickup_longitude, pickup_latitude, dropoff_longitude, dropoff_latitude, 
                      payment_type, fare_amount, mta_tax, tip_amount, tolls_amount, total_amount, 
                      imp_surcharge, rate_code)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
                    [
                        trip.vendor_id,
                        trip.pickup_datetime,
                        trip.dropoff_datetime,
                        trip.passenger_count,
                        trip.trip_distance,
                        trip.pickup_longitude,
                        trip.pickup_latitude,
                        trip.dropoff_longitude,
                        trip.dropoff_latitude,
                        trip.payment_type,
                        trip.fare_amount,
                        trip.mta_tax,
                        trip.tip_amount,
                        trip.tolls_amount,
                        trip.total_amount,
                        trip.imp_surcharge,
                        trip.rate_code
                    ]
                )
            )
        );

        console.log('Seeding completed!');
    } catch (err) {
        console.error('Error seeding database:', err);
    }
}

seed();
