import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';
import { IQueueEntryWithServices } from '@/app/api/types';

export async function GET(_request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  console.log('identidade do usuario', userId);

  if (!userId) {
    return NextResponse.json({ error: 'Cliente invalido' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('test');

    // Suporta busca por userId tanto como string quanto como ObjectId
    const userFilter = ObjectId.isValid(userId)
      ? { $or: [{ userId }, { userId: new ObjectId(userId) }] }
      : { userId };

    const agendamentos = await db
      .collection('queueentries')
      .aggregate<IQueueEntryWithServices>([
        // 1. Filtra pelos agendamentos do cliente
        {
          $match: userFilter,
        },
        // 2. Ordena pelos mais recentes primeiro
        {
          $sort: { scheduledAt: -1 },
        },
        // 3. Busca na tabela de relação: 'QueueService'
        {
          $lookup: {
            from: 'QueueService',
            localField: '_id',
            foreignField: 'queueEntryId',
            as: 'relacoesServicos',
          },
        },
        // 4. Busca na tabela de serviços: 'services'
        {
          $lookup: {
            from: 'services',
            localField: 'relacoesServicos.serviceId',
            foreignField: '_id',
            as: 'dadosDosServicos',
          },
        },
        // 5. Formata os campos de retorno incluindo os nomes dos serviços
        {
          $project: {
            _id: 1,
            clientName: 1,
            status: 1,
            scheduledAt: 1,
            totalPrice: 1,
            estimatedDuration: 1,
            createdAt: 1,
            updatedAt: 1,
            userId: 1,
            barberId: 1,
            fila: 1,
            nomesDosServicos: '$dadosDosServicos.name',
          },
        },
      ])
      .toArray();

    return NextResponse.json(agendamentos, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return NextResponse.json({ error: 'Erro ao buscar agendamentos' }, { status: 500 });
  }
}
