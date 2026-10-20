import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { darlinkApi } from '../../services/darlinkApi';
import { getStoredUser } from '../../config/api';
import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

import AdminSidebar, { type TabType } from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import PendingVerifications from '../../components/admin/PendingVerifications';
import AdminUsersTable from '../../components/admin/AdminUsersTable';
import AdminDocuments from '../../components/admin/AdminDocuments';
import AdminAuditLogs from '../../components/admin/AdminAuditLogs';
import AdminClientDocs from '../../components/admin/AdminClientDocs';

type PendingColiving = {
  id: number;
  titre: string;
  adresse: string;
  statut: string;
  dateCreation: string;
  hote: { nom: string; email: string };
  prixMin: number | null;
  nbChambres: number;
  image: string | null;
  equipements: string[];
};

type AdminUser = {
  id: number;
  nom: string;
  email: string;
  role: string;
  dateCreation: string;
  telephone: string | null;
};

type GlobalReservation = {
  id: number;
  statut: string;
  dateDebut: string;
  dateFin: string;
  nombrePersonnes: number;
  prixTotal: string;
  dateCreation: string;
  client: { nom: string; email: string };
  coliving: { titre: string; hote: string };
  chambre: { nom: string };
};

export default function AdminPage() {
  const me = getStoredUser();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pending, setPending] = useState<PendingColiving[]>([]);
  const [globalReservations, setGlobalReservations] = useState<GlobalReservation[]>([]);
  const [bookingFilter, setBookingFilter] = useState<'pending' | 'all'>('pending');
  const [platformStats, setPlatformStats] = useState({
    totalUsers: 0,
    totalColivings: 0,
    totalReservations: 0,
    totalHosts: 0,
    totalRevenue: 0,
    pendingColivings: 0,
  });

  const [loadError, setLoadError] = useState('');
  const [actionId, setActionId] = useState<number | null>(null);

  /* ── Fetch data based on active tab ── */
  useEffect(() => {
    if (!me || me.role !== 'ADMIN') return;
    setLoadError('');

    darlinkApi.getPlatformStatsAdmin()
      .then(setPlatformStats)
      .catch(() => {});

    if (activeTab === 'users' || activeTab === 'dashboard') {
      darlinkApi.listUsersAdmin()
        .then(setUsers)
        .catch(e => setLoadError(e instanceof Error ? e.message : 'Erreur chargement utilisateurs'));
    }

    if (activeTab === 'listings' || activeTab === 'dashboard') {
      darlinkApi.listPendingColivingsAdmin()
        .then(setPending)
        .catch(e => setLoadError(e instanceof Error ? e.message : 'Erreur chargement colivings'));
    }

    if (activeTab === 'bookings' || activeTab === 'dashboard' || activeTab === 'earnings') {
      darlinkApi.listReservationsAdmin()
        .then(setGlobalReservations)
        .catch(e => setLoadError(e instanceof Error ? e.message : 'Erreur chargement réservations globales'));
    }
  }, [activeTab]);



  /* ── Moderation action ── */
  const handleModerate = async (id: number, statut: 'VALIDE' | 'REFUSE') => {
    setActionId(id);
    setLoadError('');
    try {
      await darlinkApi.validateColivingAdmin(id, statut);
      setPending(prev => prev.filter(p => p.id !== id));
      // Refresh stats
      darlinkApi.getPlatformStatsAdmin().then(setPlatformStats).catch(() => {});
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Erreur modération');
    } finally {
      setActionId(null);
    }
  };

  /* ── Guard ── */
  if (!me || me.role !== 'ADMIN') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#FAF9F7' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: '#9CA3AF' }}>
            <Lock size={48} strokeWidth={1.5} />
          </div>
          <h2 style={{ color: '#1A1A2E', marginBottom: '8px' }}>Accès réservé aux administrateurs</h2>
          <Link to="/auth" style={{ color: '#DD7246', fontWeight: 600 }}>Se connecter</Link>
        </div>
      </div>
    );
  }

  /* ── Stats ── */


  return (
    <Tabs.Root value={activeTab} onValueChange={setActiveTab as any} orientation="vertical" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF9F7' }}>
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: '200px', padding: '32px', minWidth: 0 }}>

        {/* Top bar */}
        <AdminTopBar />

        {/* Error banner */}
        {loadError && (
          <div style={{
            backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: '10px', padding: '12px 16px',
            fontSize: '0.85rem', color: '#DC2626', marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            ⚠️ {loadError}
          </div>
        )}

        {/* ── DASHBOARD TAB ── */}
        <Tabs.Content value="dashboard" style={{ outline: 'none' }}>
          {(() => {
          // Calculate monthly revenue from globalReservations
          const revenueByMonth: Record<string, number> = {};
          (globalReservations || []).forEach(r => {
            if (r.statut === 'CONFIRMEE') {
               const dateStr = r.dateCreation || r.dateDebut;
               if (dateStr) {
                 const date = new Date(dateStr);
                 if (!isNaN(date.getTime())) {
                   const monthYear = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
                   revenueByMonth[monthYear] = (revenueByMonth[monthYear] || 0) + Number(r.prixTotal || 0);
                 }
               }
            }
          });

          // Generate default data if none exists
          let areaData = Object.entries(revenueByMonth).map(([name, total]) => ({ name, total }));
          if (areaData.length === 0) {
            areaData = [
              { name: 'Jan 2024', total: 12000 },
              { name: 'Fév 2024', total: 18000 },
              { name: 'Mar 2024', total: 22000 },
              { name: 'Avr 2024', total: 29500 },
              { name: 'Mai 2024', total: 38000 },
              { name: 'Juin 2024', total: 54000 },
            ];
          }

          // Group reservation count by coliving title for BarChart
          const statsMap: Record<string, number> = {};
          (globalReservations || []).forEach(r => {
            if (r.coliving?.titre) {
              statsMap[r.coliving.titre] = (statsMap[r.coliving.titre] || 0) + 1;
            }
          });

          let barData = Object.entries(statsMap).map(([name, count]) => ({ name, reservations: count })).sort((a, b) => b.reservations - a.reservations).slice(0, 5);
          if (barData.length === 0) {
             barData = [
               { name: 'Villa Surf Taghazout', reservations: 45 },
               { name: 'Medina Hub Marrakech', reservations: 38 },
               { name: 'Atlas Co-living', reservations: 25 },
               { name: 'Desert Oasis', reservations: 19 },
               { name: 'Casa Blanca Workspace', reservations: 12 },
             ];
          }

          const kpiVariants = {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          };

          return (
            <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {[
                  { title: 'Utilisateurs', value: platformStats.totalUsers, trend: 'Membres', color: '#059669' },
                  { title: 'Espaces', value: platformStats.totalColivings, trend: 'Actifs', color: '#4F46E5' },
                  { title: 'Réservations', value: platformStats.totalReservations, trend: 'Globales', color: '#DD7246' },
                  { title: 'Hôtes', value: platformStats.totalHosts, trend: 'Partenaires', color: '#D97706' },
                ].map(card => (
                  <motion.div key={card.title} variants={kpiVariants} style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #F0EDE8', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>{card.title}</p>
                    <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1A1A2E', margin: '0 0 4px', letterSpacing: '-0.5px' }}>{card.value}</p>
                    <p style={{ fontSize: '0.8rem', color: card.color, fontWeight: 600, margin: 0 }}>{card.trend}</p>
                  </motion.div>
                ))}
              </div>

              {/* Charts Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                
                {/* Revenue AreaChart */}
                <motion.div variants={kpiVariants} style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #F0EDE8', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1A1A2E', margin: '0 0 24px' }}>Évolution des Revenus (MAD)</h3>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <AreaChart data={areaData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
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
                        <Area type="monotone" dataKey="total" stroke="#DD7246" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Popularity BarChart */}
                <motion.div variants={kpiVariants} style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #F0EDE8', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1A1A2E', margin: '0 0 24px' }}>Top Espaces Coliving</h3>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F0EDE8" />
                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }} width={120} />
                        <RechartsTooltip 
                          cursor={{ fill: '#FAF9F7' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                        />
                        <Bar dataKey="reservations" fill="#4F46E5" radius={[0, 4, 4, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

              </div>

              {/* Dashboard main: vérifications en attente */}
              <PendingVerifications
                pending={pending}
                actionId={actionId}
                onModerate={handleModerate}
              />
            </motion.div>
          );
        })()}
        </Tabs.Content>

        {/* ── LISTINGS TAB ── */}
        <Tabs.Content value="listings" style={{ outline: 'none' }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1A1A2E', margin: '0 0 4px' }}>
                Espaces en attente de modération
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: 0 }}>
                Validez ou rejetez les demandes de publication soumises par les hôtes.
              </p>
            </div>
            <PendingVerifications
              pending={pending}
              actionId={actionId}
              onModerate={handleModerate}
            />
        </Tabs.Content>

        {/* ── USERS TAB ── */}
        <Tabs.Content value="users" style={{ outline: 'none' }}>
          <AdminUsersTable users={users} />
        </Tabs.Content>

        {/* ── DOCUMENTS TAB ── */}
        <Tabs.Content value="documents" style={{ outline: 'none' }}>
          <AdminDocuments />
        </Tabs.Content>

        {/* ── DOCS CLIENTS TAB ── */}
        <Tabs.Content value="client-docs" style={{ outline: 'none' }}>
          <AdminClientDocs />
        </Tabs.Content>

        {/* ── AUDIT TAB ── */}
        <Tabs.Content value="audit" style={{ outline: 'none' }}>
          <AdminAuditLogs />
        </Tabs.Content>

        {/* ── BOOKINGS TAB ── */}
        <Tabs.Content value="bookings" style={{ outline: 'none' }}>
          {(() => {
          const displayed = bookingFilter === 'pending'
            ? (globalReservations || []).filter(r => r.statut === 'EN_ATTENTE')
            : (globalReservations || []).filter(r => r.statut !== 'EN_ATTENTE');

          return (
            <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1.5px solid #F0EDE8', padding: '24px' }}>
              {/* Filters */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #FAF9F7', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1A1A2E', margin: 0 }}>
                  Gestion des Réservations ({displayed.length})
                </h2>
                <div style={{ display: 'flex', gap: '8px', backgroundColor: '#FAF9F7', padding: '4px', borderRadius: '8px' }}>
                  <button
                    onClick={() => setBookingFilter('pending')}
                    style={{
                      border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                      backgroundColor: bookingFilter === 'pending' ? '#DD7246' : 'transparent',
                      color: bookingFilter === 'pending' ? 'white' : '#6B7280',
                    }}
                  >
                    En attente
                  </button>
                  <button
                    onClick={() => setBookingFilter('all')}
                    style={{
                      border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                      backgroundColor: bookingFilter === 'all' ? '#DD7246' : 'transparent',
                      color: bookingFilter === 'all' ? 'white' : '#6B7280',
                    }}
                  >
                    Confirmées & Annulées
                  </button>
                </div>
              </div>

              {displayed.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF', fontSize: '0.85rem' }}>
                  Aucune réservation trouvée pour ce filtre.
                </p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1.5px solid #F0EDE8', fontSize: '0.74rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <th style={{ padding: '12px 8px' }}>Résident</th>
                        <th style={{ padding: '12px 8px' }}>Hôte</th>
                        <th style={{ padding: '12px 8px' }}>Coliving</th>
                        <th style={{ padding: '12px 8px' }}>Arrivée</th>
                        <th style={{ padding: '12px 8px' }}>Montant</th>
                        <th style={{ padding: '12px 8px' }}>Statut</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: '0.82rem', color: '#374151' }}>
                      {displayed.map(r => (
                        <tr key={r.id} style={{ borderBottom: '1px solid #FAF9F7' }}>
                          <td style={{ padding: '12px 8px', fontWeight: 600 }}>{r.client?.nom || 'Inconnu'}</td>
                          <td style={{ padding: '12px 8px', color: '#4B5563' }}>{r.coliving?.hote || '—'}</td>
                          <td style={{ padding: '12px 8px', color: '#6B7280' }}>{r.coliving?.titre || '—'} · <span style={{ fontSize: '0.76rem' }}>{r.chambre?.nom || '—'}</span></td>
                          <td style={{ padding: '12px 8px', color: '#6B7280' }}>{r.dateDebut ? new Date(r.dateDebut).toLocaleDateString('fr-FR') : '—'}</td>
                          <td style={{ padding: '12px 8px', fontWeight: 700, color: '#DD7246' }}>MAD {Number(r.prixTotal || 0).toLocaleString()}</td>
                          <td style={{ padding: '12px 8px' }}>
                            <span style={{
                              display: 'inline-flex', padding: '3px 8px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700,
                              backgroundColor: r.statut === 'CONFIRMEE' ? '#F0FDF4' : r.statut === 'EN_ATTENTE' ? '#FFFBEB' : '#FEF2F2',
                              color: r.statut === 'CONFIRMEE' ? '#059669' : r.statut === 'EN_ATTENTE' ? '#D97706' : '#DC2626',
                            }}>
                              {r.statut === 'CONFIRMEE' ? 'Confirmée' : r.statut === 'EN_ATTENTE' ? 'En attente' : 'Annulée'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })()}
        </Tabs.Content>

        {/* ── EARNINGS TAB ── */}
        <Tabs.Content value="earnings" style={{ outline: 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: "Volume d'affaires global", value: `MAD ${(platformStats?.totalRevenue || 0).toLocaleString()}`, sub: "Revenus confirmés cumulés", color: "#059669" },
                { label: "Moyenne par coliving", value: `MAD ${platformStats?.totalColivings > 0 ? Math.round((platformStats?.totalRevenue || 0) / platformStats.totalColivings).toLocaleString() : '0'}`, sub: "Revenu par espace listé", color: "#DD7246" },
                { label: "Volume de transactions", value: `${(globalReservations || []).length} transactions`, sub: "Réservations totales", color: "#4F46E5" }
              ].map(card => (
                <div key={card.label} style={{ backgroundColor: 'white', borderRadius: '16px', border: '1.5px solid #F0EDE8', padding: '20px' }}>
                  <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 6px' }}>{card.label}</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A1A2E', margin: '0 0 2px', letterSpacing: '-0.5px' }}>{card.value}</p>
                  <p style={{ fontSize: '0.72rem', color: card.color, fontWeight: 600, margin: 0 }}>{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Platform Transactions Table */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1.5px solid #F0EDE8', padding: '24px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1A1A2E', margin: '0 0 16px' }}>
                Flux financiers généraux de la plateforme
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid #F0EDE8', fontSize: '0.74rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '12px 8px' }}>Réf</th>
                      <th style={{ padding: '12px 8px' }}>Résident</th>
                      <th style={{ padding: '12px 8px' }}>Hôte</th>
                      <th style={{ padding: '12px 8px' }}>Montant</th>
                      <th style={{ padding: '12px 8px' }}>Statut</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: '0.82rem', color: '#374151' }}>
                    {(globalReservations || []).slice(0, 15).map(r => (
                      <tr key={r.id} style={{ borderBottom: '1px solid #FAF9F7' }}>
                        <td style={{ padding: '12px 8px', fontWeight: 700, color: '#9CA3AF' }}>#RES-{r.id}</td>
                        <td style={{ padding: '12px 8px', fontWeight: 600 }}>{r.client?.nom || 'Inconnu'}</td>
                        <td style={{ padding: '12px 8px', color: '#6B7280' }}>{r.coliving?.hote || '—'}</td>
                        <td style={{ padding: '12px 8px', fontWeight: 700, color: '#DD7246' }}>MAD {Number(r.prixTotal || 0).toLocaleString()}</td>
                        <td style={{ padding: '12px 8px' }}>
                          <span style={{
                            display: 'inline-flex', padding: '3px 8px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700,
                            backgroundColor: r.statut === 'CONFIRMEE' ? '#F0FDF4' : r.statut === 'EN_ATTENTE' ? '#FFFBEB' : '#FEF2F2',
                            color: r.statut === 'CONFIRMEE' ? '#059669' : r.statut === 'EN_ATTENTE' ? '#D97706' : '#DC2626',
                          }}>
                            {r.statut === 'CONFIRMEE' ? 'Complété' : r.statut === 'EN_ATTENTE' ? 'En attente' : 'Annulé'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        </Tabs.Content>


      </main>
    </Tabs.Root>
  );
}