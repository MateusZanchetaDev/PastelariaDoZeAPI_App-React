import axios from 'axios';

const PROXY_URL = import.meta.env.VITE_PROXY_BASE_URL + "funcionario/";

// --- NOVO ----------------------------------------------------------
export const loginLocal = async (username, password) => {
  const response = await axios.post(`${PROXY_URL}login_local`, {
    username,
    senha: password,        // a rota espera 'senha'
  });
  return response.data;
};

// (opcional) login pela API externa, se ainda não existir
export const loginFuncionario = async (cpf, password) => {
  const response = await axios.post(`${PROXY_URL}login`, {
    cpf,
    senha: password,
  });
  return response.data;
};

// Obter todos os funcionários
export const getFuncionarios = async () => {
  const response = await axios.get(`${PROXY_URL}all`);
  return response.data;
};

// Obter um funcionário por ID
export const getFuncionarioById = async (id) => {
  const response = await axios.get(`${PROXY_URL}one`, { params: { id_funcionario: id } });
  return response.data;
};

// Criar um novo funcionário
export const createFuncionario = async (funcionario) => {
  const response = await axios.post(`${PROXY_URL}`, funcionario);
  return response.data;
};

// Atualizar um funcionário existente
export const updateFuncionario = async (id, funcionario) => {
  const response = await axios.put(`${PROXY_URL}`, funcionario, { params: { id_funcionario: id } });
  return response.data;  // Retorna só dados
};

// Deletar um funcionário
export const deleteFuncionario = async (id) => {
  const response = await axios.delete(`${PROXY_URL}`, { params: { id_funcionario: id } });
  return response.data;
};

export const getFuncionarioByCPF = async (cpf) => {
  const response = await axios.get(`${PROXY_URL}cpf`, { params: { cpf } });
  return response.data[0]; // supondo que retorna um único funcionário
};