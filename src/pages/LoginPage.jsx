import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // PASSO 1: Importar o useNavigate
import { supabase } from '../supabaseClient';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // PASSO 2: Inicializar o hook de navegação

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.error_description || error.message);
    } else {
      // PASSO 3: Redirecionar para o mapa após o login
      navigate('/mapa');
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.error_description || error.message);
    } else {
      alert('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-sherloc-dark min-h-screen flex flex-col items-center justify-center font-lexend text-sherloc-text">
      <div className="bg-sherloc-dark-2 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="font-poppins text-3xl font-bold text-center mb-2">Acesse o Sherloc</h2>
        <p className="text-center text-gray-400 mb-6">Continue sua jornada ou comece uma nova aventura.</p>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
            <input id="email" className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-sherloc-yellow focus:border-sherloc-yellow block w-full p-2.5" type="email" placeholder="Seu email" value={email} required onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium">Senha</label>
            <input id="password" className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-sherloc-yellow focus:border-sherloc-yellow block w-full p-2.5" type="password" placeholder="Sua senha" value={password} required onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="flex space-x-4">
            {/* PASSO 4: Garantir que o onClick chama a função handleLogin CORRETA */}
            <button disabled={loading} onClick={handleLogin} className="w-full text-black bg-sherloc-yellow hover:bg-yellow-400 font-bold rounded-lg text-sm px-5 py-2.5 text-center transition-colors">
              {loading ? 'Carregando...' : 'Login'}
            </button>
            <button disabled={loading} onClick={handleSignUp} className="w-full text-white bg-transparent border border-gray-600 hover:bg-gray-700 font-bold rounded-lg text-sm px-5 py-2.5 text-center transition-colors">
              {loading ? 'Carregando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;