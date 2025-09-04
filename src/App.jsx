import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom' // ADICIONADO A IMPORTAÇÃO DO LINK
import { supabase } from './supabaseClient'
import MapComponent from './components/Map'

// Pequeno componente para os botões de filtro
const Filter = ({ setFilter }) => {
  return (
    <div style={{ background: 'white', padding: '10px', borderRadius: '5px' }}>
      <span>Filtrar por: </span>
      <button onClick={() => setFilter('all')}>Todos</button>
      <button onClick={() => setFilter('restaurante')}>Restaurantes</button>
      <button onClick={() => setFilter('ponto_turistico')}>Pontos Turísticos</button>
      {/* Adicione mais botões para outras categorias que você tiver */}
    </div>
  )
}


function App() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  // NOVO ESTADO: para guardar o filtro selecionado
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

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

  if (!session) {
    return (
      // Container principal com fundo escuro, centralizado na tela
     <div className="bg-sherloc-dark min-h-screen flex flex-col items-center justify-center font-lexend text-sherloc-text">
        
        {/* Card do formulário */}
        <div className="bg-sherloc-dark-2 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="font-poppins text-3xl font-bold text-center mb-2">Bem-vindo ao Sherloc</h2>
          <p className="text-center text-gray-400 mb-6">Faça seu login ou cadastre-se para começar a explorar.</p>
          
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
              <input
                id="email"
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-sherloc-yellow focus:border-sherloc-yellow block w-full p-2.5"
                type="email"
                placeholder="Seu email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-sm font-medium">Senha</label>
              <input
                id="password"
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-sherloc-yellow focus:border-sherloc-yellow block w-full p-2.5"
                type="password"
                placeholder="Sua senha"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-4">
              <button 
                disabled={loading} 
                onClick={handleLogin}
                className="w-full text-black bg-sherloc-yellow hover:bg-yellow-400 font-bold rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
              >
                {loading ? 'Carregando...' : 'Login'}
              </button>
              <button 
                disabled={loading} 
                onClick={handleSignUp}
                className="w-full text-white bg-transparent border border-gray-600 hover:bg-gray-700 font-bold rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
              >
                {loading ? 'Carregando...' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Se o usuário ESTIVER logado, mostra o mapa e os filtros
  return (
    <div>
      {/* BLOCO MODIFICADO ABAIXO */}
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, background: 'white', padding: '10px', borderRadius: '5px' }}>
        <Link to="/roteiros">Meus Roteiros</Link>
        <span style={{ margin: '0 10px' }}>|</span>
        <Link to="/perfil">{session.user.email}</Link>
        <button style={{ marginLeft: '10px' }} onClick={() => supabase.auth.signOut()}>
          Logout
        </button>
      </div>
      {/* FIM DO BLOCO MODIFICADO */}

      {/* PAINEL DE FILTROS */}
      <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
        <Filter setFilter={setFilter} />
      </div>

      {/* Passamos o filtro atual para o componente do Mapa */}
      <MapComponent currentFilter={filter} />
    </div>
  )
}

export default App