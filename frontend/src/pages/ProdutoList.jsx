import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Toolbar, Typography, IconButton, Button, useMediaQuery
} from '@mui/material';
import { Edit, Delete, Visibility, FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PictureAsPdf } from '@mui/icons-material';
import { getProdutos, deleteProduto } from '../services/produtoService';
import '../styles/ProdutoList.css';
import { Box } from '@mui/material';

function ProdutoList() {

    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        fetchProdutos();
    }, []);

    const fetchProdutos = async () => {
        try {
            const data = await getProdutos();

            // Se o retorno for [resultado, status], pegamos o primeiro
            const resultado = Array.isArray(data) && data.length === 2 ? data[0] : data;

            setProdutos(resultado);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            toast.error('Erro ao buscar produtos.');
        }
    };

    const handleDeleteClick = (produto) => {
        toast(
            <div>
                <Typography>Tem certeza que deseja excluir o produto <strong>{produto.nome}</strong>?</Typography>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained" color="error" size="small"
                        onClick={() => handleDeleteConfirm(produto.id_produto)} style={{ marginRight: '10px' }}
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
            await deleteProduto(id);
            fetchProdutos();
            toast.dismiss();
            toast.success('Produto excluído com sucesso!', { position: "top-center" });
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            toast.error('Erro ao excluir produto.', { position: "top-center" });
        }
    };

    const GeradorPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.setTextColor(30, 30, 30);
        doc.text("Lista de Produtos", 14, 22);

        const isSmallScreen = window.innerWidth < 600;
        const tableColumn = isSmallScreen
            ? ["ID", "Nome"]
            : ["ID", "Nome", "Descrição", "Valor Unitário", "Foto"];

        const tableRows = [];

        produtos.forEach(produto => {
            if (isSmallScreen) {
                tableRows.push([produto.id_produto, produto.nome]);
            } else {
                tableRows.push([
                    produto.id_produto,
                    produto.nome,
                    produto.descricao || "",
                    `R$ ${Number(produto.valor_unitario).toFixed(2)}`,
                    produto.foto ? produto.foto : null
                ]);
            }
        });

        let startY = 30;

        if (isSmallScreen) {
            doc.autoTable({
                startY,
                head: [tableColumn],
                body: tableRows,
                theme: 'grid',
                headStyles: {
                    fillColor: [173, 216, 230],
                    textColor: [0, 0, 0],
                    halign: 'center',
                    fontStyle: 'bold',
                },
                styles: {
                    fontSize: 10,
                    cellPadding: 10,
                    textColor: [30, 30, 30],
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245],
                },
            });
        } else {
            doc.autoTable({
                startY,
                head: [tableColumn],
                body: tableRows.map(row => row.slice(0, 4)),
                theme: 'grid',
                headStyles: {
                    fillColor: [173, 216, 230],
                    textColor: [0, 0, 0],
                    halign: 'center',
                    fontStyle: 'bold',
                },
                styles: {
                    fontSize: 12,
                    cellPadding: { top: 12, bottom: 12, left: 12, right: 6 },
                    textColor: [30, 30, 30],
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245],
                },
                didDrawCell: (data) => {
                    if (data.column.index === 4 && data.cell.section === 'body') {
                        const fotoBase64 = tableRows[data.row.index][4];
                        if (fotoBase64) {
                            const x = data.cell.x + 3;
                            const y = data.cell.y + 4;
                            const imgWidth = 22;
                            const imgHeight = 22;
                            doc.addImage(`data:image/jpeg;base64,${fotoBase64}`, 'JPEG', x, y, imgWidth, imgHeight);
                        } else {
                            doc.text('Sem imagem', data.cell.x + 2, data.cell.y + 12);
                        }
                    }
                }
            });
        }

        doc.save("produtos.pdf");
    };


    return (
        <TableContainer className="Produto-Table" component={Paper}>
            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mb: 2, display: 'flex', justifyContent: 'space-between' }} >
                <Typography variant="h6" color="primary">Produtos</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button color="primary" onClick={() => navigate('/produto')} startIcon={<FiberNew />}> Novo </Button>
                    <Button color="primary" onClick={GeradorPDF} startIcon={<PictureAsPdf />}> Exportar PDF </Button>
                </Box>
            </Toolbar>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nome</TableCell>
                        {!isSmallScreen && (
                            <>
                                <TableCell>Descrição</TableCell>
                                <TableCell>Valor Unitário</TableCell>
                                <TableCell>Foto</TableCell>
                            </>
                        )}
                        <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {produtos.map((produto) => (
                        <TableRow key={produto.id_produto}>
                            <TableCell>{produto.id_produto}</TableCell>
                            <TableCell>{produto.nome}</TableCell>
                            {!isSmallScreen && (
                                <>
                                    <TableCell>{produto.descricao}</TableCell>
                                    <TableCell>R$ {Number(produto.valor_unitario).toFixed(2)}</TableCell>
                                    <TableCell>
                                        {produto.foto ? (
                                            <img
                                                src={`data:image/jpeg;base64,${produto.foto}`}
                                                alt={produto.nome}
                                                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                                            />
                                        ) : 'Sem imagem'}
                                    </TableCell>
                                </>
                            )}
                            <TableCell>
                                <IconButton onClick={() => navigate(`/produto/view/${produto.id_produto}`)}>
                                    <Visibility color="primary" />
                                </IconButton>
                                <IconButton onClick={() => navigate(`/produto/edit/${produto.id_produto}`)}>
                                    <Edit color="secondary" />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteClick(produto)}>
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

export default ProdutoList;
