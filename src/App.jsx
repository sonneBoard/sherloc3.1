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
    // ... (o código do formulário de login continua o mesmo)
    return (
      <div style={{ padding: '50px' }}>
        <h2>Bem-vindo ao Sherloc</h2>
        <p>Faça seu login ou cadastre-se</p>
        <form>
          <input
            type="email"
            placeholder="Seu email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <button disabled={loading} onClick={handleLogin}>
              {loading ? 'Carregando...' : 'Login'}
            </button>
            <button disabled={loading} onClick={handleSignUp}>
              {loading ? 'Carregando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
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
        <span>{session.user.email}</span>
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