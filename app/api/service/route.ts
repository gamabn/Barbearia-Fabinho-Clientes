import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;

    const db = client.db('test');

    const service = await db.collection('services').find({}).toArray();
    console.log('Serviços de barbeiro', service);

    return NextResponse.json(service);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}
