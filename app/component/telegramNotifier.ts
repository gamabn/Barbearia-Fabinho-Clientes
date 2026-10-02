import { getMongoClient } from '../lib/mongodb';
import { Bot } from 'node-telegram-bot-api';

const ENV_TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ENV_TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// LOG TEMPORÁRIO
console.log('[DEBUG] token len:', ENV_TELEGRAM_BOT_TOKEN?.length);
console.log('[DEBUG] token prefix:', ENV_TELEGRAM_BOT_TOKEN?.substring(0, 12));
console.log('[DEBUG] token suffix:', ENV_TELEGRAM_BOT_TOKEN?.slice(-4));
console.log('[DEBUG] chat_id:', ENV_TELEGRAM_CHAT_ID);
console.log('[DEBUG] token tem aspas?', ENV_TELEGRAM_BOT_TOKEN?.startsWith('"'));

const SALON_TIMEZONE = 'America/Sao_Paulo';

let botInstance: Bot | null = null;

function getBotInstance(): Bot | null {
  if (botInstance) {
    return botInstance;
  }
  const token = ENV_TELEGRAM_BOT_TOKEN;
  const minTokenLength = 20;

  if (token && token !== 'SEU_TOKEN_AQUI' && token.length > minTokenLength) {
    console.log('[TelegramNotifier] Inicializando nova instância do TelegramBot.');

    // Resolve o construtor em tempo de execução para evitar problemas do Turbopack
    // const pkg = require('node-telegram-bot-api');
    // v2: importação estática do pacote dual ESM+CJS
    botInstance = new Bot(token);
    return botInstance;

    //  return botInstance;
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
    // ✅ v2
    await bot.api.sendMessage({
      chat_id: ENV_TELEGRAM_CHAT_ID,
      text: mensagem.trim(),
    });
    // await bot.sendMessage(ENV_TELEGRAM_CHAT_ID, mensagem.trim());
    return { success: true, message: 'Notificação enviada.' };
  } catch (error) {
    console.error('[TelegramNotifier] ERRO AO ENVIAR MENSAGEM TELEGRAM:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido ao enviar notificação.';
    return { success: false, message: errorMessage };
  }
}
