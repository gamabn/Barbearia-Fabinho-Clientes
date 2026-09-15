import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

const client = await clientPromise;
const db = client.db('test');

export async function GET(_request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  console.log('identidade do usuario', userId);

  if (!userId) {
    return NextResponse.json({ error: 'Cliente invalido' }, { status: 401 });
  }

  try {
    const agendamentos = await db
      .collection('queueentries')
      .find({ userId })
      .sort({ scheduledAt: -1 })
      .toArray();

    return NextResponse.json(agendamentos, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return NextResponse.json({ error: 'Erro ao buscar agendamentos' }, { status: 500 });
  }
}
