import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';

dotenv.config();

// Cache for search results -> reduces load on database
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// Rate limiter to prevent abuse & Dos attacks
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute 
  max: 200, // 200 requests per min per IP -> for prod this should be lower
  message: { error: 'Too many requests, please try again later' },
});

if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
  await import('./db/startAndSeedMemoryDB');
}

const PORT = process.env.PORT || 3001;
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const DATABASE_URL = process.env.DATABASE_URL;

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB globally -> avoid reconnecting on every request
const mongoClient = new MongoClient(DATABASE_URL);
console.log('Connecting to MongoDB...');

//searches for hotels, cities and countries instead of just hotels
app.get('/search', searchLimiter, async (req, res) => {
  const query = req.query.query as string;

  if (!query || !query.trim())
    return res.status(400).json({ error: 'Query parameter is required' });

  //clean up query -> remove extra spaces which could prevent finding results for all collections
  const cleanedQuery = query.trim().replace(/\s+/g, ' ');

  // Validate query: Only allow letters and spaces
  const validQueryRegex = /^[a-zA-Z\s]+$/;
  if (!validQueryRegex.test(cleanedQuery)) {
    return res
      .status(400)
      .json({ error: 'Invalid query. Only letters and spaces are allowed' });
  }

  //limit query length -> could cause performance issues & DoS attacks
  const MAX_QUERY_LENGTH = 50;
  if (cleanedQuery.length > MAX_QUERY_LENGTH) {
    return res.status(400).json({
      error: `Query is too long. Max length is ${MAX_QUERY_LENGTH} characters`,
    });
  }

  if (cache.has(cleanedQuery)) {
    return res.status(200).json(cache.get(cleanedQuery));
  }

  try {
    await mongoClient.connect();
    console.log('Successfully connected to MongoDB!');
    const db = mongoClient.db();

    //uses all the collections in the db
    const hotelCollection = db.collection('hotels');
    const cityCollection = db.collection('cities');
    const countryCollection = db.collection('countries');

    if (!hotelCollection || !cityCollection || !countryCollection) {
      return res.status(500).json({ error: 'Database collections not found' });
    }

    const regexQuery = { $regex: cleanedQuery, $options: 'i' };

    //fetches data from multiple collections in parallel -> more performant
    const [hotels, cities, countries] = await Promise.all([
      hotelCollection
        .find({
          $or: [
            { hotel_name: regexQuery },
            { city: regexQuery },
            { country: regexQuery },
          ],
        })
        .project({
          _id: 1,
          hotel_name: 1,
          city: 1,
          country: 1,
          star_rating: 1,
          chain_name: 1,
          addressline1: 1,
          zipcode: 1,
          state: 1,
          countryisocode: 1,
        })
        .toArray(),
      cityCollection.find({ name: regexQuery }).toArray(),
      countryCollection.find({ country: regexQuery }).toArray(),
    ]);
    const result = { hotels, cities, countries };
    cache.set(cleanedQuery, result);

    if (hotels.length === 0 && cities.length === 0 && countries.length === 0) {
      return res.status(404).json({ error: 'No results found' });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching search results:', error);
    if ((error as any).name === 'MongoNetworkError') {
      return res
        .status(503)
        .json({ error: 'Service unavailable. Database connection failed' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    try {
      await mongoClient.close();
    } catch (closeError) {
      console.error('Error closing MongoDB connection:', closeError);
    }
  }
});

app.listen(PORT, () => {
  console.log(`API Server running on ${PORT}`);
});
