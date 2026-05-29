import './_group.css';

export function LandingPage() {
  return (
    <div style={{ width: 390, minHeight: 780, background: '#f9fafb', fontFamily: "'Poppins', sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* Hero green section */}
      <div style={{ background: 'linear-gradient(160deg, #0a4422 0%, #157d3c 60%, #1a9b4b 100%)', padding: '48px 28px 56px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circle */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: '#f5c518', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🛵</div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 22, letterSpacing: '-0.3px' }}>Livrelo</span>
        </div>

        {/* Tagline */}
        <div style={{ marginBottom: 8 }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>Livraison rapide au Burkina Faso</p>
          <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 800, lineHeight: 1.15, marginBottom: 12 }}>
            Vos courses livrées<br />
            <span style={{ color: '#f5c518' }}>en quelques minutes</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13.5, lineHeight: 1.6 }}>Médicaments, repas, documents, gaz — nos livreurs à moto parcourent Ouagadougou pour vous.</p>
        </div>

        {/* Moto illustration placeholder */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <div style={{ fontSize: 72, filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.25))' }}>🛵</div>
        </div>
      </div>

      {/* Login card */}
      <div style={{ flex: 1, background: '#fff', borderRadius: '28px 28px 0 0', marginTop: -24, padding: '32px 28px', boxShadow: '0 -4px 24px rgba(0,0,0,0.07)' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Connexion</h2>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 28 }}>Accédez à votre espace</p>

        {/* Email field */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email</label>
          <div style={{ border: '1.5px solid #e5e7eb', borderRadius: 12, padding: '13px 16px', fontSize: 14, color: '#9ca3af', background: '#f9fafb' }}>votre@email.com</div>
        </div>

        {/* Password field */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Mot de passe</label>
          <div style={{ border: '1.5px solid #e5e7eb', borderRadius: 12, padding: '13px 16px', fontSize: 14, color: '#9ca3af', background: '#f9fafb', display: 'flex', justifyContent: 'space-between' }}>
            <span>••••••••</span>
            <span style={{ color: '#1a9b4b', fontWeight: 600, fontSize: 13 }}>Voir</span>
          </div>
        </div>

        {/* Login button */}
        <button style={{ width: '100%', background: 'linear-gradient(135deg, #1a9b4b, #157d3c)', color: '#fff', border: 'none', borderRadius: 14, padding: '15px', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(26,155,75,0.35)' }}>
          Se connecter
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
          <span style={{ color: '#9ca3af', fontSize: 12 }}>ou continuer avec</span>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
        </div>

        {/* Social buttons */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          {['Google', 'Facebook'].map(s => (
            <button key={s} style={{ flex: 1, border: '1.5px solid #e5e7eb', borderRadius: 12, padding: '11px', fontSize: 13, fontWeight: 600, color: '#374151', background: '#fff', cursor: 'pointer' }}>
              {s === 'Google' ? '🔵' : '🔷'} {s}
            </button>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280' }}>
          Pas de compte ? <span style={{ color: '#1a9b4b', fontWeight: 700 }}>S'inscrire</span>
        </p>
      </div>
    </div>
  );
}
