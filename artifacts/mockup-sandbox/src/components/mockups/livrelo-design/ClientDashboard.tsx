import './_group.css';

export function ClientDashboard() {
  return (
    <div style={{ width: 390, height: 780, background: '#f3f4f6', fontFamily: "'Poppins', sans-serif", display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0a4422 0%, #1a9b4b 100%)', padding: '48px 24px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Bonjour 👋</p>
            <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Aminata Sawadogo</h2>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🔔</div>
            <div style={{ position: 'absolute', top: -3, right: -3, width: 10, height: 10, borderRadius: '50%', background: '#f5c518', border: '2px solid #0a4422' }} />
          </div>
        </div>
        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 12px', width: 'fit-content' }}>
          <span style={{ fontSize: 14 }}>📍</span>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>Ouagadougou</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>▼</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 80px' }}>
        {/* Hero card */}
        <div style={{ background: 'linear-gradient(135deg, #1a9b4b, #4aba7d)', borderRadius: 20, padding: '20px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -10, bottom: -10, fontSize: 64, opacity: 0.2 }}>🛵</div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Livraison rapide et fiable</p>
          <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Nous sommes là pour vous servir !</h3>
          <div style={{ background: '#fff', borderRadius: 10, padding: '8px 16px', display: 'inline-block', cursor: 'pointer' }}>
            <span style={{ color: '#1a9b4b', fontSize: 13, fontWeight: 700 }}>Commander maintenant →</span>
          </div>
        </div>

        {/* Services */}
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Que voulez-vous faire ?</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '📦', label: 'Livraison de colis', desc: 'Envoyer un objet', color: '#dcf3e6', iconBg: '#1a9b4b' },
            { icon: '🛒', label: 'Course / Achat', desc: 'Acheter et livrer', color: '#fefce8', iconBg: '#f5c518' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 16, padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', cursor: 'pointer', border: '1.5px solid #f3f4f6' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{s.label}</p>
              <p style={{ fontSize: 11, color: '#6b7280' }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Partners */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Partenaires</h3>
          <span style={{ fontSize: 12, color: '#1a9b4b', fontWeight: 600 }}>Voir tout</span>
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4, marginBottom: 20 }}>
          {['🍕\nPizza Love', '💊\nPharmar', '🛍️\nSuper Mini', '🍽️\nLe Délice'].map(p => {
            const [icon, name] = p.split('\n');
            return (
              <div key={name} style={{ flexShrink: 0, background: '#fff', borderRadius: 16, padding: '14px 16px', textAlign: 'center', minWidth: 72, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1.5px solid #f3f4f6' }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{icon}</div>
                <p style={{ fontSize: 10, fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>{name}</p>
              </div>
            );
          })}
        </div>

        {/* Recent orders */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Commandes récentes</h3>
          <span style={{ fontSize: 12, color: '#1a9b4b', fontWeight: 600 }}>Voir tout</span>
        </div>
        {[
          { id: '#12345', status: 'En cours', statusColor: '#1a9b4b', statusBg: '#dcf3e6', type: 'Livraison de colis', time: "Aujourd'hui, 10:15" },
          { id: '#12340', status: 'Livrée', statusColor: '#157d3c', statusBg: '#dcf3e6', type: 'Course / Achat', time: 'Hier, 16:40' },
        ].map(o => (
          <div key={o.id} style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1.5px solid #f3f4f6' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f0faf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📦</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{o.id}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: o.statusColor, background: o.statusBg, borderRadius: 20, padding: '2px 10px' }}>{o.status}</span>
              </div>
              <p style={{ fontSize: 12, color: '#6b7280' }}>{o.type}</p>
              <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{o.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: 390, background: '#fff', borderTop: '1px solid #f3f4f6', display: 'flex', padding: '10px 0 16px', boxShadow: '0 -4px 16px rgba(0,0,0,0.07)' }}>
        {[{ icon: '🏠', label: 'Accueil', active: true }, { icon: '📋', label: 'Commandes', active: false }, { icon: '❤️', label: 'Favoris', active: false }, { icon: '👤', label: 'Profil', active: false }].map(n => (
          <div key={n.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: n.active ? '#dcf3e6' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{n.icon}</div>
            <span style={{ fontSize: 10, fontWeight: n.active ? 700 : 500, color: n.active ? '#1a9b4b' : '#9ca3af' }}>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
