import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
//import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Mail, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';

/**
 * Página de Recuperação de Senha
 */
export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  //const forgotPasswordMutation = trpc.auth.forgotPassword.useMutation({
  //  onSuccess: (data) => {
  //    toast.success(data.message);
  //    setSubmitted(true);
  //  },
  //  onError: (error) => {
  //    toast.error(error.message);
  //  },
  //});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email é obrigatório';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    //try {
    //  await forgotPasswordMutation.mutateAsync({ email });
    //} finally {
    //  setIsLoading(false);
    //}
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Card className="border border-slate-700 bg-slate-800 shadow-2xl">
            <div className="p-8 sm:p-10 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">
                Verifique seu Email
              </h1>
              <p className="text-slate-400 mb-6">
                Enviamos um link de recuperação de senha para <span className="font-semibold text-white">{email}</span>. Clique no link para redefinir sua senha.
              </p>
              <p className="text-slate-500 text-sm mb-6">
                O link expira em 1 hora. Se não receber o email, verifique sua pasta de spam.
              </p>
              <Button
                onClick={() => setLocation('/login')}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-200"
              >
                Voltar ao Login
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="border border-slate-700 bg-slate-800 shadow-2xl">
          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Recuperar Senha
              </h1>
              <p className="text-slate-400 text-sm">
                Digite seu email para receber um link de recuperação
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    placeholder="seu@email.com"
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Link de Recuperação'
                )}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 flex justify-center">
              <a
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Login
              </a>
            </div>
          </div>
        </Card>

        {/* Footer Text */}
        <p className="text-center text-slate-500 text-xs mt-6">
          © 2025 VITE_OAUTH_PORTAL. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
