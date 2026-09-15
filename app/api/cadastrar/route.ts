import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('test');
    const { name, phone } = await request.json();
    const data = { name, phone };
    console.log('Dados recebidos:', data);

    const result = await db.collection('clients').insertOne(data);
    console.log('Cliente cadastrado com sucesso:', result);

    return NextResponse.json({ message: 'Cliente cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error);
    return NextResponse.json({ error: 'Failed to register client' }, { status: 500 });
  }
}

{
  /*export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const clients = await db.collection("clients").find({}).toArray();
    console.log('Clientes encontrados:', clients);

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}  */
}
