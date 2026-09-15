'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useMemo, useRef, useEffect } from 'react';
import { getClients } from '@/app/component/Clients';
import { Agend } from '@/app/component/Service-barber';
import { User, Phone, CalendarDays, Clock, CheckCircle } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ptBR } from 'date-fns/locale';

import { clientProps, serviceProps } from '@/app/api/types';
import { format, isToday } from 'date-fns';
import { getAgendamentos } from '@/app/component/getAgendamentos';

// Função utilitária para gerar os horários de funcionamento (ex: 08:00 às 18:00)
function generateTimeSlots(startHour = 8, endHour = 18, intervalMinutes = 30): string[] {
  const slots: string[] = [];
  const current = new Date();
  current.setHours(startHour, 0, 0, 0);

  const end = new Date();
  end.setHours(endHour, 0, 0, 0);

  while (current < end) {
    slots.push(format(current, 'HH:mm'));
    current.setMinutes(current.getMinutes() + intervalMinutes);
  }
  return slots;
}

// Opção recomendada: Desestruturando a prop
interface AgendarProps {
  agendar: boolean;
  onMudarAba: () => void;
}

export function Agendar({ agendar, onMudarAba }: AgendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectId, setSelectId] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectService, setSelectService] = useState<serviceProps | null>();
  const [messageApi, setMessageApi] = useState<null | string>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const resumoRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<boolean>(false);

  console.log('testando o agendar', agendar);

  useEffect(() => {
    if (active) {
      const timeoutId = setTimeout(() => {
        setActive(false);
        onMudarAba();
      }, 4000);

      return () => clearTimeout(timeoutId);
    }
  }, [active, onMudarAba]);

  // Lista fixa de horários do estabelecimento
  const timeSlots = useMemo(() => generateTimeSlots(8, 18, 30), []);

  const { data: clients } = useQuery<clientProps>({
    queryKey: ['clients'],
    queryFn: getClients,
  });
  console.log('Id do cliente', clients);
  const { data: services = [], isLoading: servicesLoading } = useQuery<serviceProps[]>({
    queryKey: ['services'],
    queryFn: Agend,
  });

  // const {data: agend = [], isLoading:loadindAgend} = useQuery<any>({
  // queryKey: ["agendamentos"],
  //  queryFn: getAgendamentos
  // })
  // Query para buscar agendamentos ocupados no dia selecionado
  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;

  // HORÁRIOS OCUPADOS DA DATA
  const { data: occupiedTimes = [] } = useQuery<string[]>({
    queryKey: ['appointments', formattedDate],
    queryFn: () => getAgendamentos(formattedDate!),
    enabled: !!formattedDate,
  });

  useEffect(() => {
    if (selectedDate) {
      servicesRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedTime) {
      resumoRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [selectedTime]);

  console.log('Horários ocupados:', occupiedTimes);
  // console.log("todos os agendamentos", agend)
  // console.log("Selected Date:", selectedDate);

  {
    /*const occupiedTimes = agend
        .filter((agendamento: any) => {
            if (!agendamento.scheduledAt || !formattedDate) {
            return false;
            }

            if (agendamento.status === "canceled") {
            return false;
            }

            const date = new Date(agendamento.scheduledAt);

            return format(date, "yyyy-MM-dd") === formattedDate;
        })
        .map((agendamento: any) => {
            const date = new Date(agendamento.scheduledAt);

            return format(date, "HH:mm");
     });   */
  }

  function handleServiceDate(dataService: serviceProps) {
    setSelectId(String(dataService._id));
    setSelectService(dataService);
    //  setSelectedDate(undefined);
    //setSelectedTime(null);
    console.log('ID do serviço', dataService._id);
    console.log('Id selecionado', selectId);
  }

  // Validação individual de cada slot de horário
  function isSlotDisabled(time: string): boolean {
    if (!selectedDate) return true;

    const [hours, minutes] = time.split(':').map(Number);

    // 1. Bloqueia o horário de almoço (12:00 até 12:59)

    const totalMinutes = hours * 60 + minutes;
    // 12:30 = (12 * 60) + 30 = 750 minutos
    // 13:30 = (13 * 60) + 30 = 810 minutos
    const startLunch = 12 * 60 + 30; // 750
    const endLunch = 13 * 60 + 30; // 810

    // Bloqueia slots que iniciam entre 12:30 (inclusive) e antes das 13:30
    if (totalMinutes >= startLunch && totalMinutes < endLunch) {
      return true;
    }
    //===============================================================================
    //if (hours === 12) return true;

    // 1. Bloqueia se o horário já passou (caso a data selecionada seja HOJE)
    if (isToday(selectedDate)) {
      const now = new Date();
      //  const [hours, minutes] = time.split(':').map(Number);
      const slotDate = new Date();
      slotDate.setHours(hours, minutes, 0, 0);

      if (slotDate <= now) return true;
    }
    //=====================================================================================
    // 2. Bloqueia se o horário já estiver agendado no banco
    if (occupiedTimes.includes(time)) return true;

    return false;
  }

  if (servicesLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <span
          className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent"
          aria-label="Carregando"
        />
      </div>
    );
  }

  function handleClear() {
    setSelectedTime(null);
    setSelectedDate(undefined);
  }
  console.log('Cliente Unico', clients?.id);
  async function handleAgend() {
    setMessageApi(null);
    console.log('dados do agendamento', { clients, selectedDate, selectService, selectedTime });
    if (!clients || !selectService || !selectedDate) {
      setMessageApi('Preencha todos os campos');
    }

    try {
      const data = {
        clientName: clients?.name, // Extrai 'Flavio G Silva' do objeto
        userId: clients?.id, // Extrai o ID do cliente
        estimatedDuration: selectService?.duration, // Extrai a duração (ex: 30)
        totalPrice: selectService?.price, // Extrai o preço (ex: 40)
        selectedDate: selectedDate, // Passa a data selecionada
        selectedTime: selectedTime, // Passa o horário ("08:00")
      };

      const res = await fetch('/api/agendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!result) {
        setMessageApi('Erro ao agendar');

        return;
      }
      setActive(true);
      setSelectService(null);
      setSelectedDate(undefined);
      setSelectedTime(null);

      // setMessageApi('Agendamento realizado com sucesso!');
    } catch (error) {
      setMessageApi('Erro da api');
      console.error(error);
    }
  }

  if (active) {
    return (
      <div className="flex flex-col flex-grow items-center justify-center bg-white w-full h-screen text-black p-6">
        <CheckCircle className="w-24 h-24 text-green-500 mb-6 mx-auto" />{' '}
        {/* Adicionado mx-auto para centralizar o ícone se a div pai for flex-col */}
        <h1 className="text-3xl font-bold mb-4">Agendamento Confirmado!</h1>
        <p className="text-lg text-black mb-8">
          Obrigado, {clients?.name}! Seu horário foi reservado com sucesso.
        </p>
        <button
          onClick={() => {
            //setSubmissionStatus(null);
            // Resetar estado para novo agendamento
            setSelectService(null);
            // setSelectedBarberId(NO_PREFERENCE_BARBER_ID); // Não é mais necessário
            setSelectedDate(undefined);
            setSelectedTime(null);
            onMudarAba();
            // router.push('/agendClient');
            // Redireciona para a página inicial ou outra página desejada
          }}
          className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-6 rounded-lg shadow-xl transition duration-300 text-lg"
        >
          Ver historico
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-3 bg-white text-black min-h-screen overflow-auto py-2 mb-3">
      <h1 className="text-2xl text-center font-bold">Agendar serviço</h1>

      <section className="flex flex-col gap-4 mt-4">
        <div className="flex items-center justify-center gap-2 border-b border-gray-300 pb-2">
          <div className="flex gap-3 bg-gray-200 p-2 rounded-lg">
            <h2 className="flex items-center text-lg">
              <span>
                <User color="rgb(49, 170, 33)" size={20} />
              </span>
              {clients?.name}
            </h2>
            <p className="flex items-center text-lg">
              <span>
                <Phone size={20} color="rgb(49, 170, 33)" />
              </span>
              {clients?.phone}
            </p>
          </div>
        </div>

        <div className="">
          {services && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service: serviceProps) => {
                const isSelected = String(selectId) === String(service._id);
                return (
                  <button
                    key={String(service._id)}
                    onClick={() => handleServiceDate(service)}
                    className={`flex border p-2 rounded-lg items-center justify-center gap-2 transition-colors ${
                      isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black'
                    }`}
                  >
                    <h2>{service.name}</h2>
                    <p>R$ {service.price}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="mb-4">
        {selectId && (
          <div className="flex items-center justify-center max-md:flex-col fle-col w-full mt-3">
            <div className="w-full">
              <h2 className="text-lg font-semibold text-black mb-4 flex items-center">
                <CalendarDays className="mr-3 text-blue-500" />
                Escolha a Data
              </h2>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                disabled={(date) => {
                  const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                  return isPast;
                }}
                className="bg-white text-black w-full p-4 max-sm:w-sm rounded-lg shadow-lg border border-gray-400"
                classNames={{
                  caption_label: 'text-black',
                  weekdays: 'text-blue-500',
                  selected: 'bg-green-500 text-white hover:bg-green-700 !font-bold',
                  today: 'text-black !font-bold border border-amber-400 rounded-md',
                  day: 'hover:bg-purple-700/50 rounded-md text-black',
                }}
              />
            </div>

            {selectedDate && (
              <div ref={servicesRef} className="flex w-full flex-col m-4">
                <h2 className="text-xl font-semibold text-black mb-3 flex items-center">
                  <Clock className="mr-2 text-blue-500" /> Escolha o Horário
                </h2>
                <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto p-1">
                  {timeSlots.map((time) => {
                    const disabled = isSlotDisabled(time);
                    const isSelected = selectedTime === time;

                    return (
                      <button
                        key={time}
                        disabled={disabled}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 rounded-md text-sm font-medium border transition-colors ${
                          disabled
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                            : isSelected
                              ? 'bg-green-600 text-white border-green-600'
                              : 'bg-white text-black border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <section ref={resumoRef} className="mb-3">
        <div>
          {selectedTime && (
            <div
              //  ref={resumoRef}
              className="flex flex-col gap-2 w-full p-3 border border-gray-400 shadow-xl rounded-lg"
            >
              <h2 className="text-center font-semibold text-xl p-2">Resumo do agendamento</h2>

              <div className=" bg-gray-100 p-2 rounded-lg">
                <h3 className="text-lg font-semibold text-start">Serviços</h3>
                <div className="flex items-center  gap-3">
                  <p>{selectService?.name}</p>
                  <p className="text-green-500 ">R$ {selectService?.price}</p>
                </div>
              </div>

              <div className="bg-gray-100 p-2 rounded-lg">
                <h3 className="text-lg font-semibold">Data do serviço</h3>

                <div className="flex gap-3 text-blue-500">
                  <p>{selectedDate?.toLocaleDateString('pt-BR')}</p>
                  <p>{selectedTime}</p>
                </div>
              </div>
              {messageApi && (
                <span className="text-red-500 text-center font-mediun p-3 text-lg">
                  {messageApi}
                </span>
              )}
              <div className="flex items-center justify-around p-3">
                <div>
                  <button onClick={handleAgend} className="bg-blue-500 p-2 rounded-lg text-white">
                    Agendar
                  </button>
                </div>

                <button
                  onClick={handleClear}
                  className="text-white bg-red-500 border border-gray-500 p-2 rounded-lg"
                >
                  Excluir
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
