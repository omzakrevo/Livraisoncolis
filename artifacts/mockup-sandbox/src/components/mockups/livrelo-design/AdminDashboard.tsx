import './_group.css';

export function AdminDashboard() {
  return (
    <div style={{ width: 390, height: 780, background: '#f3f4f6', fontFamily: "'Poppins', sans-serif", display: 'flex', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: 68, background: 'linear-gradient(180deg, #062d17 0%, #0a4422 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0 20px' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: '#f5c518', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 32 }}>🛵</div>
        {[
          { icon: '📊', active: true },
          { icon: '📋', active: false },
          { icon: '👥', active: false },
          { icon: '🚗', active: false },
          { icon: '🤝', active: false },
          { icon: '🛍️', active: false },
          { icon: '💰', active: false },
          { icon: '🔔', active: false },
        ].map((item, i) => (
          <div key={i} style={{ width: 44, height: 44, borderRadius: 12, background: item.active ? 'rgba(245,197,24,0.25)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 8, cursor: 'pointer', border: item.active ? '1.5px solid rgba(245,197,24,0.4)' : '1.5px solid transparent' }}>
            {item.icon}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, cursor: 'pointer' }}>🚪</div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 2 }}>15 Mai 2024</p>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111827' }}>Bonjour Admin 👋</h2>
            <p style={{ fontSize: 11, color: '#6b7280' }}>Aperçu de votre activité</p>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>🔔</div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Commandes totales', value: '128', change: '+12%', color: '#dcf3e6', textColor: '#1a9b4b' },
            { label: 'En cours', value: '45', change: '+18%', color: '#fefce8', textColor: '#92400e' },
            { label: 'Livrées', value: '75', change: '+8%', color: '#dbeafe', textColor: '#1d4ed8' },
            { label: 'Annulées', value: '8', change: '-3%', color: '#fee2e2', textColor: '#dc2626' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 14, padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <p style={{ fontSize: 10, color: '#6b7280', fontWeight: 500, lineHeight: 1.3 }}>{s.label}</p>
                <span style={{ fontSize: 9, fontWeight: 700, color: s.textColor, background: s.color, borderRadius: 20, padding: '2px 6px' }}>{s.change}</span>
              </div>
              <p style={{ fontSize: 22, fontWeight: 800, color: '#111827' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Revenue */}
        <div style={{ background: 'linear-gradient(135deg, #0a4422, #1a9b4b)', borderRadius: 16, padding: '16px', marginBottom: 16, display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginBottom: 4 }}>Revenus aujourd'hui</p>
            <p style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>256 000 FCFA</p>
            <p style={{ color: '#4aba7d', fontSize: 10, marginTop: 2 }}>+15% vs hier</p>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ flex: 1, paddingLeft: 10 }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginBottom: 4 }}>Commission aujourd'hui</p>
            <p style={{ color: '#f5c518', fontWeight: 800, fontSize: 18 }}>38 400 FCFA</p>
            <p style={{ color: '#4aba7d', fontSize: 10, marginTop: 2 }}>+10% vs hier</p>
          </div>
        </div>

        {/* Recent orders table */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Commandes récentes</p>
            <span style={{ fontSize: 11, color: '#1a9b4b', fontWeight: 600 }}>Voir tout</span>
          </div>
          {[
            { id: '#12345', client: 'Moussa K.', type: 'Colis', status: 'En cours', amount: '2 000', statusColor: '#1a9b4b', statusBg: '#dcf3e6' },
            { id: '#12344', client: 'Aminata T.', type: 'Course', status: 'Acceptée', amount: '1 500', statusColor: '#d97706', statusBg: '#fefce8' },
            { id: '#12343', client: 'Issa B.', type: 'Colis', status: 'En attente', amount: '2 500', statusColor: '#6b7280', statusBg: '#f3f4f6' },
            { id: '#12342', client: 'Mariama T.', type: 'Course', status: 'Livrée', amount: '1 200', statusColor: '#157d3c', statusBg: '#dcf3e6' },
          ].map(o => (
            <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{o.id}</p>
                <p style={{ fontSize: 10, color: '#6b7280' }}>{o.client} • {o.type}</p>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: o.statusColor, background: o.statusBg, borderRadius: 20, padding: '3px 8px', marginRight: 8 }}>{o.status}</span>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#111827', minWidth: 50, textAlign: 'right' }}>{o.amount} F</p>
            </div>
          ))}
        </div>

        {/* Distribution chart */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Répartition des commandes</p>
          {[
            { label: 'Livraison de colis', pct: 60, color: '#1a9b4b' },
            { label: 'Course / Achat', pct: 30, color: '#f5c518' },
            { label: 'Autres', pct: 10, color: '#9ca3af' },
          ].map(b => (
            <div key={b.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: '#374151' }}>{b.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#374151' }}>{b.pct}%</span>
              </div>
              <div style={{ height: 7, background: '#f3f4f6', borderRadius: 10 }}>
                <div style={{ height: 7, width: `${b.pct}%`, background: b.color, borderRadius: 10 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
