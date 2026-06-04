import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { cadastrarPessoa, buscarEnderecoPorCep } from '../../services/api';
import './CadastroPessoa.css';

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

  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const endereco = await buscarEnderecoPorCep(cep);
        if (!endereco.erro) {
          setValue('logradouro', endereco.logradouro);
          setValue('bairro', endereco.bairro);
          setValue('cidade', endereco.localidade);
          setValue('estado', endereco.uf);
        }
      } catch {
        console.error('Erro ao buscar CEP');
      }
    }
  };

  const onSubmit = async (dados) => {
    setLoading(true);
    setErroBackend(null);
    setPessoaCadastrada(null);

    try {
      const response = await cadastrarPessoa(dados);
      setPessoaCadastrada(response);
    } catch (erro) {
      setErroBackend(erro.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <h1>Cadastro de Pessoa</h1>

      <form onSubmit={handleSubmit(onSubmit)}>

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
          />
          {errors.bairro && <span className="erro">{errors.bairro.message}</span>}
        </div>

        {/* Cidade */}
        <div className="campo">
          <label>Cidade</label>
          <input
            {...register('cidade', { required: 'O campo cidade é obrigatório' })}
            placeholder="Preenchido automaticamente"
          />
          {errors.cidade && <span className="erro">{errors.cidade.message}</span>}
        </div>

        {/* Estado */}
        <div className="campo">
          <label>Estado</label>
          <input
            {...register('estado', { required: 'O campo estado é obrigatório' })}
            placeholder="Preenchido automaticamente"
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