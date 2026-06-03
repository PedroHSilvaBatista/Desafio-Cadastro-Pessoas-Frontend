import { useEffect, useState } from 'react'
import CadastroPessoa from './components/CadastroPessoa/CadastroPessoa'
import { healthCheck } from './services/api'
import './App.css'

function App() {
  const [apiOnline, setApiOnline] = useState(null);

  useEffect(() => {
    healthCheck()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false))
  }, []);

  if (apiOnline === null) {
    return <p style={{ textAlign: 'center', marginTop: '40px' }}> Verificando conexão com a API...</p>
  }

  if (apiOnline === false) {
    return (
      <p style={{ textAlign: 'center', marginTop: '40px', color: '#dc2626' }}>
        Não foi possível conectar à API. Verifique se o back-end está rodando.
      </p>
    );
  }

  return <CadastroPessoa />;
}

export default App;
