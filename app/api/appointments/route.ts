import { NextResponse, NextRequest } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('test');

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Data não informada' }, { status: 400 });
    }

    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

    // Busca apenas os agendamentos do dia para obter os horários ocupados
    const agendamentos = await db
      .collection('queueentries')
      .find({
        scheduledAt: {
          $gte: startDate,
          $lte: endDate,
        },
        status: { $ne: 'Canceled' },
      })
      .toArray();

    const occupiedTimes = agendamentos
      .filter((agendamento) => agendamento.scheduledAt)
      .map((agendamento) => {
        const dateObj = new Date(agendamento.scheduledAt);
        return dateObj.toLocaleTimeString('pt-BR', {
          timeZone: 'America/Sao_Paulo',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      });

    return NextResponse.json(occupiedTimes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Falha no servidor' }, { status: 500 });
  }
}
