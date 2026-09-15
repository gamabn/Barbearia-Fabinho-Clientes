import { NextResponse, NextRequest } from 'next/server';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    const client = await clientPromise;
    const db = client.db('test');

    const user = await db.collection('clients').findOne({ phone });

    if (!user) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
    }

    const response = NextResponse.json({
      message: 'Login realizado',
      client: {
        id: user._id,
        name: user.name,
        phone: user.phone,
      },
    });

    response.cookies.set('clientId', user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: 'Erro ao realizar login' }, { status: 500 });
  }
}
export async function GET() {
  try {
    const cookieStore = await cookies();

    const clientId = cookieStore.get('clientId')?.value;

    if (!clientId) {
      return NextResponse.json({ error: 'Cliente não autenticado' }, { status: 401 });
    }

    if (!ObjectId.isValid(clientId)) {
      return NextResponse.json({ error: 'ID do cliente inválido' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('test');

    const user = await db.collection('clients').findOne({
      _id: new ObjectId(clientId),
    });

    if (!user) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 401 });
    }

    return NextResponse.json({
      id: user._id,
      name: user.name,
      phone: user.phone,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: 'Erro ao buscar cliente' }, { status: 500 });
  }
}
