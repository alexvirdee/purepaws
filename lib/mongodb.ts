import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error('MONGODB_URI is not set in the environment variables');
}

const options = {};

let client;
let clientPromise: Promise<MongoClient>;

// In dev mode, use a global var so the client is not recreated on every hot reload
declare global {
    var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        console.log('🗄️ Connecting to MongoDB Atlas...');
        global._mongoClientPromise = client.connect();
        global._mongoClientPromise.then(() => 
            console.log('🗄️ Connected to MongoDB Atlas successfully!')
        ).catch((error) => 
            console.error('❌ Failed to connect to MongoDB Atlas:', error)
        )
    }

    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    console.log('🗄️ Connecting to MongoDB Atlas...');

    clientPromise = client.connect();
    clientPromise.then(() => 
        console.log('🗄️ Connected to MongoDB Atlas successfully!')
    ).catch((error) => 
        console.error('❌ Failed to connect to MongoDB Atlas:', error)
    );
}

export default clientPromise;