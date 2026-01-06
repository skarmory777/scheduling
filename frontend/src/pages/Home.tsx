//import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Calendar, Users, Clock } from "lucide-react";

export default function Home() {
  //const { user, isAuthenticated } = useAuth();
  const user = { name: "Usuário" }; // --- MOCK ---'
  const isAuthenticated = false; // --- MOCK ---

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Agendamento Pro</h1>
          </div>
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">Bem-vindo, {user?.name}</span>
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button>Entrar</Button>
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Agende seus Serviços com Facilidade
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Plataforma moderna para agendamentos em salões de beleza e clínicas
          </p>
          {!isAuthenticated && (
            <a href={getLoginUrl()}>
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                Começar Agora
              </Button>
            </a>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Calendar className="w-8 h-8 text-indigo-600 mb-2" />
              <CardTitle>Agendamento Fácil</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Selecione serviços, profissionais e horários disponíveis em poucos cliques
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Clock className="w-8 h-8 text-indigo-600 mb-2" />
              <CardTitle>Disponibilidade em Tempo Real</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Veja os horários disponíveis instantaneamente e escolha o melhor para você
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Users className="w-8 h-8 text-indigo-600 mb-2" />
              <CardTitle>Profissionais Qualificados</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Escolha entre profissionais experientes e especializados
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        {isAuthenticated && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Pronto para agendar?
            </h3>
            <p className="text-gray-600 mb-6">
              Acesse nosso sistema de agendamento e reserve seu horário agora
            </p>
            <Link href="/booking">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                Fazer Agendamento
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>&copy; 2024 Agendamento Pro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
