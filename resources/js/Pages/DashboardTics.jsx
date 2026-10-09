import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer 
} from 'recharts';

export default function DashboardTics({ kpis, porTipoProblema, cerradosPorTecnico, ticketsTabla, listaTecnicos }) {
    const [vista, setVista] = useState('dashboard'); // 'dashboard' o 'tabla'

    // Estados para los filtros de la tabla
    const [filtroNro, setFiltroNro] = useState('');
    const [filtroTecnico, setFiltroTecnico] = useState('');
    const [filtroFecha, setFiltroFecha] = useState('');

    // Estados para la paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const registrosPorPagina = 15;

    // Lógica de filtrado en tiempo real sobre la tabla completa
    const ticketsFiltrados = ticketsTabla.filter(ticket => {
        const matchNro = filtroNro === '' || String(ticket.Nro_Ticket).includes(filtroNro);
        const matchTecnico = filtroTecnico === '' || ticket.Tecnico === filtroTecnico;
        const matchFecha = filtroFecha === '' || ticket.fecha_filtro === filtroFecha;
        return matchNro && matchTecnico && matchFecha;
    });

    // Cálculo para cortar los registros de la página actual
    const indiceUltimoRegistro = paginaActual * registrosPorPagina;
    const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
    const ticketsPaginados = ticketsFiltrados.slice(indicePrimerRegistro, indiceUltimoRegistro);
    const totalPaginas = Math.ceil(ticketsFiltrados.length / registrosPorPagina);

    // Funciones para manejar filtros reseteando la página a 1
    const handleFiltroNro = (e) => {
        setFiltroNro(e.target.value);
        setPaginaActual(1);
    };

    const handleFiltroTecnico = (e) => {
        setFiltroTecnico(e.target.value);
        setPaginaActual(1);
    };

    const handleFiltroFecha = (e) => {
        setFiltroFecha(e.target.value);
        setPaginaActual(1);
    };

    const limpiarFiltros = () => {
        setFiltroNro('');
        setFiltroTecnico('');
        setFiltroFecha('');
        setPaginaActual(1);
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Head title="Panel de Informática" />

            {/* BARRA LATERAL CON EL LOGOTIPO */}
            <aside className="w-64 bg-[#002b49] text-white flex flex-col">
                <div className="p-6 flex items-center justify-center">
                    <img 
                        src="/LOGOHU.png" 
                        alt="Hospital Universitario" 
                        className="w-full h-auto object-contain max-h-16 filter brightness-0 invert" 
                    />
                </div>
                <nav className="mt-4 space-y-1">
                    <button 
                        onClick={() => setVista('dashboard')}
                        className={`w-full flex items-center px-6 py-3 text-left transition-colors ${vista === 'dashboard' ? 'bg-[#001f35] text-white border-l-4 border-blue-400 font-medium' : 'text-gray-300 hover:bg-[#001f35]/50'}`}
                    >
                        <span>GRÁFICOS</span>
                    </button>
                    <button 
                        onClick={() => setVista('tabla')}
                        className={`w-full flex items-center px-6 py-3 text-left transition-colors ${vista === 'tabla' ? 'bg-[#001f35] text-white border-l-4 border-blue-400 font-medium' : 'text-gray-300 hover:bg-[#001f35]/50'}`}
                    >
                        <span>TABLA TICKETS</span>
                    </button>
                </nav>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <main className="flex-1 flex flex-col overflow-hidden">
                
                <header className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {vista === 'dashboard' ? 'Gráficos' : 'Tabla de Tickets - Informática'}
                    </h1>
                    {vista === 'tabla' && (
                        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            Mostrando registros del {ticketsFiltrados.length > 0 ? indicePrimerRegistro + 1 : 0} al {Math.min(indiceUltimoRegistro, ticketsFiltrados.length)} de {ticketsFiltrados.length} filtrados (Total: {ticketsTabla.length})
                        </span>
                    )}
                </header>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    
                    {/* VISTA 1: DASHBOARD TÁCTICO */}
                    {vista === 'dashboard' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Total Histórico</p>
                                        <p className="text-3xl font-bold text-gray-800 mt-1">{kpis.total}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">📊</div>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Tickets Cerrados</p>
                                        <p className="text-3xl font-bold text-green-600 mt-1">{kpis.cerrados}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center font-bold text-xl">✅</div>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Tickets Pendientes</p>
                                        <p className="text-3xl font-bold text-yellow-600 mt-1">{kpis.pendientes}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center font-bold text-xl">⏳</div>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-8">
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Incidencias por Tipo de Problema</h2>
                                    <div style={{ height: 350, width: '100%' }}>
                                        <ResponsiveContainer>
                                            <BarChart data={porTipoProblema} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                                                <XAxis type="number" axisLine={false} tickLine={false} />
                                                <YAxis dataKey="tipo" type="category" width={150} axisLine={false} tickLine={false} />
                                                <Tooltip cursor={{fill: '#f3f4f6'}} />
                                                <Bar dataKey="cantidad" name="Cantidad" fill="#10b981" radius={[0, 4, 4, 0]} barSize={25} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Top 10: Carga de Trabajo (Resueltos por Técnico)</h2>
                                    <div style={{ height: 350, width: '100%' }}>
                                        <ResponsiveContainer>
                                            <BarChart data={cerradosPorTecnico} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                                                <XAxis type="number" axisLine={false} tickLine={false} />
                                                <YAxis dataKey="tecnico" type="category" width={150} axisLine={false} tickLine={false} />
                                                <Tooltip cursor={{fill: '#f3f4f6'}} />
                                                <Bar dataKey="cantidad" name="Tickets Cerrados" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={25} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VISTA 2: TABLA COMPLETA CON FILTROS Y PAGINACIÓN */}
                    {vista === 'tabla' && (
                        <div className="space-y-6">
                            
                            {/* BARRA DE FILTROS */}
                            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Nro de Ticket</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ej. 7112" 
                                        value={filtroNro}
                                        onChange={handleFiltroNro}
                                        className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Técnico</label>
                                    <select 
                                        value={filtroTecnico}
                                        onChange={handleFiltroTecnico}
                                        className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Todos los técnicos</option>
                                        {listaTecnicos.map((tec, idx) => (
                                            <option key={idx} value={tec}>{tec}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Fecha de Creación</label>
                                    <input 
                                        type="date" 
                                        value={filtroFecha}
                                        onChange={handleFiltroFecha}
                                        className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <button 
                                        onClick={limpiarFiltros}
                                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm py-2 px-4 rounded-md transition-colors border border-gray-300"
                                    >
                                        Limpiar Filtros
                                    </button>
                                </div>
                            </div>

                            {/* TABLA DE REGISTROS CON PAGINACIÓN */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nro</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asunto</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Técnico</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {ticketsPaginados.length > 0 ? (
                                                ticketsPaginados.map((ticket, index) => (
                                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">#{ticket.Nro_Ticket}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.Fecha_Creacion}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-xs" title={ticket.Asunto}>{ticket.Asunto}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.Tipo_Problema}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${ticket.Estado === 'Cerrado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                {ticket.Estado}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.Prioridad}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.Tecnico}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500">
                                                        No se encontraron tickets con los filtros seleccionados.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* CONTROLES DE PAGINACIÓN */}
                                {totalPaginas > 1 && (
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-4 px-2">
                                        <div className="text-sm text-gray-700">
                                            Página <span className="font-medium">{paginaActual}</span> de <span className="font-medium">{totalPaginas}</span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                                                disabled={paginaActual === 1}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                Anterior
                                            </button>
                                            <button
                                                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                                                disabled={paginaActual === totalPaginas}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                Siguiente
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}