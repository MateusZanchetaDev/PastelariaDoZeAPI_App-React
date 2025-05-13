import axios from 'axios';

const PROXY_URL = import.meta.env.VITE_PROXY_BASE_URL + "cliente/";

// Obter todos os clientes
export const getClientes = async () => {
  const response = await axios.get(`${PROXY_URL}all`);
  return response.data;
};

// Obter um cliente por ID
export const getClienteById = async (id) => {
  const response = await axios.get(`${PROXY_URL}one`, { params: { id_cliente: id } });
  return response.data[0];
};

// Criar um novo cliente
export const createCliente = async (cliente) => {
  const response = await axios.post(`${PROXY_URL}`, cliente);
  return response.data;
};

// Atualizar um cliente existente
export const updateCliente = async (id, cliente) => {
  const response = await axios.put(`${PROXY_URL}`, cliente, { params: { id_cliente: id } });
  return response.data;
};

// Deletar um cliente
export const deleteCliente = async (id) => {
  const response = await axios.delete(`${PROXY_URL}`, { params: { id_cliente: id } });
  return response.data;
};

export const getClienteByCPF = async (cpf) => {
  const response = await axios.get(`${PROXY_URL}cpf`, { params: { cpf } });
  return response.data[0]; // Supondo que retorna um único cliente
};