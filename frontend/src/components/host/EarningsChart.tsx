import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface HostReservation {
  id: number;
  statut: string;
  dateDebut: string;
  prixTotal: string | number;
}

interface EarningsChartProps {
  reservations: HostReservation[];
}

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

const EarningsChart: React.FC<EarningsChartProps> = ({ reservations }) => {
  // Filter only confirmed reservations
  const confirmedReservations = reservations.filter(r => r.statut === 'CONFIRMEE');

  // Sum total confirmed earnings
  const totalRevenue = confirmedReservations.reduce((sum, r) => sum + Number(r.prixTotal), 0);

  // Group revenue by month
  const monthlyRevenue = Array(12).fill(0);
  confirmedReservations.forEach(r => {
    const date = new Date(r.dateDebut);
    if (!isNaN(date.getTime())) {
      const monthIndex = date.getMonth();
      monthlyRevenue[monthIndex] += Number(r.prixTotal);
    }
  });

  const areaData = MONTHS.map((m, i) => ({
    name: m,
    total: monthlyRevenue[i]
  }));

  const kpiVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={kpiVariants} initial="hidden" animate="visible" style={{
        backgroundColor: 'white', borderRadius: '16px',
        border: '1px solid #F0EDE8', padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        marginBottom: '24px',
        minWidth: 0
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1A1A2E', margin: '0 0 4px' }}>
              Évolution des Revenus (MAD)
            </h3>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#DD7246', margin: 0, letterSpacing: '-0.5px' }}>
              MAD {totalRevenue.toLocaleString()}
            </p>
          </div>
          {totalRevenue > 0 && (
            <div style={{
              display: 'flex', gap: '4px', backgroundColor: '#F0FDF4',
              borderRadius: '100px', padding: '4px 10px',
              fontSize: '0.72rem', fontWeight: 700, color: '#059669',
              alignItems: 'center',
            }}>
              Revenu Réel
            </div>
          )}
        </div>

        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={areaData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DD7246" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#DD7246" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EDE8" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dx={-10} tickFormatter={(value) => `${value / 1000}k`} />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                itemStyle={{ color: '#1A1A2E', fontWeight: 700 }}
              />
              <Area type="monotone" dataKey="total" stroke="#DD7246" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
    </motion.div>
  );
};

export default EarningsChart;