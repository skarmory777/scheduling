import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesApi } from '../services/api';
import type { Service } from '../types';

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await servicesApi.getServices();
      setServices(response.data);
    } catch (err: any) {
      console.error('Error loading services:', err);
      setError('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectService = (serviceId: string) => {
    navigate(`/booking/${serviceId}`);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Serviços Disponíveis</h1>
          <p className="mt-2 text-gray-600">Selecione um serviço para agendar</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleSelectService(service.id)}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Duração:</span> {service.duration} min
                </div>
                <div className="text-lg font-bold text-indigo-600">
                  R$ {Number(service.price).toFixed(2)}
                </div>
              </div>
              <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                Agendar
              </button>
            </div>
          ))}
        </div>

        {services.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum serviço disponível no momento</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
