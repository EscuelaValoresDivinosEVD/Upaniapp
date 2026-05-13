export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          color: 'var(--accent-warm)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>
          ❦
        </p>
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
        }}>
          Cargando...
        </p>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
