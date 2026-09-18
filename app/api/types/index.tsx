import { ObjectId, Long } from 'mongodb';

export const colorPage = {
  white: '#fff',
  dark: '#000',
  gray: '#b7bdb4',
  green: '#0adc2d',
  red: '#e80927',
  blue: '#00ff',
};

export interface clientProps {
  id: ObjectId | null | string;
  name: string;
  phone: string;
}

export interface serviceProps {
  _id: ObjectId;
  name: string;
  duration: number | Long;
  price: number;
  __v?: number;
}

export interface IQueueEntry {
  _id?: ObjectId;
  clientName: string;
  status: string;
  scheduledAt: Date;
  barberId: ObjectId;
  estimatedDuration: number | Long;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  userId: ObjectId;
  fila: boolean;
  duration?: number | Long | null;
}

export interface IQueueEntryWithServices {
  _id: ObjectId;
  clientName: string;
  status: string;
  scheduledAt: Date;
  totalPrice: number;
  nomesDosServicos: string[];
}

export interface IQueueService {
  _id?: ObjectId;
  queueEntryId: ObjectId;
  serviceId: ObjectId;
}
