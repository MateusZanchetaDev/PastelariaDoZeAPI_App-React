import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Lazy Loading para otimização (code-splitting) - Os componentes das páginas foram carregados de forma assíncrona usando React.lazy.
const LoginForm = lazy(() => import("../pages/LoginForm"));
const Home = lazy(() => import("../pages/Home"));
const FuncionarioList = lazy(() => import("../pages/FuncionarioList"));
const FuncionarioForm = lazy(() => import("../pages/FuncionarioForm"));
const ClienteList = lazy(() => import("../pages/ClienteList"));
const ClienteForm = lazy(() => import("../pages/ClienteForm"));
const ProdutoList = lazy(() => import("../pages/ProdutoList"));
const ProdutoForm = lazy(() => import("../pages/ProdutoForm"));
const NotFound = lazy(() => import("../pages/NotFound"));

// Loader para o Suspense - Isso melhora a experiência do usuário em aplicações maiores.
// Sempre que uma rota for acessada, o Suspense exibirá o fallback (Carregando...) até que o componente da rota seja carregado.
const Loading = () => <div>Carregando...</div>;

const AppRoutes = () => {
    return (
        // O componente Suspense foi adicionado ao redor do Routes para exibir um fallback (<Loading />) enquanto os componentes são carregados.
        // O fallback é exibido enquanto os componentes carregados com React.lazy estão sendo baixados.
        
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/home" element={<Home />} />
                <Route path="/funcionarios" element={<FuncionarioList />} />
                <Route path="/funcionario" element={<FuncionarioForm />} />
                <Route path="/clientes" element={<ClienteList />} />
                <Route path="/cliente" element={<ClienteForm />} />
                <Route path="/produtos" element={<ProdutoList />} />
                <Route path="/produto" element={<ProdutoForm />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};
export default AppRoutes;