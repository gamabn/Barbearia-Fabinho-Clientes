import { getMongoClient } from '../lib/mongodb';
import * as TelegramBot from 'node-telegram-bot-api';

const ENV_TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ENV_TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Defina o fuso horário para o salão.
const SALON_TIMEZONE = 'America/Sao_Paulo';

let botInstance: TelegramBot | null = null;

function getBotInstance(): TelegramBot | null {
  if (botInstance) {
    return botInstance;
  }
  const token = ENV_TELEGRAM_BOT_TOKEN;
  const minTokenLength = 20;

  if (token && token !== 'SEU_TOKEN_AQUI' && token.length > minTokenLength) {
    console.log('[TelegramNotifier] Inicializando nova instância do TelegramBot.');
    botInstance = new TelegramBot(token);
    return botInstance;
  } else {
    if (!token) {
      console.warn('[TelegramNotifier] Bot não inicializado: TELEGRAM_BOT_TOKEN não definido.');
    } else if (token === 'SEU_TOKEN_AQUI') {
      console.warn(
        '[TelegramNotifier] Bot não inicializado: TELEGRAM_BOT_TOKEN está configurado com o valor placeholder "SEU_TOKEN_AQUI". Use o token real.'
      );
    } else if (token.length <= minTokenLength) {
      console.warn(
        `[TelegramNotifier] Bot não inicializado: TELEGRAM_BOT_TOKEN é muito curto (comprimento ${token.length}), verifique se é um token válido.`
      );
    } else {
      console.warn(
        `[TelegramNotifier] Bot não inicializado: TELEGRAM_BOT_TOKEN ("${token.substring(0, 10)}...") parece inválido ou é um placeholder não capturado pelas verificações anteriores.`
      );
    }
    return null;
  }
}

export async function sendLatestAppointmentNotification() {
  const bot = getBotInstance();

  if (!bot) {
    return { success: false, message: 'Bot do Telegram não inicializado.' };
  }
  if (!ENV_TELEGRAM_CHAT_ID || ENV_TELEGRAM_CHAT_ID === 'SEU_CHAT_ID_AQUI') {
    console.warn(
      '[TelegramNotifier] TELEGRAM_CHAT_ID não configurado corretamente. Notificação não enviada.'
    );
    return {
      success: false,
      message: 'ID do chat do Telegram não configurado.',
    };
  }

  try {
    // Conexão obtida sob demanda para evitar problemas com Top-Level await no escopo do arquivo
    const client = await getMongoClient();
    const db = client.db('test');

    const latestAgendamento = await db
      .collection('queueentries')
      .findOne({}, { sort: { createdAt: -1 } });

    if (!latestAgendamento) {
      console.warn(
        '[TelegramNotifier] Nenhum agendamento encontrado no banco de dados para notificar.'
      );
      return { success: false, message: 'Nenhum agendamento encontrado.' };
    }

    if (!latestAgendamento.scheduledAt) {
      console.warn(
        `[TelegramNotifier] Agendamento ID ${latestAgendamento.id} encontrado, mas não possui scheduledAt. Não é possível notificar.`
      );
      return {
        success: false,
        message: 'Agendamento encontrado sem data/hora definida.',
      };
    }

    const cliente = latestAgendamento.clientName || 'Cliente não informado';
    const scheduledAtFromDb = latestAgendamento.scheduledAt;

    // Formatação da data e hora no fuso horário local
    const dataAgendamento = new Intl.DateTimeFormat('en-GB', {
      timeZone: SALON_TIMEZONE,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(scheduledAtFromDb);

    const horaAgendamento = new Intl.DateTimeFormat('en-GB', {
      timeZone: SALON_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).format(scheduledAtFromDb);

    console.log(
      `[TelegramNotifier] Data formatada: ${dataAgendamento}, Hora formatada: ${horaAgendamento} (para ${SALON_TIMEZONE})`
    );

    const nomesServicos =
      latestAgendamento.queueServices
        ?.map((qs: { service?: { name?: string } }) => qs.service?.name)
        .filter((name: string | undefined) => !!name)
        .join(', ') || 'Serviço não especificado';

    const nomeBarbeiro = latestAgendamento.barber?.name || 'Barbeiro não especificado';

    const mensagem = `
Novo Agendamento na Barbearia! 💈
-----------------------------------
Cliente: ${cliente}
Data: ${dataAgendamento}
Hora: ${horaAgendamento}
Serviço(s): ${nomesServicos}
Barbeiro: ${nomeBarbeiro}
-----------------------------------
`;
    await bot.sendMessage(ENV_TELEGRAM_CHAT_ID, mensagem.trim());
    return { success: true, message: 'Notificação enviada.' };
  } catch (error) {
    console.error('[TelegramNotifier] ERRO AO ENVIAR MENSAGEM TELEGRAM:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido ao enviar notificação.';
    return { success: false, message: errorMessage };
  }
}
