import ThemeToggleHeader from '@/components/ThemeToggleHeader'
import NotificationBell from '@/components/NotificationBell'
import FeedList from '@/components/FeedList'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        height: '56px',
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3710.15 601.67"
          style={{ height: '30px', width: 'auto', color: 'var(--text)', display: 'block' }}>
          <defs>
            <style>{`.lt1{fill:currentColor}.lt2{fill:none;stroke:currentColor;stroke-linecap:round;stroke-miterlimit:10;stroke-width:18px}`}</style>
          </defs>
          <circle className="lt1" cx="453.5" cy="32.36" r="22.3"/>
          <ellipse className="lt2" cx="453.5" cy="300.84" rx="69.23" ry="192.29"/>
          <line className="lt2" x1="624.03" y1="389.74" x2="283.1" y2="389.74"/>
          <line className="lt2" x1="261.21" y1="300.84" x2="644.21" y2="300.84"/>
          <line className="lt2" x1="283.1" y1="211.66" x2="621.82" y2="211.66"/>
          <circle className="lt2" cx="453.5" cy="300.84" r="192.29"/>
          <ellipse className="lt2" cx="599.94" cy="300.84" rx="146.44" ry="192.29"/>
          <ellipse className="lt2" cx="638.55" cy="300.84" rx="185.05" ry="242.99"/>
          <ellipse className="lt2" cx="675.75" cy="300.84" rx="222.25" ry="291.84"/>
          <ellipse className="lt2" cx="307.06" cy="300.84" rx="146.44" ry="192.29"/>
          <ellipse className="lt2" cx="268.45" cy="300.84" rx="185.05" ry="242.99"/>
          <ellipse className="lt2" cx="231.25" cy="300.84" rx="222.25" ry="291.84"/>
          <path className="lt1" d="M1186.53,406.92c-74.76,0-125.03-27.38-125.03-90.81v-117.93h23.43v118.45c0,40.8,33.43,68.7,102.66,68.7,56.33,0,98.45-22.9,98.45-65.02v-122.14h23.43v120.82c0,57.91-47.38,87.92-122.93,87.92Z"/>
          <path className="lt1" d="M1542.68,337.16h-128.72v66.6h-23.16v-205.58h153.2c62.91,0,86.6,24.22,86.6,70.28,0,51.07-32.64,68.7-87.92,68.7ZM1542.16,219.23h-128.19v96.87h127.67c52.91,0,65.28-17.11,65.28-48.17s-15.79-48.7-64.75-48.7Z"/>
          <path className="lt1" d="M1662.72,403.76h-26.85l135.83-205.58h26.32l134.25,205.58h-26.59l-37.64-56.33h-168.47l-36.85,56.33ZM1796.71,236.87l-12.63-20.79-12.63,20.79-59.49,88.97h143.72l-58.96-88.97Z"/>
          <path className="lt1" d="M2191.55,403.76l-191.63-175.84v175.84h-23.16v-205.58h26.59l192.42,176.89v-176.89h22.11v205.58h-26.32Z"/>
          <path className="lt1" d="M2303.43,403.76v-205.58h23.95v205.58h-23.95Z"/>
          <path className="lt1" d="M2627.47,403.76l-191.63-175.84v175.84h-23.16v-205.58h26.59l192.42,176.89v-176.89h22.11v205.58h-26.32Z"/>
          <path className="lt1" d="M2739.34,403.76v-205.58h233.22v21.85h-210.32v68.7h205.84v21.58h-205.84v71.33h212.69v22.11h-235.59Z"/>
          <path className="lt1" d="M3320.56,403.76h-32.38l-76.86-184.52-77.65,184.52h-31.85l-101.34-205.58h26.32l91.34,186.37,78.18-186.37h30.27l77.92,186.37,91.34-186.37h24.48l-99.76,205.58Z"/>
          <path className="lt1" d="M3583.8,406.92c-90.55,0-131.35-22.64-139.78-68.44h25.53c6.58,35.01,44.22,46.86,115.29,46.86,74.76,0,100.55-15.79,100.55-38.7,0-34.48-55.54-37.38-112.4-41.06-60.02-3.95-121.61-8.69-121.61-52.12,0-31.85,31.59-58.7,121.61-58.7s123.46,29.48,131.88,61.86h-26.59c-7.63-22.9-40.01-40.01-106.61-40.01s-96.08,13.42-96.08,35.27c0,27.64,51.59,29.75,106.34,33.17,62.12,4.21,128.19,10.79,128.19,60.02,0,39.22-35.8,61.86-126.35,61.86Z"/>
        </svg>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <NotificationBell />
          <ThemeToggleHeader />
        </div>
      </header>

      <div style={{
        textAlign: 'center',
        padding: '16px 0 4px',
        color: 'var(--accent-warm)',
        fontSize: '0.9rem',
        letterSpacing: '0.4em',
      }}>
        ✦ ✦ ✦
      </div>

      <main style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '12px 16px 100px',
      }}>
        <FeedList />
      </main>
    </div>
  )
}
