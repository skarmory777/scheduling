import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
//import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Página de Redefinição de Senha
 */
export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Extrair token da URL
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      toast.error('Token de redefinição inválido');
      setLocation('/login');
    }
  }, []);

  //const resetPasswordMutation = trpc.auth.resetPassword.useMutation({
  //  onSuccess: (data) => {
  //    toast.success(data.message);
  //    setSuccess(true);
  //    setTimeout(() => setLocation('/login'), 2000);
  //  },
  //  onError: (error) => {
  //    toast.error(error.message);
  //  },
  //});

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    setPasswordRequirements({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /\d/.test(value),
      special: /[@$!%*?&]/.test(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};

    if (!newPassword) newErrors.newPassword = 'Senha é obrigatória';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    if (newPassword !== confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    //try {
    //  await resetPasswordMutation.mutateAsync({
    //    token,
    //    newPassword,
    //    confirmPassword,
    //  });
    //} finally {
    //  setIsLoading(false);
    //}
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Card className="border border-slate-700 bg-slate-800 shadow-2xl">
            <div className="p-8 sm:p-10 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">
                Senha Redefinida com Sucesso!
              </h1>
              <p className="text-slate-400 mb-6">
                Sua senha foi alterada com sucesso. Você será redirecionado para o login em breve.
              </p>
              <Button
                onClick={() => setLocation('/login')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-200"
              >
                Ir para Login
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-md">
        <Card className="border border-slate-700 bg-slate-800 shadow-2xl">
          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg mb-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Redefinir Senha
              </h1>
              <p className="text-slate-400 text-sm">
                Digite sua nova senha abaixo
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password Field */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Nova Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      handlePasswordChange(e.target.value);
                      if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                    }}
                    placeholder="••••••••"
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.newPassword}
                  </p>
                )}

                {/* Password Requirements */}
                {newPassword && (
                  <div className="mt-3 space-y-1 text-xs">
                    <div className={`flex items-center ${passwordRequirements.length ? 'text-green-400' : 'text-slate-500'}`}>
                      <CheckCircle className="w-3 h-3 mr-2" />
                      Mínimo 8 caracteres
                    </div>
                    <div className={`flex items-center ${passwordRequirements.uppercase ? 'text-green-400' : 'text-slate-500'}`}>
                      <CheckCircle className="w-3 h-3 mr-2" />
                      Uma letra maiúscula
                    </div>
                    <div className={`flex items-center ${passwordRequirements.lowercase ? 'text-green-400' : 'text-slate-500'}`}>
                      <CheckCircle className="w-3 h-3 mr-2" />
                      Uma letra minúscula
                    </div>
                    <div className={`flex items-center ${passwordRequirements.number ? 'text-green-400' : 'text-slate-500'}`}>
                      <CheckCircle className="w-3 h-3 mr-2" />
                      Um número
                    </div>
                    <div className={`flex items-center ${passwordRequirements.special ? 'text-green-400' : 'text-slate-500'}`}>
                      <CheckCircle className="w-3 h-3 mr-2" />
                      Um caractere especial (@$!%*?&)
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                    }}
                    placeholder="••••••••"
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !allRequirementsMet}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Redefinindo...
                  </>
                ) : (
                  'Redefinir Senha'
                )}
              </Button>
            </form>
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
