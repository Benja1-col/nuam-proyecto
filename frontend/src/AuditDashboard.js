import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Container, Typography, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, TextField, MenuItem, Chip, Alert, 
    CircularProgress, TablePagination, TableSortLabel, Box 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';

const API_URL_LOGS = 'http://127.0.0.1:5000/api/auditoria';

const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleString('es-CL');
};

function AuditDashboard() {
    const [logs, setLogs] = useState([]); // Datos completos
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estados para Paginación y Ordenamiento (CLIENTE)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('fecha_hora');

    // Filtros
    const [filterPais, setFilterPais] = useState('ALL');
    const [filterAccion, setFilterAccion] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const response = await axios.get(API_URL_LOGS);
                // Validación robusta: Si es array úsalo, si no, array vacío
                setLogs(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error(err);
                setError("Error al cargar datos. Verifique que Flask esté corriendo.");
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    // --- Lógica de Filtrado, Ordenamiento y Paginación en React ---
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // 1. Filtrar
    const filteredLogs = logs.filter((log) => {
        const matchesPais = filterPais === 'ALL' || log.pais === filterPais;
        const matchesAccion = filterAccion === '' || log.accion.includes(filterAccion);
        const matchesSearch = searchTerm === '' || 
            log.usuario.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesPais && matchesAccion && matchesSearch;
    });

    // 2. Ordenar
    const sortedLogs = filteredLogs.sort((a, b) => {
        if (b[orderBy] < a[orderBy]) return order === 'asc' ? -1 : 1;
        if (b[orderBy] > a[orderBy]) return order === 'asc' ? 1 : -1;
        return 0;
    });

    // 3. Paginar
    const visibleLogs = sortedLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Container component="main" maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#FF6600' }}>
                Dashboard de Auditoría
            </Typography>

            {/* Filtros */}
            <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2 }}>
                <TextField select label="País" value={filterPais} onChange={(e) => setFilterPais(e.target.value)} sx={{ width: 150 }}>
                    {['ALL', 'CL', 'AR', 'PE', 'CO', 'MX'].map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                </TextField>
                <TextField select label="Acción" value={filterAccion} onChange={(e) => setFilterAccion(e.target.value)} sx={{ width: 150 }}>
                    <MenuItem value="">TODAS</MenuItem>
                    <MenuItem value="LOGIN">Login</MenuItem>
                    <MenuItem value="CARGA">Carga</MenuItem>
                </TextField>
                <TextField label="Buscar Usuario" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} fullWidth InputProps={{ endAdornment: <SearchIcon /> }} />
            </Paper>

            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel active={orderBy === 'fecha_hora'} direction={orderBy === 'fecha_hora' ? order : 'asc'} onClick={() => handleRequestSort('fecha_hora')}>
                                        Fecha/Hora
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel active={orderBy === 'usuario'} direction={orderBy === 'usuario' ? order : 'asc'} onClick={() => handleRequestSort('usuario')}>
                                        Usuario
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>País</TableCell>
                                <TableCell>Acción</TableCell>
                                <TableCell>Detalle</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleLogs.map((log) => (
                                <TableRow key={log.id} hover>
                                    <TableCell>{formatTimestamp(log.fecha_hora)}</TableCell>
                                    <TableCell>{log.usuario}</TableCell>
                                    <TableCell>{log.pais}</TableCell>
                                    <TableCell><Chip label={log.accion} size="small" /></TableCell>
                                    <TableCell><pre style={{ fontSize: '0.7em' }}>{log.detalle_json}</pre></TableCell>
                                </TableRow>
                            ))}
                            {visibleLogs.length === 0 && <TableRow><TableCell colSpan={5} align="center">Sin datos</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredLogs.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            )}
        </Container>
    );
}

export default AuditDashboard;