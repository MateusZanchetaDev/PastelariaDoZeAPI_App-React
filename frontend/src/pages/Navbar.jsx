import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
    // useNavigate é um hook do React Router que permite programaticamente navegar entre rotas
    const navigate = useNavigate();
    // Verifica se o login foi realizado, se sim, exibe os botões de navegação
    const loginRealizado = localStorage.getItem('loginRealizado');
    // Evento para deslogar o usuário, remove o item 'loginRealizado' do localStorage e navega para a página de login
    const handleLogout = () => {
        localStorage.removeItem('loginRealizado');
        navigate('/login');
    };

    return (
        <AppBar className='Custom-AppBar'>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Comandas</Typography>
                {loginRealizado && (
                    <>
                        <Button color="inherit" onClick={() => navigate('/home')} >Home</Button>
                        <Button color="inherit" onClick={() => navigate('/funcionarios')}>Funcionários</Button>
                        <Button color="inherit" onClick={() => navigate('/clientes')}>Clientes</Button>
                        <Button color="inherit" onClick={() => navigate('/produtos')}>Produtos</Button>
                        <Button color="inherit" onClick={handleLogout}>Sair</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;