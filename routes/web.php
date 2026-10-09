<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

Route::get('/', function () {
    // Tarjetas de Resumen (KPIs)
    $kpis = [
        'total' => DB::table('ticket')->where('departamento_id', 24)->count(),
        'cerrados' => DB::table('ticket as t')
            ->leftJoin('estado as e', 't.estado_id', '=', 'e.id')
            ->where('t.departamento_id', 24)
            ->where('e.nombre', 'Cerrado')
            ->count(),
        'pendientes' => DB::table('ticket as t')
            ->leftJoin('estado as e', 't.estado_id', '=', 'e.id')
            ->where('t.departamento_id', 24)
            ->where('e.nombre', 'Pendiente')
            ->count(),
    ];

    // 1. Tickets por tipo de problema
    $porTipoProblema = DB::table('ticket as t')
        ->leftJoin('tipo_problemas as tp', 't.tipo_problema_id', '=', 'tp.id')
        ->where('t.departamento_id', 24)
        ->select(DB::raw('IFNULL(tp.nombre, "Sin clasificar") as tipo'), DB::raw('COUNT(t.id) as cantidad'))
        ->groupBy('tipo')
        ->orderBy('cantidad', 'desc')
        ->get();

    // 2. TOP 10: Cerrados por técnico
    $cerradosPorTecnico = DB::table('ticket as t')
        ->leftJoin('estado as e', 't.estado_id', '=', 'e.id')
        ->leftJoin('users as u', 't.cerrado_por', '=', 'u.id')
        ->where('t.departamento_id', 24)
        ->where('e.nombre', 'Cerrado')
        ->whereNotNull('t.cerrado_por')
        ->select(DB::raw('IFNULL(u.name_and_surname, "Usuario Desconocido") as tecnico'), DB::raw('COUNT(t.id) as cantidad'))
        ->groupBy('tecnico')
        ->orderByDesc('cantidad')
        ->limit(10)
        ->get();

    // 3. Tabla COMPLETA de tickets (sin límites) con fecha formateada y cruda para filtros
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
            DB::raw('DATE_FORMAT(t.created_at, "%d/%m/%Y") as Fecha_Creacion')
        )
        ->orderBy('t.id', 'desc')
        ->get();

    // 4. Lista única de técnicos para el filtro desplegable
    $listaTecnicos = DB::table('ticket as t')
        ->leftJoin('users as u', 't.cerrado_por', '=', 'u.id')
        ->where('t.departamento_id', 24)
        ->whereNotNull('t.cerrado_por')
        ->select('u.name_and_surname as tecnico')
        ->distinct()
        ->orderBy('tecnico', 'asc')
        ->pluck('tecnico');

    return Inertia::render('DashboardTics', [
        'kpis' => $kpis,
        'porTipoProblema' => $porTipoProblema,
        'cerradosPorTecnico' => $cerradosPorTecnico,
        'ticketsTabla' => $ticketsTabla,
        'listaTecnicos' => $listaTecnicos
    ]);
});