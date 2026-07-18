import React, { useState } from 'react';
import { Calendar, MapPin, Users, ArrowRight, Clock, Activity } from 'lucide-react';

interface CommunityEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  image: string;
  icon: React.ReactNode;
}

interface UpcomingActivity {
  time: string;
  activity: string;
}

interface CommunityEventsProps {
  events: CommunityEvent[];
  upcomingActivities: UpcomingActivity[];
}

const CommunityEvents: React.FC<CommunityEventsProps> = ({ events, upcomingActivities }) => {
  const [tab, setTab] = useState<'events' | 'schedule'>('events');

  return (
    <section style={{ padding: '80px 24px', backgroundColor: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#DD7246', marginBottom: '8px' }}>
              Vie communautaire
            </p>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.5px', margin: 0 }}>
              Événements & Activités
            </h2>
          </div>

          {/* Tab switcher */}
          <div
            style={{
              display: 'flex', backgroundColor: '#F5F3F0',
              borderRadius: '12px', padding: '4px', gap: '4px',
            }}
          >
            {(['events', 'schedule'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 18px', borderRadius: '9px', border: 'none',
                  backgroundColor: tab === t ? 'white' : 'transparent',
                  color: tab === t ? '#1A1A2E' : '#9CA3AF',
                  fontWeight: tab === t ? 700 : 500,
                  fontSize: '0.85rem', cursor: 'pointer',
                  boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {t === 'events' ? <><Activity size={16} /> Événements</> : <><Calendar size={16} /> Programme</>}
              </button>
            ))}
          </div>
        </div>

        {/* Events grid */}
        {tab === 'events' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Schedule */}
        {tab === 'schedule' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Daily schedule */}
            <div style={{ backgroundColor: '#FAF9F7', borderRadius: '20px', padding: '28px', border: '1.5px solid #F0EDE8' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '20px' }}>
                <Clock size={20} color="#DD7246" /> Programme du jour
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {upcomingActivities.map((a, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '12px 14px', backgroundColor: 'white',
                      borderRadius: '12px', border: '1px solid #F0EDE8',
                    }}
                  >
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#DD7246', minWidth: '44px' }}>{a.time}</span>
                    <div style={{ width: '1px', height: '20px', backgroundColor: '#F0EDE8' }} />
                    <span style={{ fontSize: '0.88rem', color: '#374151', fontWeight: 500 }}>{a.activity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming events list */}
            <div style={{ backgroundColor: '#FAF9F7', borderRadius: '20px', padding: '28px', border: '1.5px solid #F0EDE8' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '20px' }}>
                <Calendar size={20} color="#DD7246" /> Prochains événements
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {events.map(event => (
                  <div
                    key={event.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 14px', backgroundColor: 'white',
                      borderRadius: '12px', border: '1px solid #F0EDE8',
                      cursor: 'pointer', transition: 'border-color 0.2s',
                    }}
                    onMouseOver={e => (e.currentTarget.style.borderColor = '#DD724655')}
                    onMouseOut={e => (e.currentTarget.style.borderColor = '#F0EDE8')}
                  >
                    <span style={{ fontSize: '1.4rem' }}>{event.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1A1A2E', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.title}</p>
                      <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>{event.date} · {event.time}</p>
                    </div>
                    <ArrowRight size={14} color="#DD7246" style={{ flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const EventCard: React.FC<{ event: CommunityEvent }> = ({ event }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        border: `1.5px solid ${hovered ? '#DD724633' : '#F0EDE8'}`,
        transition: 'all 0.25s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <img
          src={event.image}
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)' }} />
        <div style={{ position: 'absolute', top: '12px', left: '12px', fontSize: '1.8rem' }}>{event.icon}</div>
        <div
          style={{
            position: 'absolute', bottom: '12px', left: '12px',
            backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
            borderRadius: '8px', padding: '4px 10px',
            fontSize: '0.75rem', fontWeight: 700, color: '#1A1A2E',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}
        >
          <Users size={11} /> {event.attendees} participants
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '18px 20px 20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '6px' }}>{event.title}</h3>
        <p style={{ fontSize: '0.83rem', color: '#6B7280', lineHeight: 1.6, marginBottom: '14px' }}>
          {event.description.slice(0, 90)}{event.description.length > 90 ? '…' : ''}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#9CA3AF' }}>
            <Calendar size={12} color="#DD7246" />
            {event.date} · {event.time}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#9CA3AF' }}>
            <MapPin size={12} color="#DD7246" />
            {event.location}
          </div>
        </div>

        <button
          style={{
            width: '100%', padding: '10px',
            backgroundColor: hovered ? '#DD7246' : '#FAF9F7',
            color: hovered ? 'white' : '#374151',
            border: `1.5px solid ${hovered ? '#DD7246' : '#F0EDE8'}`,
            borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          Je participe →
        </button>
      </div>
    </div>
  );
};

export default CommunityEvents;