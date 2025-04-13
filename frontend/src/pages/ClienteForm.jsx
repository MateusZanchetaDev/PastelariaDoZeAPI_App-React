import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    TextField,
    Button,
    Box,
    Typography,
    Toolbar
} from '@mui/material';
import '../styles/ClienteForm.css';

const ClienteForm = () => {
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    // Função para aplicar a máscara de CPF
    const aplicarMascaraCPF = (valor) => {
        return valor
            .replace(/\D/g, '')  // Remove tudo o que não for número
            .replace(/(\d{3})(\d)/, '$1.$2')  // Adiciona ponto
            .replace(/(\d{3})(\d)/, '$1.$2')  // Adiciona outro ponto
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o traço
    };

    // Função para aplicar a máscara de telefone
    const aplicarMascaraTelefone = (valor) => {
        return valor
            .replace(/\D/g, '')  // Remove tudo o que não for número
            .replace(/^(\d{2})(\d)/, '($1) $2')  // Adiciona o código de área
            .replace(/(\d{5})(\d{1,4})$/, '$1-$2');  // Adiciona o traço
    };

    // Função para manipular o CPF
    const handleCpfChange = (e) => {
        const valor = e.target.value;
        const valorComMascara = aplicarMascaraCPF(valor);
        setCpf(valorComMascara);
        setValue('cpf', valorComMascara);  // Atualiza o valor no react-hook-form
    };

    // Função para manipular o telefone
    const handleTelefoneChange = (e) => {
        const valor = e.target.value;
        const valorComMascara = aplicarMascaraTelefone(valor);
        setTelefone(valorComMascara);
        setValue('telefone', valorComMascara);  // Atualiza o valor no react-hook-form
    };

    const onSubmit = (data) => {
        console.log("Dados do cliente:", data);
    };

    return (
        <Box className="ClienteForm-Container" component="form" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mt: 2 }}>
            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary">Dados Cliente</Typography>
            </Toolbar>

            <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 3, mb: 2 }}>
                <TextField
                    label="Nome" fullWidth margin="normal"
                    {...register('nome', { required: 'Nome é obrigatório' })} error={!!errors.nome} helperText={errors.nome?.message}
                />
                <TextField
                    label="CPF" fullWidth margin="normal"
                    value={cpf} onChange={handleCpfChange}  // Usa a função de mudança de CPF
                    {...register('cpf', { required: 'CPF é obrigatório' })} error={!!errors.cpf} helperText={errors.cpf?.message}
                />
                <TextField
                    label="Telefone" fullWidth margin="normal" 
                    value={telefone} onChange={handleTelefoneChange}  // Usa a função de mudança de telefone
                    {...register('telefone', { required: 'Telefone é obrigatório' })} error={!!errors.telefone} helperText={errors.telefone?.message}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button sx={{ mr: 1 }} variant="outlined">Cancelar</Button>
                    <Button type="submit" variant="contained">Cadastrar</Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ClienteForm;