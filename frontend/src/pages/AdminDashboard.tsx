import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { servicesApi } from "@/services/api";
import type { Service } from '../types';


const AdminDashboard: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();
  const [error, setError] = useState('');

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

  const [professionals, setProfessionals] = useState([
    { id: 1, name: "João Silva", specialization: "Barbeiro", phone: "1111-1111" },
    { id: 2, name: "Maria Santos", specialization: "Estilista", phone: "2222-2222" },
    { id: 3, name: "Carlos Oliveira", specialization: "Barbeiro", phone: "3333-3333" },
  ]);

  const [workingHours, setWorkingHours] = useState([
    { id: 1, dayOfWeek: 1, startTime: "09:00", endTime: "18:00", isOpen: true },
    { id: 2, dayOfWeek: 2, startTime: "09:00", endTime: "18:00", isOpen: true },
    { id: 3, dayOfWeek: 3, startTime: "09:00", endTime: "18:00", isOpen: true },
    { id: 4, dayOfWeek: 4, startTime: "09:00", endTime: "18:00", isOpen: true },
    { id: 5, dayOfWeek: 5, startTime: "09:00", endTime: "18:00", isOpen: true },
    { id: 6, dayOfWeek: 6, startTime: "10:00", endTime: "15:00", isOpen: true },
    { id: 7, dayOfWeek: 0, startTime: "", endTime: "", isOpen: false },
  ]);

  const [newServiceDialog, setNewServiceDialog] = useState(false);
  const [newServiceData, setNewServiceData] = useState<Service>({
    id: "",
    name: "",
    description: null,
    duration: 30,
    price: 0,
    isActive: true,
  });

  if (!isAuthenticated || user && user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Você não tem permissão para acessar este painel.
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  const addNewService = async () => {
    try {
      const response = await servicesApi.createService(newServiceData);
      setServices(response.data);
    } catch (err: any) {
      console.error('Error loading services:', err);
      setError('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }

    toast.success("Serviço adicionado com sucesso!");
    setNewServiceDialog(false);

    setNewServiceData({
      id: "",
      name: "",
      description: null,
      duration: 30,
      price: 0,
      isActive: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
          <p className="text-gray-600">Gerencie sua clínica ou salão de beleza</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="professionals">Profissionais</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">{services.length}</div>
                  <p className="text-gray-600">Serviços Ativos</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{professionals.length}</div>
                  <p className="text-gray-600">Profissionais</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{workingHours.filter(h => h.isOpen).length}</div>
                  <p className="text-gray-600">Dias de Funcionamento</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>Gerenciar Serviços</CardTitle>
                  <CardDescription>Adicione, edite ou remova serviços</CardDescription>
                </div>
                <Dialog open={newServiceDialog} onOpenChange={setNewServiceDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Serviço
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Serviço</DialogTitle>
                      <DialogDescription>Preencha os detalhes do novo serviço</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Nome do Serviço"
                        value={newServiceData.name}
                        onChange={e => setNewServiceData({ ...newServiceData, name: e.target.value })}
                      />
                      <Textarea
                        placeholder="Descrição"
                        value={newServiceData.description ? newServiceData.description : ''}
                        onChange={e => setNewServiceData({ ...newServiceData, description: e.target.value })}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="number"
                          placeholder="Duração (min)"
                          value={newServiceData.duration}
                          onChange={e => setNewServiceData({ ...newServiceData, duration: parseInt(e.target.value) })}
                        />
                        <Input
                          type="number"
                          placeholder="Preço (R$)"
                          value={newServiceData.price}
                          onChange={e => setNewServiceData({ ...newServiceData, price: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setNewServiceDialog(false)}>Cancelar</Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={addNewService}>Adicionar</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {services.length > 0 ? (
                  <div className="space-y-3">
                    {services.map(service => (
                      <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div>
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600">{service.description}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <span>{service.duration} min</span>
                            <span>R$ {service.price}</span>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 py-8">Nenhum serviço cadastrado</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professionals Tab */}
          <TabsContent value="professionals" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Gerenciar Profissionais</CardTitle>
                <CardDescription>Visualize e gerencie os profissionais</CardDescription>
              </CardHeader>
              <CardContent>
                {professionals.length > 0 ? (
                  <div className="space-y-3">
                    {professionals.map(pro => (
                      <div key={pro.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div>
                          <h3 className="font-semibold text-gray-900">{pro.name}</h3>
                          <p className="text-sm text-gray-600">{pro.specialization}</p>
                          <p className="text-sm text-gray-500">{pro.phone}</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Ativo</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 py-8">Nenhum profissional cadastrado</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Horário de Funcionamento</CardTitle>
                <CardDescription>Configure os horários de funcionamento</CardDescription>
              </CardHeader>
              <CardContent>
                {workingHours.length > 0 ? (
                  <div className="space-y-3">
                    {workingHours.map(hours => (
                      <div key={hours.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-900">{dayNames[hours.dayOfWeek]}</h3>
                          {hours.isOpen ? (
                            <p className="text-sm text-gray-600">{hours.startTime} - {hours.endTime}</p>
                          ) : (
                            <p className="text-sm text-gray-600">Fechado</p>
                          )}
                        </div>
                        <Badge className={hours.isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {hours.isOpen ? "Aberto" : "Fechado"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 py-8">Nenhum horário configurado</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AdminDashboard;