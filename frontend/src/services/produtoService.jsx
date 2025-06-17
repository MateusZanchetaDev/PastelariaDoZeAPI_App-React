import axios from 'axios';

const PROXY_URL = import.meta.env.VITE_PROXY_BASE_URL + "produto/";

// Obter todos os produtos
export const getProdutos = async () => {
  const response = await axios.get(`${PROXY_URL}all`);
  return response.data;
};

// Obter um produto por ID
export const getProdutoById = async (id) => {
  const response = await axios.get(`${PROXY_URL}one`, { params: { id_produto: id } });
  return response.data[0];
};

// Criar um novo produto
// Criar um novo produto
export const createProduto = async (produto) => {
  try {
    const response = await axios.post(PROXY_URL, produto);
    return response.data;
  } catch (error) {
    // Propaga o erro para o catch do onSubmit
    throw error.response?.data || error;
  }
};

// Atualizar um produto existente
export const updateProduto = async (id, produto) => {
  try {
    const produtoComId = { ...produto, id_produto: id };
    const response = await axios.put(`${PROXY_URL}`, produtoComId);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Deletar um produto
export const deleteProduto = async (id) => {
  const response = await axios.delete(`${PROXY_URL}`, { params: { id_produto: id } });
  return response.data;
};

export const getProdutoByCodigo = async (codigo) => {
  const response = await axios.get(`${PROXY_URL}codigo`, { params: { codigo } });
  return response.data[0]; // Supondo que o retorno é um único produto
};