<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

Route::get('/', function (Request $request) {
    $anioSeleccionado = $request->input('anio');

    // Base query para los tickets del departamento 24
    $queryTickets = DB::table('ticket')->where('departamento_id', 24);
    
    if (!empty($anioSeleccionado)) {
        $queryTickets->whereYear('created_at', $anioSeleccionado);
    }

    // --- KPIs DINÁMICOS CON TODOS LOS ESTADOS ---
    $totalTickets = (clone $queryTickets)->count();

    // Obtenemos todos los estados posibles en la base de datos
    $todosLosEstados = DB::table('estado')->orderBy('id', 'asc')->get();
    
    $porEstado = [];
    foreach ($todosLosEstados as $est) {
        $porEstado[] = [
            'estado' => $est->nombre,
            'cantidad' => (clone $queryTickets)->where('estado_id', $est->id)->count()
        ];
    }

    $kpis = [
        'total' => $totalTickets,
        'por_estado' => $porEstado
    ];

    // 1. Tickets por tipo de problema
    $porTipoProblema = DB::table('ticket as t')
        ->leftJoin('tipo_problemas as tp', 't.tipo_problema_id', '=', 'tp.id')
        ->where('t.departamento_id', 24)
        ->when($anioSeleccionado, fn($q) => $q->whereYear('t.created_at', $anioSeleccionado))
        ->select(DB::raw('IFNULL(tp.nombre, "Sin clasificar") as tipo'), DB::raw('COUNT(t.id) as cantidad'))
        ->groupBy('tipo')
        ->orderBy('cantidad', 'desc')
        ->get();

    // 2. Carga de Trabajo (Resueltos por Técnico) - Trae TODOS
    $cerradosPorTecnico = DB::table('ticket as t')
        ->leftJoin('estado as e', 't.estado_id', '=', 'e.id')
        ->leftJoin('users as u', 't.cerrado_por', '=', 'u.id')
        ->where('t.departamento_id', 24)
        ->when($anioSeleccionado, fn($q) => $q->whereYear('t.created_at', $anioSeleccionado))
        ->where('e.nombre', 'Cerrado')
        ->whereNotNull('t.cerrado_por')
        ->select(DB::raw('IFNULL(u.name_and_surname, "Usuario Desconocido") as tecnico'), DB::raw('COUNT(t.id) as cantidad'))
        ->groupBy('tecnico')
        ->orderByDesc('cantidad')
        ->get();

    // 3. Tabla completa
    $ticketsTabla = DB::table('ticket as t')
        ->leftJoin('estado as e', 't.estado_id', '=', 'e.id')
        ->leftJoin('prioridad as p', 't.prioridad_id', '=', 'p.id')
        ->leftJoin('tipo_problemas as tp', 't.tipo_problema_id', '=', 'tp.id')
        ->leftJoin('users as u', 't.cerrado_por', '=', 'u.id')
        ->where('t.departamento_id', 24)
        ->select(
            't.id as Nro_Ticket',
            't.asunto as Asunto',
            'e.nombre as Estado',
            'p.nombre as Prioridad',
            DB::raw('IFNULL(tp.nombre, "Sin clasificar") as Tipo_Problema'),
            DB::raw('IFNULL(u.name_and_surname, "Sin asignar") as Tecnico'),
            DB::raw('DATE(t.created_at) as fecha_filtro'),
            DB::raw('YEAR(t.created_at) as anio'),
            DB::raw('DATE_FORMAT(t.created_at, "%d/%m/%Y") as Fecha_Creacion')
        )
        ->orderBy('t.id', 'desc')
        ->get();

    // 4. Listas únicas para filtros
    $listaTecnicos = DB::table('ticket as t')
        ->leftJoin('users as u', 't.cerrado_por', '=', 'u.id')
        ->where('t.departamento_id', 24)
        ->whereNotNull('t.cerrado_por')
        ->select('u.name_and_surname as tecnico')
        ->distinct()
        ->orderBy('tecnico', 'asc')
        ->pluck('tecnico');

    $listaAnios = DB::table('ticket')
        ->where('departamento_id', 24)
        ->whereNotNull('created_at')
        ->select(DB::raw('YEAR(created_at) as anio'))
        ->distinct()
        ->orderBy('anio', 'desc')
        ->pluck('anio');

    // Lista única de los estados
    $listaEstados = DB::table('estado')->orderBy('nombre', 'asc')->pluck('nombre');

    return Inertia::render('DashboardTics', [
        'kpis' => $kpis,
        'porTipoProblema' => $porTipoProblema,
        'cerradosPorTecnico' => $cerradosPorTecnico,
        'ticketsTabla' => $ticketsTabla,
        'listaTecnicos' => $listaTecnicos,
        'listaAnios' => $listaAnios,
        'listaEstados' => $listaEstados,
        'anioSeleccionado' => $anioSeleccionado ?? ''
    ]);
});