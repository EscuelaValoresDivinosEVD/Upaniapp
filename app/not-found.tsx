import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '5rem',
        color: 'var(--accent-warm)',
        margin: 0,
        lineHeight: 1,
      }}>
        ❦
      </p>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.8rem',
        color: 'var(--text)',
        marginTop: '16px',
        marginBottom: '8px',
      }}>
        Página no encontrada
      </h1>
      <p style={{
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-ui)',
        fontSize: '0.95rem',
        marginBottom: '32px',
      }}>
        Esta entrada no existe o ha sido movida.
      </p>
      <Link
        href="/"
        style={{
          padding: '10px 24px',
          background: 'var(--accent-warm)',
          color: 'var(--bg)',
          borderRadius: '6px',
          textDecoration: 'none',
          fontFamily: 'var(--font-display)',
          fontSize: '0.95rem',
        }}
      >
        Ir al inicio
      </Link>
    </div>
  )
}
