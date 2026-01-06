import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Link, useLocation } from "wouter";
import { Loader2, Calendar, Clock, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from '../contexts/AuthContext';
import { appointmentsApi } from '../services/api';
import type { Appointment } from '@/types';

interface Notification {
  id: number;
  title: string;
  message: string;
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");

  // Carregar agendamentos
  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await appointmentsApi.getAppointments();
      console.log('Appointments response:', response);
      //setAppointments(response.data);
    } catch (error) {
      toast.error("Erro ao carregar agendamentos");
      setNotifications([
        { id: 1, title: "Agendamento Confirmado", message: "Seu agendamento de Barba foi confirmado." },
        { id: 2, title: "Promoção Especial", message: "20% de desconto em serviços de Cabelo nesta semana!" },
        { id: 3, title: "Lembrete", message: "Seu agendamento de Corte de Cabelo está chegando." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Necessário</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Você precisa estar autenticado para acessar o dashboard.
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED": return "bg-green-100 text-green-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      case "COMPLETED": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "SCHEDULED": return "Confirmado";
      case "CANCELLED": return "Cancelado";
      case "COMPLETED": return "Concluído";
      default: return status;
    }
  };

  const handleCancelAppointment = () => {
    if (!selectedAppointment || !cancellationReason.trim()) {
      toast.error("Informe o motivo do cancelamento");
      return;
    }

    setAppointments(prev =>
      prev.map(a =>
        a.id === selectedAppointment.id
          ? { ...a, status: "CANCELLED", cancelReason: cancellationReason }
          : a
      )
    );

    toast.success("Agendamento cancelado com sucesso");
    setSelectedAppointment(null);
    setCancellationReason("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Dashboard</h1>
          <p className="text-gray-600">Bem-vindo, {user?.name}!</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {appointments?.length || 0}
              </div>
              <p className="text-gray-600">Agendamentos</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {appointments?.filter(a => a.status === 'SCHEDULED').length || 0}
              </div>
              <p className="text-gray-600">Confirmados</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 text-center">
              <Link href="/booking">
                <Button className="bg-indigo-600 hover:bg-indigo-700 w-full">
                  Novo Agendamento
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Notificações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.slice(0, 3).map((notif) => (
                  <div key={notif.id} className="flex items-start gap-3 p-3 bg-white rounded border border-blue-100">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{notif.title}</p>
                      <p className="text-sm text-gray-600">{notif.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Appointments List */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Meus Agendamentos</CardTitle>
            <CardDescription>Histórico completo de seus agendamentos</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              </div>
            ) : appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{new Date(appointment.date).toLocaleDateString("pt-BR")}</span>
                        <Clock className="w-4 h-4 text-gray-500 ml-2" />
                        <span className="text-gray-600">{appointment.startTime}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Serviço: {appointment.serviceName || appointment.serviceId}</p>
                        <p>Profissional: {appointment.professionalName || appointment.professionalId}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(appointment.status)}>
                        {getStatusLabel(appointment.status)}
                      </Badge>

                      {appointment.status === "SCHEDULED" && (
                        <Dialog open={selectedAppointment?.id === appointment.id} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedAppointment(appointment)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancelar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Cancelar Agendamento</DialogTitle>
                              <DialogDescription>Informe o motivo do cancelamento</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Textarea
                                value={cancellationReason}
                                onChange={(e) => setCancellationReason(e.target.value)}
                                placeholder="Motivo do cancelamento..."
                                className="w-full"
                              />
                              <div className="flex gap-3 justify-end">
                                <Button variant="outline" onClick={() => setSelectedAppointment(null)}>Voltar</Button>
                                <Button onClick={handleCancelAppointment} className="bg-red-600 hover:bg-red-700">
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">Você ainda não tem agendamentos</p>
                <Link href="/booking">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">Fazer Primeiro Agendamento</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
