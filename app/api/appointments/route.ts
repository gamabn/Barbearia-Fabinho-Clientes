import { NextRequest, NextResponse } from 'next/server';
import { getMongoClient } from '@/app/lib/mongodb';

export async function GET(request: NextRequest, response: NextResponse) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date'); // "2026-09-17"

  if (!date) {
    return NextResponse.json({ error: 'date obrigatório' }, { status: 400 });
  }

  try {
    const client = await getMongoClient();
    const db = client.db('test');

    // Limites do dia no fuso do Brasil (UTC-3)
    // 2026-09-17 00:00 BRT = 2026-09-17 03:00 UTC
    const start = new Date(`${date}T00:00:00.000-03:00`);
    const end = new Date(`${date}T23:59:59.999-03:00`);

    const agendamentos = await db
      .collection('queueentries')
      .find({
        scheduledAt: { $gte: start, $lte: end },
        status: { $ne: 'cancelled' }, // opcional: ignora cancelados
      })
      .toArray();

    return NextResponse.json(agendamentos);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return NextResponse.json({ error: 'Erro' }, { status: 500 });
  }
}
