// pages/admin.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI);

export default function AdminPage({ submissions }) {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Admin Panel — Submissions</h1>
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>DOB</th>
              <th>Insurance Type</th>
              <th>City / Country</th>
              <th>Message</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub, i) => (
              <tr key={i}>
                <td>{sub.fullName}</td>
                <td>{sub.email}</td>
                <td>{sub.phone}</td>
                <td>{sub.dob || '-'}</td>
                <td>{sub.insuranceType || '-'}</td>
                <td>{sub.city || '-'} / {sub.country || '-'}</td>
                <td>{sub.message || '-'}</td>
                <td>{new Date(sub.submittedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  try {
    if (!client.isConnected?.()) {
      await client.connect();
    }
    const db = client.db('ajk_forms'); // database name
    const collection = db.collection('submissions');
    const submissions = await collection.find({}).sort({ submittedAt: -1 }).toArray();

    return { props: { submissions: JSON.parse(JSON.stringify(submissions)) } };
  } catch (err) {
    console.error('MongoDB error:', err);
    return { props: { submissions: [] } };
  } finally {
    // MongoClient کو close نہ کریں تاکہ Dev server دوبارہ connect کر سکے
  }
}
