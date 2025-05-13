import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, Toolbar } from '@mui/material';
import IMaskInputWrapper from '../components/IMaskInputWrapper';
import { createProduto, updateProduto, getProdutoById } from '../services/produtoService';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import '../styles/ProdutoForm.css';

const ProdutoForm = () => {
    const { id, opr } = useParams();
    const navigate = useNavigate();
    const { control, handleSubmit, reset, formState: { errors } } = useForm();
    const isReadOnly = opr === 'view';

    const [imagemBase64, setImagemBase64] = useState(null);

    let title;
    if (opr === 'view') {
        title = `Visualizar Produto: ${id}`;
    } else if (id) {
        title = `Editar Produto: ${id}`;
    } else {
        title = "Novo Produto";
    }

    useEffect(() => {
        if (id) {
            const fetchProduto = async () => {
                const data = await getProdutoById(id);
                reset(data);
                if (data.foto) {
                    setImagemBase64({
                        data: data.foto,
                        type: 'image/jpeg' // ou image/png, se seu backend armazenar diferente
                    });
                }
            };
            fetchProduto();
        }
    }, [id, reset]);

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result.split(',')[1];
                const mimeType = file.type;
                setImagemBase64({ data: base64, type: mimeType });
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const onSubmit = async (data) => {
        try {
            const produtoData = {
                nome: data.nome,
                descricao: data.descricao,
                valor_unitario: data.valor_unitario,
                foto: imagemBase64?.data || "", // usa a base64 se tiver
            };

            if (data.foto && data.foto[0]) {
                const fotoBase64 = await convertToBase64(data.foto[0]);
                produtoData.foto = fotoBase64;
            }

            let retorno;
            if (id) {
                retorno = await updateProduto(id, produtoData);
            } else {
                retorno = await createProduto(produtoData);
            }

            if (!retorno || !retorno.id) {
                throw new Error(retorno.erro || "Erro ao salvar produto.");
            }

            toast.success(`Produto salvo com sucesso. ID: ${retorno.id}`, { position: "top-center" });
            navigate('/produtos');
        } catch (error) {
            console.error("Erro no envio: ", error.response ? error.response.data : error.message);
            toast.error(`Erro ao salvar produto: \n${error.message}`, { position: "top-center" });
        }
    };

    return (
        <Box
            className="ProdutoForm-Container"
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mt: 2 }}
        >
            <Toolbar
                sx={{
                    backgroundColor: '#ADD8E6',
                    padding: 1,
                    borderRadius: 2,
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <Typography variant="h6" color="primary">{title}</Typography>
            </Toolbar>

            <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 3, mb: 2 }}>
                {opr === 'view' && (
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Todos os campos estão em modo somente leitura.
                    </Typography>
                )}

                {/* Nome */}
                <Controller
                    name="nome"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: "Nome é obrigatório",
                        maxLength: { value: 100, message: "Máximo de 100 caracteres" }
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            disabled={isReadOnly}
                            label="Nome"
                            fullWidth
                            margin="normal"
                            error={!!errors.nome}
                            helperText={errors.nome?.message}
                            inputProps={{ maxLength: 100 }}
                        />
                    )}
                />

                {/* Descrição */}
                <Controller
                    name="descricao"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: "Descrição é obrigatória",
                        maxLength: { value: 200, message: "Máximo de 200 caracteres" }
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            disabled={isReadOnly}
                            label="Descrição"
                            fullWidth
                            margin="normal"
                            error={!!errors.descricao}
                            helperText={errors.descricao?.message}
                            inputProps={{ maxLength: 200 }}
                        />
                    )}
                />

                {/* Valor Unitário com máscara */}
                <Controller
                    name="valor_unitario"
                    control={control}
                    defaultValue="0,00"
                    rules={{ required: "Valor unitário é obrigatório" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            value={field.value?.toString() || "0,00"}
                            disabled={isReadOnly}
                            label="Valor Unitário"
                            fullWidth
                            margin="normal"
                            error={!!errors.valor_unitario}
                            helperText={errors.valor_unitario?.message}
                            InputProps={{
                                inputComponent: IMaskInputWrapper,
                                inputProps: {
                                    mask: 'R$ num',
                                    blocks: {
                                        num: {
                                            mask: Number,
                                            scale: 2,
                                            thousandsSeparator: '.',
                                            radix: ',',
                                            padFractionalZeros: true,
                                            normalizeZeros: true,
                                        },
                                    },
                                    lazy: false,
                                    unmask: true,
                                },
                            }}
                        />
                    )}
                />

                {/* Imagem do produto */}
                <Controller
                    name="foto"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body1" sx={{ mb: 1 }}>Imagem do Produto</Typography>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        convertToBase64(file);
                                        field.onChange(file);
                                    }
                                }}
                                disabled={isReadOnly}
                            />
                            {errors.foto && (
                                <Typography variant="caption" color="error">
                                    {errors.foto.message}
                                </Typography>
                            )}

                            {/* Pré-visualização da imagem */}
                            {imagemBase64?.data && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2">Pré-visualização:</Typography>
                                    <img
                                        src={`data:${imagemBase64.type};base64,${imagemBase64.data}`}
                                        alt="Imagem do Produto"
                                        style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, marginTop: 8 }}
                                    />
                                </Box>
                            )}
                        </Box>
                    )}
                />

                {/* Botões */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Button onClick={() => navigate('/produtos')} sx={{ mr: 1 }}>Cancelar</Button>
                    {opr !== 'view' && (
                        <Button type="submit" variant="contained" color="primary">{id ? "Atualizar" : "Cadastrar"}</Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default ProdutoForm;
