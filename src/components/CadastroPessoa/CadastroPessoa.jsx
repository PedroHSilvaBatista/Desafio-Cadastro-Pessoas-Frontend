import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { cadastrarPessoa, buscarEnderecoPorCep } from '../../services/api';
import './CadastroPessoa.css';

/**
 * Componente principal de cadastro de pessoas.
 * Responsável por:
 * - Renderizar o formulário de cadastro
 * - Validar os campos no cliente
 * - Buscar endereço automaticamente via ViaCEP
 * - Enviar os dados para o back-end
 * - Exibir o resultado do cadastro ou erros ao usuário
*/
function CadastroPessoa() {
  // Controla se está carregando (enviando o formulário)
  const [loading, setLoading] = useState(false);
  // Armazena o resultado do cadastro (sucesso)
  const [pessoaCadastrada, setPessoaCadastrada] = useState(null);
  // Armazena erros vindos do back-end
  const [erroBackend, setErroBackend] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  /**
  * Busca o endereço automaticamente no ViaCEP quando o usuário
  * sai do campo CEP. Remove caracteres não numéricos antes de consultar.
  */
  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const endereco = await buscarEnderecoPorCep(cep);
        if (!endereco.erro) {
          setValue('logradouro', endereco.logradouro, { shouldValidate: true });
          setValue('bairro', endereco.bairro, { shouldValidate: true });
          setValue('cidade', endereco.localidade, { shouldValidate: true });
          setValue('estado', endereco.uf, { shouldValidate: true });
        }
      } catch {
        console.error('Erro ao buscar CEP');
      }
    }
  };

  /**
  * Responsável por tratar e enviar os dados do formulário para o back-end.
  * Antes do envio:
  * - Normaliza o nome removendo acentos, cedilhas e espaços excedentes
  * - Valida se a data de nascimento não é futura
  */
  const onSubmit = async (dados) => {
    setLoading(true);
    setErroBackend(null);
    setPessoaCadastrada(null);

    // Remove acentos, cedilha e espaços excedentes do nome
    const nomeNormalizado = dados.nomeCompleto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'C')
    .trim()
    .replace(/\s+/g, ' ');

    // Impede cadastro com data de nascimento futura
    const hoje = new Date().toISOString().split('T')[0];
    if (dados.dataNascimento > hoje) {
      setErroBackend({ title: 'Data inválida', detail: 'A data de nascimento não pode ser futura' });
      setLoading(false);
      return;
    }

    const dadosFormatados = { ...dados, nomeCompleto: nomeNormalizado};
    
    try {
      const response = await cadastrarPessoa(dadosFormatados);
      setPessoaCadastrada(response);
    } catch (erro) {
      // Captura e exibe erros retornados pelo back-end
      setErroBackend(erro.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <h1>Cadastro de Pessoa</h1>

      <form onSubmit={handleSubmit(onSubmit, () => {
        setPessoaCadastrada(null);
        setErroBackend(null);
      })}>

        {/* Nome Completo */}
        <div className="campo">
          <label>Nome Completo</label>
          <input
            {...register('nomeCompleto', { required: 'O campo nome é obrigatório' })}
            placeholder="Maria Silva Souza"
          />
          {errors.nomeCompleto && <span className="erro">{errors.nomeCompleto.message}</span>}
        </div>

        {/* CPF */}
        <div className="campo">
          <label>CPF</label>
          <Controller
            name="documentoCpf"
            control={control}
            rules={{ required: 'O campo CPF é obrigatório' }}
            render={({ field }) => (
              <input
                {...field}
                placeholder="123.456.789-09"
                maxLength={14}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '')
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                  field.onChange(v);
                }}
              />
            )}
          />
          {errors.documentoCpf && <span className="erro">{errors.documentoCpf.message}</span>}
        </div>

        {/* Email */}
        <div className="campo">
          <label>E-mail</label>
          <input
            {...register('email', {
              required: 'O campo e-mail é obrigatório',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' },
            })}
            placeholder="maria@email.com"
          />
          {errors.email && <span className="erro">{errors.email.message}</span>}
        </div>

        {/* Data de Nascimento */}
        <div className="campo">
          <label>Data de Nascimento</label>
          <input
            type="date"
            {...register('dataNascimento', { required: 'O campo data de nascimento é obrigatório' })}
          />
          {errors.dataNascimento && <span className="erro">{errors.dataNascimento.message}</span>}
        </div>

        {/* CEP */}
        <div className="campo">
          <label>CEP</label>
          <Controller
            name="cep"
            control={control}
            rules={{ required: 'O campo CEP é obrigatório' }}
            render={({ field }) => (
              <input
                {...field}
                placeholder="01001-000"
                maxLength={9}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '')
                    .replace(/(\d{5})(\d)/, '$1-$2');
                  field.onChange(v);
                }}
                onBlur={handleCepBlur}
              />
            )}
          />
          {errors.cep && <span className="erro">{errors.cep.message}</span>}
        </div>

        {/* Logradouro */}
        <div className="campo">
          <label>Logradouro</label>
          <input
            {...register('logradouro', { required: 'O campo logradouro é obrigatório' })}
            placeholder="Preenchido automaticamente"
            readOnly
          />
          {errors.logradouro && <span className="erro">{errors.logradouro.message}</span>}
        </div>

        {/* Complemento */}
        <div className="campo">
          <label>Complemento</label>
          <input {...register('complemento')} placeholder="Apto 42, Bloco B..." />
        </div>

        {/* Bairro */}
        <div className="campo">
          <label>Bairro</label>
          <input
            {...register('bairro', { required: 'O campo bairro é obrigatório' })}
            placeholder="Preenchido automaticamente"
            readOnly
          />
          {errors.bairro && <span className="erro">{errors.bairro.message}</span>}
        </div>

        {/* Cidade */}
        <div className="campo">
          <label>Cidade</label>
          <input
            {...register('cidade', { required: 'O campo cidade é obrigatório' })}
            placeholder="Preenchido automaticamente"
            readOnly
          />
          {errors.cidade && <span className="erro">{errors.cidade.message}</span>}
        </div>

        {/* Estado */}
        <div className="campo">
          <label>Estado</label>
          <input
            {...register('estado', { required: 'O campo estado é obrigatório' })}
            placeholder="Preenchido automaticamente"
            readOnly
          />
          {errors.estado && <span className="erro">{errors.estado.message}</span>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>

      </form>

      {/* Exibe erro do back-end */}
      {erroBackend && (
        <div className="erro-backend">
          <p><strong>{erroBackend.title}</strong></p>
          <p>{erroBackend.detail}</p>
          {erroBackend.Details && erroBackend.Details.length > 0 && (
            <ul style={{ marginTop: '8px', paddingLeft: '16px' }}>
              {erroBackend.Details.map((item, index) => (
                <li key={index} style={{ fontSize: '13px', marginTop: '4px' }}>
                  <strong>{item.campo}:</strong> {item.mensagem}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Exibe resultado do cadastro */}
      {pessoaCadastrada && (
        <div className="sucesso">
          <h2>Cadastro realizado com sucesso!</h2>
          <p><strong>Login gerado:</strong> {pessoaCadastrada.login}</p>
          <p><strong>Nome:</strong> {pessoaCadastrada.nomeCompleto}</p>
          <p><strong>E-mail:</strong> {pessoaCadastrada.email}</p>
        </div>
      )}
    </div>
  );
}

export default CadastroPessoa;