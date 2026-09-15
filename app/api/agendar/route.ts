import { NextResponse, NextRequest } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { Status } from '../types/status';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientName,
      userId,
      estimatedDuration,
      totalPrice,
      selectedDate,
      selectedTime,
      barberId,
    } = body;

    console.log('Id do usuario', userId);

    if (!clientName) {
      return NextResponse.json({ error: 'O campo clientName é obrigatório.' }, { status: 400 });
    }

    // Processamento da data e horário juntos
    let scheduledDateTime = null;

    if (selectedDate) {
      const dateObj = new Date(selectedDate);

      // Se o horário "08:00" foi enviado, ajusta a hora e os minutos na data
      if (selectedTime && typeof selectedTime === 'string') {
        const [hours, minutes] = selectedTime.split(':').map(Number);
        dateObj.setHours(hours, minutes, 0, 0);
      }

      scheduledDateTime = dateObj;
    }

    const now = new Date();

    const documentToInsert = {
      clientName: clientName,
      userId: userId || null,
      barberId: barberId || null,
      scheduledAt: scheduledDateTime, // Grava como ISODate com a hora certa
      status: Status.SCHEDULED,
      estimatedDuration: Number(estimatedDuration || 0),
      totalPrice: Number(totalPrice || 0),
      createdAt: now,
      updatedAt: now,
      fila: false,
      startTime: null,
      completedAt: null,
      duration: 0,
    };

    const client = await clientPromise;
    const db = client.db('test');

    const result = await db.collection('queueentries').insertOne(documentToInsert);

    return NextResponse.json(
      {
        message: 'Agendamento criado com sucesso',
        insertedId: result.insertedId,
        ...documentToInsert,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[API agendar] Erro ao inserir:', err);
    return NextResponse.json(
      { error: 'Erro interno no servidor ao processar a requisição.' },
      { status: 500 }
    );
  }
}
