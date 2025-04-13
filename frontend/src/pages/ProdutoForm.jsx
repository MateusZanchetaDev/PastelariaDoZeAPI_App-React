import { useForm } from 'react-hook-form';
import {
    TextField,
    Button,
    Box,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Toolbar
} from '@mui/material';
import '../styles/ProdutoForm.css'

const ProdutoForm = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log("Dados do produto:", data);
    };

    return (

        <Box className="ProdutoForm-Container" component="form" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mt: 2 }}>

            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary">Dados Produto</Typography>
            </Toolbar>

            <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 3, mb: 2 }}>

                <TextField
                    label="Nome" fullWidth margin="normal"
                    {...register('nome', { required: 'Nome é obrigatório' })} error={!!errors.nome} helperText={errors.nome?.message}
                />
                <TextField
                    label="Descrição" fullWidth margin="normal"
                    {...register('descricao', { required: 'Descrição é obrigatório' })} error={!!errors.descricao} helperText={errors.descricao?.message}
                />
                <TextField
                    label="Valor Unitário" fullWidth margin="normal" {...register('valor_unitario', { required: 'Valor Unitário é obrigatório' })} error={!!errors.valor_unitario} helperText={errors.valor_unitario?.message}
                />

                <input type="file" accept="image/*" {...register('foto')} />
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button sx={{ mr: 1 }}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained">
                        Cadastrar
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};
export default ProdutoForm;