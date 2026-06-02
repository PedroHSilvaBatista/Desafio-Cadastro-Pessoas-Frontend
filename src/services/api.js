import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
});

export const cadastrarPessoa = async (dados) => {
    const response = await api.post('/api/v1/pessoas', dados);
    return response.data
}

export const healthCheck = async () => {
  const response = await api.get('/health-check');
  return response.data;
};

export const buscarEnderecoPorCep = async (cep) => {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    return response.data;
}

export default api;