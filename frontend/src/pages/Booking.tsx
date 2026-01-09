import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesApi } from '../services/api';
import type { Service } from '../types';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { useLocation } from "wouter";
import { Loader2, ArrowRight, Check } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

type BookingStep = "service" | "professional" | "datetime" | "confirmation" | "success";

// Mocked data
const mockServices = [
  { id: 1, name: "Corte de Cabelo", description: "Corte masculino", durationMinutes: 30, price: 40 },
  { id: 2, name: "Barba", description: "Barba completa", durationMinutes: 20, price: 25 },
  { id: 3, name: "Corte Infantil", description: "Corte para crianças", durationMinutes: 25, price: 30 },
];

const mockProfessionals = [
  { id: 1, name: "João Silva", specialization: "Barbeiro", phone: "1111-1111" },
  { id: 2, name: "Maria Santos", specialization: "Estilista", phone: "2222-2222" },
  { id: 3, name: "Carlos Oliveira", specialization: "Barbeiro", phone: "3333-3333" },
];

//export default function Booking() {
const Booking: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState<BookingStep>("service");

  // Form state
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const professionals = mockProfessionals;
  const professionalsLoading = false;

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


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Necessário</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Você precisa estar autenticado para fazer um agendamento.
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleContinue = () => {
    if (currentStep === "service" && !selectedService) {
      toast.error("Selecione um serviço");
      return;
    }
    if (currentStep === "professional" && !selectedProfessional) {
      toast.error("Selecione um profissional");
      return;
    }
    if (currentStep === "datetime" && (!selectedDate || !selectedTime)) {
      toast.error("Selecione data e horário");
      return;
    }

    const steps: BookingStep[] = ["service", "professional", "datetime", "confirmation", "success"];
    const nextIndex = steps.indexOf(currentStep) + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleConfirm = () => {
    toast.success("Agendamento criado com sucesso! (mock)");
    setCurrentStep("success");
    setTimeout(() => navigate("/dashboard"), 2000);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {["service", "professional", "datetime", "confirmation"].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep === step
                    ? "bg-indigo-600 text-white"
                    : ["service", "professional", "datetime", "confirmation"].indexOf(currentStep) > index
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                    }`}
                >
                  {["service", "professional", "datetime", "confirmation"].indexOf(currentStep) > index ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 3 && (
                  <div
                    className={`w-12 h-1 mx-2 ${["service", "professional", "datetime", "confirmation"].indexOf(currentStep) > index
                      ? "bg-green-600"
                      : "bg-gray-300"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>
              {currentStep === "service" && "Selecione um Serviço"}
              {currentStep === "professional" && "Escolha um Profissional"}
              {currentStep === "datetime" && "Selecione Data e Horário"}
              {currentStep === "confirmation" && "Confirme seu Agendamento"}
            </CardTitle>
            <CardDescription>
              {currentStep === "service" && "Escolha o serviço que deseja agendar"}
              {currentStep === "professional" && "Selecione o profissional que atenderá você"}
              {currentStep === "datetime" && "Escolha a data e horário disponíveis"}
              {currentStep === "confirmation" && "Revise os detalhes do seu agendamento"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Service Selection */}
            {currentStep === "service" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedService === service.id
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                        }`}
                    >
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">{service.duration} min</span>
                        <span className="font-bold text-indigo-600">R$ {service.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Professional Selection */}
            {currentStep === "professional" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {professionals.map((professional) => (
                    <div
                      key={professional.id}
                      onClick={() => setSelectedProfessional(professional.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedProfessional === professional.id
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                        }`}
                    >
                      <h3 className="font-semibold text-gray-900">{professional.name}</h3>
                      <p className="text-sm text-gray-600">{professional.specialization}</p>
                      <p className="text-xs text-gray-500 mt-2">{professional.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Date and Time Selection */}
            {currentStep === "datetime" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime("");
                    }}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className="w-full"
                  />
                </div>

                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Horário</label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {["09:00", "10:00", "11:00", "14:00", "15:00"].map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-2 rounded border-2 transition-all text-sm font-medium ${selectedTime === time
                            ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                            : "border-gray-200 hover:border-indigo-300"
                            }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === "confirmation" && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Serviço</p>
                    <p className="font-semibold text-gray-900">
                      {services.find((s) => s.id === selectedService)?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Profissional</p>
                    <p className="font-semibold text-gray-900">
                      {professionals.find((p) => p.id === selectedProfessional)?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Data e Horário</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedDate).toLocaleDateString("pt-BR")} às {selectedTime}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações (opcional)
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Deixe suas observações ou preferências..."
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  const steps: BookingStep[] = ["service", "professional", "datetime", "confirmation"];
                  const currentIndex = steps.indexOf(currentStep);
                  if (currentIndex > 0) {
                    setCurrentStep(steps[currentIndex - 1]);
                  }
                }}
                disabled={currentStep === "service"}
              >
                Voltar
              </Button>

              {currentStep === "confirmation" ? (
                <Button
                  onClick={handleConfirm}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Confirmar Agendamento
                  <Check className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleContinue}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Booking;