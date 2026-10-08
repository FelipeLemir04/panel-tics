<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

Route::get('/', function () {
    $tickets = DB::table('ticket as t')
        ->leftJoin('estado as e', 't.estado_id', '=', 'e.id')
        ->where('t.departamento_id', 24)
        ->select('e.nombre as estado', DB::raw('COUNT(t.id) as cantidad'))
        ->groupBy('e.nombre')
        ->get();

    return Inertia::render('DashboardTics', [
        'tickets' => $tickets
    ]);
});