import { MongoClient } from "mongodb";
import { env } from '~/config/environment.js'
const uri = env.MONGODB_URI;
let dbInstance = null;
export const connectDB = async () => {
    const client = new MongoClient(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });

    await client.connect();
    dbInstance = client.db(env.DATABASE_NAME);
}

export const getDB = () => {
    if (!dbInstance) throw new Error('Must connect to Database first!');
    return dbInstance;
}

// const listDatabases = async (client) => {
//     const databaseList = await client.db().admin().listDatabases();
//     console.log(databaseList);
//     console.log('Your database: ');
//     databaseList.databases.forEach(db => console.log(` - ${db.name}`))
// }