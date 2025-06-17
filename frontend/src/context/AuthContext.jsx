import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginLocal, loginFuncionario } from "../services/funcionarioService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    sessionStorage.getItem("loginRealizado") === "true"
  );
  const navigate = useNavigate();

  const grupoMap = {
    "1": "Administrador",
    "2": "Atendente de Balcão",
    "3": "Atendente de Caixão"
  };

  const login = async (username, password) => {
    try {
      let data;

      if (username.startsWith("@")) {
        data = await loginLocal(username, password);
        console.log("Resposta login local:", data);

        // Como login local talvez não traga nome, usamos padrão:
        sessionStorage.setItem("nome", "Usuário Local");
        // Traduz grupo numérico para texto, ou "Grupo desconhecido"
        const grupoNome = grupoMap[data.grupo] || "Administrador";
        sessionStorage.setItem("grupo", grupoNome);

        toast.success(`Login local realizado com sucesso!`);

      } else {
        data = await loginFuncionario(username, password);
        console.log("Resposta login externo:", data);

        sessionStorage.setItem("nome", data.nome || "Usuário");
        const grupoNome = grupoMap[data.grupo] || "Grupo desconhecido";
        sessionStorage.setItem("grupo", grupoNome);
        console.log(data.nome, data.grupo);
        toast.success(`Login API realizado com sucesso!`);
      }

      setIsAuthenticated(true);
      sessionStorage.setItem("loginRealizado", "true");
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.error || "Usuário ou senha inválidos!");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("loginRealizado");
    toast.info("Logout realizado com sucesso!");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);