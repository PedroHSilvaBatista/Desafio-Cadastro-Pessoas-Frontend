import axios from 'axios';

/**
 * Instância do Axios configurada com a URL base do back-end.
 * Centraliza a configuração para evitar repetição em cada chamada.
 */
const api = axios.create({
    baseURL: 'http://localhost:8080',
});

/**
 * Verifica se a API está online.
 * Utilizado no carregamento inicial da aplicação.
 */
export const healthCheck = async () => {
  const response = await api.get('/health-check');
  return response.data;
};

/**
 * Envia os dados do formulário para o back-end cadastrar a pessoa.
 * Retorna os dados cadastrados juntamente com o login gerado.
 */
export const cadastrarPessoa = async (dados) => {
    const response = await api.post('/api/v1/pessoas', dados);
    return response.data
}

/**
 * Consulta o endereço correspondente ao CEP informado via ViaCEP.
 * Utilizado para preenchimento automático dos campos de endereço.
 */
export const buscarEnderecoPorCep = async (cep) => {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    return response.data;
}

export default api;