import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI);

export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const data = req.body || {};

  try {
    await client.connect();
    const db = client.db('ajk_forms');
    const collection = db.collection('submissions');

    await collection.insertOne({ ...data, submittedAt: new Date() });

    return res.status(200).json({ ok: true });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to save submission' });
  } finally {
    await client.close();
  }
}
