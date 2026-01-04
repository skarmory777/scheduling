import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '../services/api';
//import { Service, AvailableSlot } from '../types';
import type { Service, AvailableSlot } from '../types';

const Booking: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (serviceId) {
      loadService();
    }
  }, [serviceId]);

  useEffect(() => {
    if (serviceId && selectedDate) {
      loadAvailability();
    }
  }, [serviceId, selectedDate]);

  const loadService = async () => {
    try {
      const response = await api.get<Service>(`/services/${serviceId}`);
      setService(response.data);
    } catch (err) {
      setError('Erro ao carregar serviço');
    }
  };

  const loadAvailability = async () => {
    setLoading(true);
    try {
      const response = await api.get<AvailableSlot[]>('/appointments/availability', {
        params: { serviceId, date: selectedDate }
      });
      setAvailableSlots(response.data);
    } catch (err) {
      setError('Erro ao carregar disponibilidade');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (startTime: string) => {
    setError('');
    setSuccess('');
    try {
      await api.post('/appointments', {
        serviceId,
        date: selectedDate,
        startTime
      });
      setSuccess('Agendamento realizado com sucesso!');
      setTimeout(() => navigate('/appointments'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar agendamento');
    }
  };

  const getNextDays = (count: number) => {
    const days = [];
    for (let i = 0; i < count; i++) {
      days.push(addDays(new Date(), i));
    }
    return days;
  };

  if (!service) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/services')}
          className="mb-4 text-indigo-600 hover:text-indigo-800"
        >
          ← Voltar para serviços
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h1>
          <p className="text-gray-600 mb-4">{service.description}</p>
          <div className="flex gap-4">
            <span className="text-sm text-gray-500">
              <strong>Duração:</strong> {service.duration} minutos
            </span>
            <span className="text-sm text-gray-500">
              <strong>Preço:</strong> R$ {Number(service.price).toFixed(2)}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Selecione a Data</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {getNextDays(7).map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`p-3 rounded-lg border-2 transition-colors ${selectedDate === dateStr
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-indigo-300'
                    }`}
                >
                  <div className="text-xs text-gray-500">
                    {format(day, 'EEE', { locale: ptBR })}
                  </div>
                  <div className="text-lg font-semibold">{format(day, 'dd/MM')}</div>
                </button>
              );
            })}
          </div>

          <h2 className="text-xl font-semibold mb-4">Horários Disponíveis</h2>
          {loading ? (
            <div className="text-center py-8">Carregando horários...</div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {availableSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => handleBooking(slot.startTime)}
                  className="p-3 border-2 border-gray-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <div className="font-semibold">{slot.startTime}</div>
                  <div className="text-xs text-gray-500">{slot.professionalName}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhum horário disponível para esta data
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
