import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { appointmentsApi } from '../services/api';
import type { Appointment } from '../types';
import { useAuth } from '../contexts/AuthContext';

const MyAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await appointmentsApi.getAppointments();
      setAppointments(response.data);
    } catch (err) {
      setError('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!cancelReason.trim()) {
      alert('Por favor, informe o motivo do cancelamento');
      return;
    }

    try {
      await appointmentsApi.cancelAppointment(appointmentId, cancelReason);
      setCancellingId(null);
      setCancelReason('');
      loadAppointments();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao cancelar agendamento');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      SCHEDULED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-blue-100 text-blue-800'
    };
    const labels = {
      SCHEDULED: 'Agendado',
      CANCELLED: 'Cancelado',
      COMPLETED: 'Concluído'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'PROFESSIONAL' ? 'Meus Atendimentos' : 'Meus Agendamentos'}
          </h1>
          <p className="mt-2 text-gray-600">
            {user?.role === 'PROFESSIONAL'
              ? 'Gerencie seus atendimentos agendados'
              : 'Visualize e gerencie seus agendamentos'}
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {appointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">Nenhum agendamento encontrado</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map(appointment => (
              <div key={appointment.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {appointment.serviceName}
                      </h3>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <strong>Data:</strong>{' '}
                        {format(new Date(appointment.date + 'T00:00:00'), "dd 'de' MMMM 'de' yyyy", {
                          locale: ptBR
                        })}
                      </p>
                      <p>
                        <strong>Horário:</strong> {appointment.startTime} - {appointment.endTime}
                      </p>
                      {user?.role === 'PROFESSIONAL' ? (
                        <p>
                          <strong>Cliente:</strong> {appointment.clientName}
                        </p>
                      ) : (
                        <p>
                          <strong>Profissional:</strong> {appointment.professionalName}
                        </p>
                      )}
                      {appointment.cancelReason && (
                        <p className="text-red-600">
                          <strong>Motivo do cancelamento:</strong> {appointment.cancelReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {appointment.status === 'SCHEDULED' && user?.role === 'CLIENT' && (
                    <div className="mt-4 md:mt-0 md:ml-4">
                      {cancellingId === appointment.id ? (
                        <div className="space-y-2">
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Motivo do cancelamento"
                            rows={3}
                            value={cancelReason}
                            onChange={e => setCancelReason(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => {
                                setCancellingId(null);
                                setCancelReason('');
                              }}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setCancellingId(appointment.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Cancelar Agendamento
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
