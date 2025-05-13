import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Toolbar, Typography, IconButton, Button, useMediaQuery, } from '@mui/material';
import { Edit, Delete, Visibility, FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getClientes, deleteCliente } from '../services/clienteService';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import '../styles/ClienteList.css';

function ClienteList() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            const data = await getClientes();
            setClientes(data);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
        }
    };

    const handleDeleteClick = (cliente) => {
        toast(
            <div>
                <Typography>Tem certeza que deseja excluir o cliente <strong>{cliente.nome}</strong>?</Typography>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained" color="error" size="small"
                        onClick={() => handleDeleteConfirm(cliente.id_cliente)} style={{ marginRight: '10px' }}
                    >Excluir</Button>
                    <Button variant="outlined" size="small" onClick={() => toast.dismiss()}>Cancelar</Button>
                </div>
            </div>,
            {
                position: "top-center", autoClose: false, closeOnClick: false, draggable: false, closeButton: false,
            }
        );
    };

    const handleDeleteConfirm = async (id) => {
        try {
            await deleteCliente(id);
            fetchClientes();
            toast.dismiss();
            toast.success('Cliente excluído com sucesso!', { position: "top-center" });
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            toast.error('Erro ao excluir cliente.', { position: "top-center" });
        }
    };

    const formatCPF = (cpf) => {
        if (!cpf || cpf.length !== 11) return cpf;
        return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    };

    const formatTelefone = (telefone) => {
        if (!telefone || telefone.length !== 11) return telefone;
        return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    };

    return (
        <TableContainer className="Cliente-Table" component={Paper}>
            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary">Clientes</Typography>
                <Button color="primary" onClick={() => navigate('/cliente')} startIcon={<FiberNew />}>Novo</Button>
            </Toolbar>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>CPF</TableCell>
                        {!isSmallScreen && <TableCell>Telefone</TableCell>}
                        <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {clientes.map((cliente) => (
                        <TableRow key={cliente.id_cliente}>
                            <TableCell>{cliente.id_cliente}</TableCell>
                            <TableCell>{cliente.nome}</TableCell>
                            <TableCell>{formatCPF(cliente.cpf)}</TableCell>
                            {!isSmallScreen && (
                                <TableCell>{formatTelefone(cliente.telefone)}</TableCell>
                            )}
                            <TableCell>
                                <IconButton onClick={() => navigate(`/cliente/view/${cliente.id_cliente}`)}>
                                    <Visibility color="primary" />
                                </IconButton>
                                <IconButton onClick={() => navigate(`/cliente/edit/${cliente.id_cliente}`)}>
                                    <Edit color="secondary" />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteClick(cliente)}>
                                    <Delete color="error" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ClienteList;