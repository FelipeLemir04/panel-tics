import React from 'react';
import { Head } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function DashboardTics({ tickets }) {
    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <Head title="Panel de Tics" />
            
            <h1 style={{ color: '#333' }}>Estado de Tickets - Informática</h1>
            
            <div style={{ height: 400, width: '100%', marginTop: '30px' }}>
                <ResponsiveContainer>
                    <BarChart data={tickets}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="estado" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="cantidad" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}