import { useEffect, useState } from 'react'
import CadastroPessoa from './components/CadastroPessoa/CadastroPessoa'
import { healthCheck } from './services/api'
import './App.css'

/**
 * Componente raiz da aplicação.
 * Verifica a disponibilidade da API ao carregar e
 * renderiza o formulário de cadastro somente se o back-end estiver online.
 */
function App() {
  // null = verificando, true = online, false = offline
  const [apiOnline, setApiOnline] = useState(null);

  /**
   * Executa o health check uma única vez ao carregar a aplicação.
   * Define o estado da API conforme o resultado da chamada.
  */
  useEffect(() => {
    healthCheck()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false))
  }, []);

  if (apiOnline === null) {
    return (
      <div className="api-status-container">
        <p className="api-status-mensagem">Verificando conexão com a API...</p>
      </div>
    );
  }

  if (apiOnline === false) {
    return (
      <div className="api-status-container">
        <p className="api-status-mensagem">Não foi possível conectar à API.</p>
      </div>
    );
  }

  return <CadastroPessoa />;
}

export default App;
