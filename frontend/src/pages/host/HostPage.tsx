import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { darlinkApi } from '../../services/darlinkApi';
import { getStoredUser } from '../../config/api';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

import HostSidebar, { type HostTab } from '../../components/host/HostSidebar';
import HostStatsBar from '../../components/host/HostStatsBar';
import EarningsChart from '../../components/host/EarningsChart';
import ActiveListings from '../../components/host/ActiveListings';
import RecentBookings from '../../components/shared/RecentBookings';
import RecentMessages from '../../components/shared/RecentMessages';
import HostMessages from '../../components/host/HostMessages';
import AddListingModal from '../../components/host/AddListingModal';
import HostDocuments from '../../components/host/HostDocuments';
import HostClientDocs from '../../components/host/HostClientDocs';

/* ── Types ── */
interface MyColiving {
  id: number;
  titre: string;
  adresse: string;
  statut: string;
  image: string | null;
  nbChambres: number;
  prixMin: number | null;
}

interface HostReservation {
  id: number;
  statut: string;
  dateDebut: string;
  dateFin: string;
  nombrePersonnes: number;
  prixTotal: string | number;
  clientId: number;
  client: { nom: string; email: string };
  coliving: { titre: string };
  chambre: { nom: string };
}

/* ── Page ── */
const HostPage: React.FC = () => {
  const me = getStoredUser();
  const [activeTab, setActiveTab] = useState<HostTab>('dashboard');
  const [properties, setProperties] = useState<MyColiving[]>([]);
  const [reservations, setReservations] = useState<HostReservation[]>([]);
  const [loadError, setLoadError] = useState('');
  const [actionId, setActionId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedColivingId, setSelectedColivingId] = useState<number | null>(null);

  const fetchColivings = () => {
    if (!me || me.role !== 'HOTE') return;
    darlinkApi.listMyColivings()
      .then(setProperties)
      .catch(e => setLoadError(e instanceof Error ? e.message : 'Erreur chargement colivings'));
  };

  useEffect(() => {
    if (!me || me.role !== 'HOTE') return;
    setLoadError('');
    fetchColivings();
    darlinkApi.listHostReservations()
      .then(setReservations)
      .catch(() => {});
  }, [me?.id]);

  /* ── Guard ── */
  if (!me || me.role !== 'HOTE') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#FAF9F7' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: '#9CA3AF' }}>
            <Lock size={48} strokeWidth={1.5} />
          </div>
          <h2 style={{ color: '#1A1A2E', marginBottom: '8px' }}>Espace réservé aux hôtes</h2>
          <Link to="/auth" style={{ color: '#DD7246', fontWeight: 600 }}>Se connecter</Link>
        </div>
      </div>
    );
  }

  /* ── Derived ── */
  const pendingPropCount = properties.filter(p => p.statut === 'EN_ATTENTE').length;
  const pendingResCount = reservations.filter(r => r.statut === 'EN_ATTENTE').length;
  const confirmedResCount = reservations.filter(r => r.statut === 'CONFIRMEE').length;
  const avgRating = 4.2; // TODO: calculate from actual reviews

  const handleDecision = async (id: number, decision: 'confirm' | 'reject') => {
    setActionId(id);
    setLoadError('');
    try {
      await darlinkApi.hostReservationDecision(id, decision);
      setReservations(prev =>
        prev.map(r => r.id === id ? { ...r, statut: decision === 'confirm' ? 'CONFIRMEE' : 'ANNULEE' } : r)
      );
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Erreur action réservation');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF9F7' }}>

      {/* ── Sidebar ── */}
      <HostSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hostName={me.nom || 'Hôte'}
        onAddListingClick={() => { setSelectedColivingId(null); setIsAddModalOpen(true); }}
      />

      {/* ── Main ── */}
      <main style={{ flex: 1, marginLeft: '200px', padding: '28px 28px 48px', minWidth: 0 }}>

        {/* Page heading */}
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#DD7246', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
            {me.nom} · Host Dashboard
          </p>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1A1A2E', margin: 0, letterSpacing: '-0.4px' }}>
            Voici l'activité sur vos espaces aujourd'hui.
          </h1>
        </div>

        {/* Error banner */}
        {loadError && (
          <div style={{
            backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: '10px', padding: '11px 16px',
            fontSize: '0.84rem', color: '#DC2626', marginBottom: '18px',
          }}>
            ⚠️ {loadError}
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {activeTab === 'dashboard' && (
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}>
            {/* KPI row */}
            <HostStatsBar
              totalProperties={properties.length}
              pendingCount={pendingPropCount}
              confirmedCount={confirmedResCount}
              pendingReservations={pendingResCount}
            />

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              <EarningsChart reservations={reservations} />
              
              {/* Popularity BarChart */}
              {(() => {
                const bookingCounts = properties.map(p => {
                  const count = reservations.filter(r => r.coliving.titre === p.titre).length;
                  return { titre: p.titre, count };
                }).sort((a, b) => b.count - a.count).slice(0, 5);

                const kpiVariants = {
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                };

                return (
                  <motion.div variants={kpiVariants} style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #F0EDE8', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', minWidth: 0 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1A1A2E', margin: '0 0 24px' }}>Top Espaces Coliving</h3>
                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer>
                        <BarChart data={bookingCounts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F0EDE8" />
                          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                          <YAxis type="category" dataKey="titre" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }} width={120} />
                          <RechartsTooltip 
                            cursor={{ fill: '#FAF9F7' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                          />
                          <Bar dataKey="count" fill="#4F46E5" radius={[0, 4, 4, 0]} barSize={24} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                );
              })()}
            </div>

            {/* Active listings */}
            <ActiveListings 
              properties={properties} 
              onAddClick={() => { setSelectedColivingId(null); setIsAddModalOpen(true); }} 
              onEditClick={(id) => { setSelectedColivingId(id); setIsAddModalOpen(true); }} 
            />

            {/* Bookings + Messages */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginTop: '24px' }}>
              <RecentBookings
                reservations={reservations}
                actionId={actionId}
                onDecision={handleDecision}
                limit={5}
              />
              <RecentMessages onGoToMessages={() => setActiveTab('messages')} />
            </div>
          </motion.div>
        )}

        {/* ── MESSAGES ── */}
        {activeTab === 'messages' && (
          <HostMessages />
        )}

        {/* ── LISTINGS ── */}
        {activeTab === 'listings' && (
          <>
            <HostStatsBar
              totalProperties={properties.length}
              pendingCount={pendingPropCount}
              confirmedCount={confirmedResCount}
              pendingReservations={pendingResCount}
            />
            <ActiveListings 
              properties={properties} 
              onAddClick={() => { setSelectedColivingId(null); setIsAddModalOpen(true); }} 
              onEditClick={(id) => { setSelectedColivingId(id); setIsAddModalOpen(true); }} 
            />
          </>
        )}

        {/* ── BOOKINGS ── */}
        {activeTab === 'bookings' && (
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <RecentBookings
              reservations={reservations}
              actionId={actionId}
              onDecision={handleDecision}
            />
          </div>
        )}

        {/* ── EARNINGS ── */}
        {activeTab === 'earnings' && (
          <>
            {/* Financial KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {[
                {
                  label: "Revenus Cumulés",
                  value: `MAD ${reservations.filter(r => r.statut === 'CONFIRMEE').reduce((sum, r) => sum + Number(r.prixTotal), 0).toLocaleString()}`,
                  desc: "Somme des réservations confirmées",
                  color: "#059669"
                },
                {
                  label: "Moyenne / Séjour",
                  value: `MAD ${reservations.filter(r => r.statut === 'CONFIRMEE').length > 0
                    ? Math.round(reservations.filter(r => r.statut === 'CONFIRMEE').reduce((sum, r) => sum + Number(r.prixTotal), 0) / reservations.filter(r => r.statut === 'CONFIRMEE').length).toLocaleString()
                    : '0'}`,
                  desc: "Revenu moyen par résident",
                  color: "#DD7246"
                },
                {
                  label: "Paiements Suspendus",
                  value: `MAD ${reservations.filter(r => r.statut === 'EN_ATTENTE').reduce((sum, r) => sum + Number(r.prixTotal), 0).toLocaleString()}`,
                  desc: "Réservations en attente",
                  color: "#D97706"
                },
                {
                  label: "Réservations Validées",
                  value: `${reservations.filter(r => r.statut === 'CONFIRMEE').length}`,
                  desc: "Volume de séjours validés",
                  color: "#4F46E5"
                }
              ].map(kpi => (
                <div key={kpi.label} style={{
                  backgroundColor: 'white', borderRadius: '16px',
                  border: '1.5px solid #F0EDE8', padding: '20px',
                }}>
                  <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 6px' }}>
                    {kpi.label}
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A1A2E', margin: '0 0 2px', letterSpacing: '-0.5px' }}>
                    {kpi.value}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: kpi.color, fontWeight: 500, margin: 0 }}>{kpi.desc}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <EarningsChart reservations={reservations} />

            {/* Transactions Table */}
            <div style={{
              backgroundColor: 'white', borderRadius: '16px',
              border: '1.5px solid #F0EDE8', padding: '22px 24px',
              marginTop: '8px', overflow: 'hidden'
            }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1A1A2E', margin: '0 0 16px' }}>
                Historique des Transactions
              </h3>
              
              {reservations.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#9CA3AF', margin: 0, textAlign: 'center', padding: '20px' }}>
                  Aucune transaction enregistrée
                </p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1.5px solid #F0EDE8', fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <th style={{ padding: '12px 8px' }}>Résident</th>
                        <th style={{ padding: '12px 8px' }}>Espace Coliving</th>
                        <th style={{ padding: '12px 8px' }}>Date Début</th>
                        <th style={{ padding: '12px 8px' }}>Montant</th>
                        <th style={{ padding: '12px 8px' }}>Statut</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: '0.84rem', color: '#374151' }}>
                      {reservations.map((r) => {
                        const isConfirmed = r.statut === 'CONFIRMEE';
                        const isPending = r.statut === 'EN_ATTENTE';
                        
                        return (
                          <tr key={r.id} style={{ borderBottom: '1px solid #FAF9F7' }}>
                            <td style={{ padding: '14px 8px', fontWeight: 600 }}>{r.client.nom}</td>
                            <td style={{ padding: '14px 8px', color: '#6B7280' }}>{r.coliving.titre} · <span style={{ fontSize: '0.78rem' }}>{r.chambre.nom}</span></td>
                            <td style={{ padding: '14px 8px', color: '#6B7280' }}>{new Date(r.dateDebut).toLocaleDateString('fr-FR')}</td>
                            <td style={{ padding: '14px 8px', fontWeight: 700, color: '#DD7246' }}>MAD {Number(r.prixTotal).toLocaleString()}</td>
                            <td style={{ padding: '14px 8px' }}>
                              <span style={{
                                display: 'inline-flex',
                                padding: '3px 10px',
                                borderRadius: '100px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                backgroundColor: isConfirmed ? '#F0FDF4' : isPending ? '#FFFBEB' : '#FEF2F2',
                                color: isConfirmed ? '#059669' : isPending ? '#D97706' : '#DC2626'
                              }}>
                                {isConfirmed ? 'Complété' : isPending ? 'En attente' : 'Annulé'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}



        {/* ── DOCUMENTS ── */}
        {activeTab === 'documents' && <HostDocuments />}

        {/* ── CLIENT DOCS ── */}
        {activeTab === 'client-docs' && <HostClientDocs />}
      </main>

      <AddListingModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setSelectedColivingId(null); }}
        onSuccess={fetchColivings}
        colivingId={selectedColivingId}
      />
    </div>
  );
};

export default HostPage;