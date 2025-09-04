import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabaseClient'
import MapComponent from './components/Map'

// --- COMPONENTE FILTER ATUALIZADO COM TAILWIND ---
const Filter = ({ setFilter }) => {
  return (
    <div className="bg-sherloc-dark-2 p-2 rounded-lg shadow-lg flex items-center space-x-2">
      <span className="font-semibold text-sherloc-text mr-2 font-lexend text-sm">Filtrar:</span>
      <button className="px-3 py-1 text-sm font-medium text-sherloc-text rounded-md hover:bg-gray-700 transition-colors" onClick={() => setFilter('all')}>Todos</button>
      <button className="px-3 py-1 text-sm font-medium text-sherloc-text rounded-md hover:bg-gray-700 transition-colors" onClick={() => setFilter('restaurante')}>Restaurantes</button>
      <button className="px-3 py-1 text-sm font-medium text-sherloc-text rounded-md hover:bg-gray-700 transition-colors" onClick={() => setFilter('ponto_turistico')}>Pontos Turísticos</button>
    </div>
  )
}

function App() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setSession(session) })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.error_description || error.message)
    setLoading(false)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.error_description || error.message)
    else alert('Cadastro realizado! Verifique seu e-mail para confirmar a conta.')
    setLoading(false)
  }

  // Tela de Login (já estilizada)
  if (!session) {
    return (
      <div className="bg-sherloc-dark min-h-screen flex flex-col items-center justify-center font-lexend text-sherloc-text">
        <div className="bg-sherloc-dark-2 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="font-poppins text-3xl font-bold text-center mb-2">Bem-vindo ao Sherloc</h2>
          <p className="text-center text-gray-400 mb-6">Faça seu login ou cadastre-se para começar a explorar.</p>
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
    )
  }

  // --- TELA DO MAPA COM CABEÇALHO E FILTROS ESTILIZADOS ---
  return (
    <div className="font-lexend">
      {/* Cabeçalho do Usuário */}
      <div className="absolute top-4 right-4 z-[1000] bg-sherloc-dark-2 p-2 rounded-lg shadow-lg flex items-center space-x-4 text-sm">
         <Link to="/dashboard" className="text-sherloc-text hover:text-sherloc-yellow transition-colors font-semibold">Dashboard</Link>
        <Link to="/roteiros" className="text-sherloc-text hover:text-sherloc-yellow transition-colors font-semibold">Meus Roteiros</Link>
        <span className="text-gray-500">|</span>
        <Link to="/perfil" className="text-sherloc-text hover:text-sherloc-yellow transition-colors">{session.user.email}</Link>
        <span className="text-gray-500">|</span>
        <button onClick={() => supabase.auth.signOut()} className="text-sherloc-text hover:text-sherloc-yellow transition-colors">Logout</button>
      </div>
      
      {/* Painel de Filtros */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
        <Filter setFilter={setFilter} />
      </div>

      <MapComponent currentFilter={filter} />
    </div>
  )
}

export default App