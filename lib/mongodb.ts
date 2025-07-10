import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error('❌ MONGODB_URI is not set in the environment variables');
}

const options = {
    maxPoolSize: 5,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Add type to the globalThis to allow caching in dev mode
declare global {
    // eslint-disable-next-line no-var
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        console.log('🗄️ Connecting to MongoDB Atlas (development)...');

        global._mongoClientPromise = client.connect()
            .then((connectedClient) => {
                console.log('Connected to MongoDB Atlas successfully (development)');
                return connectedClient;
            })
            .catch((error) => {
                console.error('❌ Failed to connect to MongoDB Atlas:', error);
                throw error;
            })
            .finally(() => {
                console.log('🗄️ MongoDB Atlas connection attempt finished (development).');
            });

    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    console.log('🗄️ Connecting to MongoDB Atlas (production)...');

    clientPromise = client.connect()
        .then((connectedClient) => {
            console.log('✅ Connected to MongoDB Atlas successfully (production)');
            return connectedClient;
        })
        .catch((error) => {
            console.error('❌ Failed to connect to MongoDB Atlas:', error);
            throw error;
        })
        .finally(() => {
            console.log('🗄️ MongoDB Atlas connection attempt finished (production).');
        });
}

export default clientPromise;
