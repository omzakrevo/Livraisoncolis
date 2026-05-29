import './_group.css';

export function DriverDashboard() {
  return (
    <div style={{ width: 390, height: 780, background: '#f3f4f6', fontFamily: "'Poppins', sans-serif", display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0a4422 0%, #1a9b4b 100%)', padding: '48px 24px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Livreur</p>
            <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Moussa Kaboré</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: 'rgba(245,197,24,0.25)', borderRadius: 20, padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f5c518' }} />
              <span style={{ color: '#f5c518', fontSize: 12, fontWeight: 700 }}>En ligne</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 20 }}>
          {[{ label: 'Livrées', value: '12' }, { label: 'Gain jour', value: '9 800 FCFA' }, { label: 'Note', value: '4.8 ⭐' }].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '10px 12px', textAlign: 'center' }}>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{s.value}</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* New order card */}
      <div style={{ margin: '16px', background: '#fff', borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', overflow: 'hidden', border: '2px solid #1a9b4b' }}>
        <div style={{ background: 'linear-gradient(135deg, #1a9b4b, #4aba7d)', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 500 }}>Nouvelle commande</p>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Reçue il y a 10:15</h3>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '6px 12px' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>2 000</span>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, display: 'block', textAlign: 'center' }}>FCFA</span>
          </div>
        </div>

        <div style={{ padding: '16px 18px' }}>
          {/* Route */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, paddingTop: 2 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f5c518', border: '2px solid #fff', boxShadow: '0 0 0 2px #f5c518' }} />
              <div style={{ width: 2, height: 32, background: '#e5e7eb', borderRadius: 1 }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1a9b4b', border: '2px solid #fff', boxShadow: '0 0 0 2px #1a9b4b' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 18 }}>
                <p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 500, marginBottom: 2 }}>RÉCUPÉRATION</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Ouaga 2000, près de la station Total</p>
              </div>
              <div>
                <p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 500, marginBottom: 2 }}>LIVRAISON</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Karpala, après la pharmacie Wendkouni</p>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
            <div style={{ flex: 1, background: '#f0faf4', borderRadius: 12, padding: '10px 14px', textAlign: 'center' }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#1a9b4b' }}>5,6 km</p>
              <p style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>Distance totale</p>
            </div>
            <div style={{ flex: 1, background: '#fefce8', borderRadius: 12, padding: '10px 14px', textAlign: 'center' }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#92400e' }}>1 500 FCFA</p>
              <p style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>Gain estimé</p>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ flex: 1, background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Refuser
            </button>
            <button style={{ flex: 2, background: 'linear-gradient(135deg, #1a9b4b, #157d3c)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 14px rgba(26,155,75,0.4)' }}>
              Accepter <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: '2px 8px', fontSize: 13 }}>28s</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active delivery steps */}
      <div style={{ margin: '0 16px 16px', background: '#fff', borderRadius: 20, padding: '16px 18px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Commande #12345 • En cours</p>
        {[
          { n: 1, label: 'En route vers le point de récupération', done: true },
          { n: 2, label: 'Colis récupéré', done: true },
          { n: 3, label: 'En cours de livraison', done: false, active: true },
          { n: 4, label: 'Livré', done: false },
        ].map(s => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: s.done ? '#1a9b4b' : s.active ? '#dcf3e6' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {s.done ? <span style={{ color: '#fff', fontSize: 13 }}>✓</span> : <span style={{ color: s.active ? '#1a9b4b' : '#9ca3af', fontSize: 11, fontWeight: 700 }}>{s.n}</span>}
            </div>
            <span style={{ fontSize: 12, fontWeight: s.active ? 700 : 500, color: s.done ? '#1a9b4b' : s.active ? '#111827' : '#9ca3af' }}>{s.label}</span>
          </div>
        ))}
        <button style={{ width: '100%', background: 'linear-gradient(135deg, #1a9b4b, #157d3c)', color: '#fff', border: 'none', borderRadius: 12, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 4 }}>
          Confirmer la livraison
        </button>
      </div>
    </div>
  );
}
