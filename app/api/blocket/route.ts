import { NextRequest, NextResponse } from 'next/server';
import { getMongoClient } from '@/app/lib/mongodb';

export async function GET(req: NextRequest, res: NextResponse) {
  const client = await getMongoClient();
  const db = client.db('test');
  try {
    const blockedDays = await db.collection('blocked_dates').find({}).toArray();
    console.log('dias bloqueados', blockedDays);
    return Response.json(blockedDays);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return Response.json({ error: 'Erro' }, { status: 500 });
  }
}
