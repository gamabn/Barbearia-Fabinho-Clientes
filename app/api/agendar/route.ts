import { NextResponse, NextRequest } from 'next/server';
import { getMongoClient } from '@/app/lib/mongodb';
import { Status } from '../types/status';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  //=================================
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
      serviceId,
      serviceIds,
    } = body;

    console.log('Id do usuario', userId);

    if (!clientName) {
      return NextResponse.json({ error: 'O campo clientName é obrigatório.' }, { status: 400 });
    }

    // ✅ CORREÇÃO DO PROCESSAMENTO DA DATA E HORÁRIO
    let scheduledDateTime = null;

    if (selectedDate) {
      if (selectedTime && typeof selectedTime === 'string') {
        // Extrai apenas os números da data caso venha algo como "2026-09-30T..."
        const dateOnly =
          typeof selectedDate === 'string' ? selectedDate.split('T')[0] : selectedDate;

        // Formata com o fuso -03:00 (Brasília / Bahia)
        // Exemplo: "2026-09-30T14:00:00-03:00"
        const isoStringLocal = `${dateOnly}T${selectedTime}:00-03:00`;
        scheduledDateTime = new Date(isoStringLocal);
      } else {
        scheduledDateTime = new Date(selectedDate);
      }
    }

    const now = new Date();

    const documentToInsert = {
      clientName: clientName,
      userId: userId || null,
      barberId: barberId || null,
      scheduledAt: scheduledDateTime, // Grava a data no fuso correto
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

    const client = await getMongoClient();
    const db = client.db('test');

    const result = await db.collection('queueentries').insertOne(documentToInsert);

    // Salva a relação com o(s) serviço(s) na coleção 'QueueService'
    const servicesList = serviceIds || (serviceId ? [serviceId] : []);
    console.log('[API agendar] serviceId recebido:', serviceId, 'servicesList:', servicesList);

    if (servicesList.length > 0) {
      const queueServicesDocs = servicesList
        .filter((sId: unknown) => sId && ObjectId.isValid(String(sId)))
        .map((sId: unknown) => ({
          queueEntryId: result.insertedId,
          serviceId: new ObjectId(String(sId)),
        }));

      if (queueServicesDocs.length > 0) {
        await db.collection('QueueService').insertMany(queueServicesDocs);
        console.log('[API agendar] Gravado com sucesso na QueueService:', queueServicesDocs);
      } else {
        console.warn(
          '[API agendar] Nenhum serviceId válido encontrado para gravar na QueueService'
        );
      }
    } else {
      console.warn('[API agendar] Nenhum serviceId informado na requisição');
    }

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
