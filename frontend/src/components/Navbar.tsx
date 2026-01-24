import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  title?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title = 'Sistema de Agendamento' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-lg mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo e título */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SA</span>
                </div>
              </div>
              <span className="text-xl font-bold text-indigo-600 hidden sm:block">
                {title}
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* <Link
              to="/services"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Serviços
            </Link>
            <Link
              to="/appointments"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              {user.role === 'PROFESSIONAL' ? 'Atendimentos' : 'Meus Agendamentos'}
            </Link> */}
            <div className="border-l border-gray-300 pl-4">
              <span className="text-gray-700 text-sm mr-3">
                Olá, <strong>{user.name}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
