import { createServer } from './server';
import { connectMongo } from './config/db';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
  const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
  await connectMongo(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/workflow');
  const app = createServer();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${PORT}`);
  });
})();
