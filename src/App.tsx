import { useState, useEffect } from 'react';

const ADMINPASS = 'Qwerty12345';
const EXPIRYMS = 5 * 60 * 1000;
const SLOTS = [
  { h: 10, l: '10:00 AM' },
  { h: 11, l: '11:00 AM' },
  { h: 12, l: '12:00 PM' },
  { h: 14, l: '2:00 PM' },
  { h: 15, l: '3:00 PM' },
  { h: 16, l: '4:00 PM' },
  { h: 17, l: '5:00 PM' },
  { h: 18, l: '6:00 PM' },
  { h: 19, l: '7:00 PM' },
];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOWS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const OCCASIONS = ['Wedding Groom', 'Wedding Guest', 'Engagement', 'Reception', 'Formal Event', 'Eid Festival', 'Other'];
const OUTFITS = ['Sherwani', 'Kurta Set', 'Suit / Blazer', 'Jodhpuri', 'Casual Ethnic', 'Unsure / need guidance'];

const SCOL = { pending: '#b07c2a', confirmed: '#4a7c59', completed: '#7A7060', cancelled: '#9b3a3a', 'no-show': '#9b3a3a' };
const SBG = { pending: '#fdf5e6', confirmed: '#eaf3ed', completed: '#F7F2E8', cancelled: '#fdf0f0', 'no-show': '#fdf0f0' };
const C = {
  cream: '#F7F2E8', cream2: '#EFE8D8', cream3: '#E5DBCA', cream4: '#DDD3BE', gold: '#B8973A', goldLt: '#D4B05A', goldDk: '#8A6E28',
  ink: '#1C1710', inkMid: '#4A4232', inkLt: '#7A7060', border: 'rgba(184, 151, 58, 0.25)', border2: 'rgba(184, 151, 58, 0.12)',
  green: '#4a7c59', greenLt: '#eaf3ed', red: '#9b3a3a', redLt: '#fdf0f0', amber: '#b07c2a', amberLt: '#fdf5e6'
};

const SK = { b: 'bdhbk4', bl: 'bldhbl4' };
const stor = {
  load: async (k, d) => {
    try {
      const r = localStorage.getItem(k);
      return r ? JSON.parse(r).value : d;
    } catch { return d; }
  },
  save: async (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify({ value: v }));
    } catch { }
  }
};

const dk = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const uid = () => Math.random().toString(36).slice(2, 9).toUpperCase();
const expired = (b) => b.status === 'pending' && Date.now() > b.expiresAt;
const slotFree = (bks, bl, ds, h) => {
  if (bl.some(b => b.date === ds && b.hour === h)) return false;
  const bk = bks.find(b => b.date === ds && b.hour === h);
  return !bk || expired(bk) || bk.status === 'cancelled' || bk.status === 'no-show';
};
const countFree = (bks, bl, y, m, d) => {
  const ds = dk(y, m, d);
  const now = new Date();
  const isToday = now.getFullYear() === y && now.getMonth() === m && now.getDate() === d;
  return SLOTS.filter(s => {
    if (isToday && s.h <= now.getHours()) return false;
    return slotFree(bks, bl, ds, s.h);
  }).length;
};
const fmtDate = (ds) => {
  const [y, m, d] = ds.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};
const fmtShort = (ds) => {
  const [y, m, d] = ds.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const T = (s, extra = {}) => ({ fontFamily: 'Georgia, serif', fontWeight: 300, ...extra, fontSize: s });
const Lbl = ({ text }) => (
  <div style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.goldDk, marginBottom: 6 }}>{text}</div>
);
const Sbadge = ({ status }) => (
  <span style={{ padding: '2px 9px', background: SBG[status] || C.cream2, color: SCOL[status] || C.inkMid, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 1, whiteSpace: 'nowrap' }}>{status}</span>
);
const TimeLeft = ({ bk }) => {
  if (bk.status !== 'pending' || !bk.expiresAt) return null;
  const rem = Math.max(0, Math.ceil((bk.expiresAt - Date.now()) / 60000));
  return <span style={{ fontSize: 10, color: C.amber, marginLeft: 6 }}>{rem}m left</span>;
};
const Qa = ({ lbl, col, fn }) => (
  <button onClick={fn} style={{ padding: '4px 10px', border: \`1px solid \${col}40\`, background: \`\${col}12\`, color: col, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>{lbl}</button>
);
const Inp = ({ lbl, type, ph, value, onChange, min }) => (
  <div style={{ marginBottom: 14 }}>
    <Lbl text={lbl} />
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={ph} min={min} style={{ width: '100%', background: C.cream, border: 'none', borderBottom: \`1px solid \${C.border}\`, padding: '9px 0', fontSize: 13, color: C.ink, outline: 'none', fontFamily: 'inherit' }} />
  </div>
);
const Sel = ({ lbl, value, opts, onChange }) => (
  <div style={{ marginBottom: 14 }}>
    <Lbl text={lbl} />
    <select value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', background: C.cream, border: 'none', borderBottom: \`1px solid \${C.border}\`, padding: '9px 0', fontSize: 13, color: C.ink, outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
      <option value="">Select</option>
      {opts.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const BkActions = ({ bk, onUpdate }) => (
  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
    {bk.status === 'pending' && (
      <>
        <Qa lbl="Confirm" col={C.green} fn={() => onUpdate(bk.id, { status: 'confirmed', expiresAt: null })} />
        <Qa lbl="Cancel" col={C.red} fn={() => onUpdate(bk.id, { status: 'cancelled' })} />
      </>
    )}
    {bk.status === 'confirmed' && (
      <>
        <Qa lbl="Complete" col={C.goldDk} fn={() => onUpdate(bk.id, { status: 'completed' })} />
        <Qa lbl="No-show" col={C.inkLt} fn={() => onUpdate(bk.id, { status: 'no-show' })} />
        <Qa lbl="Cancel" col={C.red} fn={() => onUpdate(bk.id, { status: 'cancelled' })} />
      </>
    )}
    {(bk.status === 'cancelled' || bk.status === 'no-show') && (
      <Qa lbl="Restore" col={C.amber} fn={() => onUpdate(bk.id, { status: 'pending', expiresAt: Date.now() + EXPIRYMS })} />
    )}
    <a href={\`https://wa.me/\${bk.phone.replace(/[^0-9]/g, '')}?text=\${encodeURIComponent(\`Hi \${bk.name}, your consultation at Distressed Homme is confirmed for \${fmtDate(bk.date)} at \${bk.slotLabel}. See you there!\`)}\`} target="_blank" style={{ padding: '4px 10px', border: '1px solid rgba(37,211,102,0.35)', color: '#1a8a3a', fontSize: 9, textDecoration: 'none', letterSpacing: '0.08em' }}>WA</a>
  </div>
);

function UserView({ bks, bl, onBook, onAdmin }) {
  const now = new Date();
  const [vy, setVy] = useState(now.getFullYear());
  const [vm, setVm] = useState(now.getMonth());
  const [selDate, setSelDate] = useState(null);
  const [selSlot, setSelSlot] = useState(null);
  const [step, setStep] = useState('cal');
  const [form, setForm] = useState({ name: '', phone: '', email: '', occasion: '', outfit: '', eventDate: '', notes: '' });
  const [booking, setBooking] = useState(null);

  const prevM = () => { if (vy > now.getFullYear() || vm > now.getMonth()) { vm === 0 ? (setVm(11), setVy(vy - 1)) : setVm(vm - 1); } };
  const nextM = () => { vm === 11 ? (setVm(0), setVy(vy + 1)) : setVm(vm + 1); };

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const pickDate = (d) => {
    const dt = new Date(vy, vm, d);
    if (dt < todayStart || dt.getDay() === 0) return;
    setSelDate(dk(vy, vm, d));
    setSelSlot(null);
    setStep('cal');
  };

  const pickSlot = (s) => { setSelSlot(s); setStep('form'); };

  const reset = () => {
    setSelDate(null); setSelSlot(null); setStep('cal');
    setForm({ name: '', phone: '', email: '', occasion: '', outfit: '', eventDate: '', notes: '' });
    setBooking(null);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.occasion) return alert('Please fill required fields.');
    const ts = Date.now();
    const bk = { id: uid(), date: selDate, hour: selSlot.h, slotLabel: selSlot.l, ...form, status: 'pending', createdAt: ts, expiresAt: ts + EXPIRYMS };
    await onBook(bk);
    setBooking(bk);
    setStep('done');
  };

  const first = new Date(vy, vm, 1).getDay();
  const days = new Date(vy, vm + 1, 0).getDate();
  const calCells = [];
  for (let i = 0; i < first; i++) calCells.push(null);
  for (let d = 1; d <= days; d++) calCells.push(d);

  const nextSlot = (() => {
    let d = new Date(now);
    for (let i = 0; i < 30; i++) {
      if (d.getDay() !== 0) {
        const y = d.getFullYear(), m = d.getMonth(), dd = d.getDate();
        for (const s of SLOTS) {
          if (i === 0 && s.h <= now.getHours()) continue;
          if (slotFree(bks, bl, dk(y, m, dd), s.h)) {
            const lbl = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
            return \`\${lbl}, \${s.l}\`;
          }
        }
      }
      d.setDate(d.getDate() + 1);
    }
    return 'This week';
  })();

  const Panel = ({ children, style }) => (
    <div style={{ background: C.cream2, border: \`1px solid \${C.border}\`, borderRadius: 2, padding: 22, ...style }}>{children}</div>
  );
  const PTitle = ({ text }) => (
    <div style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.gold, marginBottom: 14 }}>{text}</div>
  );

  return (
    <div style={{ paddingBottom: 60 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ ...T(13, { fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.ink }) }}>Distressed Homme</div>
          <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.gold, marginTop: 2 }}>Bespoke Menswear · Kochi</div>
        </div>
        <button onClick={onAdmin} style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.inkLt, background: 'none', border: \`1px solid \${C.border}\`, cursor: 'pointer', padding: '6px 14px', fontFamily: 'inherit' }}>Admin</button>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.gold, marginBottom: 8 }}>Personal Consultation</div>
        <h1 style={{ ...T('clamp(26px, 3.5vw, 44px)', { color: C.ink, marginBottom: 10, lineHeight: 1.2 }) }}>Book your <em style={{ fontStyle: 'italic', color: C.goldDk }}>fitting</em> appointment</h1>
        <p style={{ fontSize: 12, color: C.inkMid, lineHeight: 1.8, maxWidth: 420, margin: '0 auto 12px' }}>A private 45-minute consultation at our MG Road boutique — just you and our designer.</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: C.cream2, border: \`1px solid \${C.border}\`, fontSize: 11, color: C.inkMid }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.green, display: 'inline-block' }}></span>
          Next available: <strong style={{ color: C.goldDk, fontWeight: 500 }}>{nextSlot}</strong>
        </div>
      </div>

      <div style={{ background: C.cream2, borderTop: \`1px solid \${C.border2}\`, borderBottom: \`1px solid \${C.border2}\`, padding: '11px 24px', display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 18 }}>
        {['45 min Private session', 'MG Road, Ernakulam', 'Mon - Sat only', 'Instant reservation'].map(t => (
          <span key={t} style={{ fontSize: 11, color: C.inkMid }}>{t}</span>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 50px', display: 'grid', gridTemplateColumns: '1fr 330px', gap: 16, alignItems: 'start' }}>
        <Panel>
          <PTitle text="Select a Date" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <button onClick={prevM} style={{ width: 28, height: 28, border: \`1px solid \${C.border}\`, background: 'none', cursor: 'pointer', color: C.inkMid, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
            <span style={{ ...T(17, { color: C.ink }) }}>{MONTHS[vm]} {vy}</span>
            <button onClick={nextM} style={{ width: 28, height: 28, border: \`1px solid \${C.border}\`, background: 'none', cursor: 'pointer', color: C.inkMid, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 3 }}>
            {DOWS.map(d => <div key={d} style={{ textAlign: 'center', fontSize: 9, letterSpacing: '0.1em', color: C.inkLt, paddingBottom: 5 }}>{d}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {calCells.map((d, i) => {
              if (!d) return <div key={i} />;
              const dt = new Date(vy, vm, d);
              const isPast = dt < todayStart, isSun = dt.getDay() === 0;
              const ds = dk(vy, vm, d), isSel = selDate === ds;
              const avail = isPast || isSun ? 0 : countFree(bks, bl, vy, vm, d);
              const dotCol = avail === 0 ? null : avail <= 2 ? C.amber : C.green;
              return (
                <div key={i} onClick={() => pickDate(d)} style={{ aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 11, cursor: isPast || isSun ? 'default' : 'pointer', border: \`1px solid \${isSel ? C.gold : 'transparent'}\`, background: isSel ? C.gold : 'transparent', color: isSel ? C.cream : (isPast || isSun ? \`\${C.inkMid}40\` : C.inkMid), borderRadius: 1, position: 'relative' }}>
                  {d}
                  {dotCol && <div style={{ position: 'absolute', bottom: 2, width: 4, height: 4, borderRadius: '50%', background: dotCol }} />}
                </div>
              );
            })}
          </div>
        </Panel>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {step === 'cal' && (
            <Panel>
              <PTitle text="Select a Time" />
              {!selDate ? <div style={{ textAlign: 'center', padding: '20px 12px', color: C.inkLt, fontSize: 12 }}>Pick a date to see slots.</div> : (
                <div>
                  <div style={{ ...T(15, { color: C.ink, marginBottom: 12 }) }}>{fmtDate(selDate)}</div>
                  {SLOTS.map(slot => {
                    const isToday = selDate === dk(now.getFullYear(), now.getMonth(), now.getDate());
                    const isFree = (!isToday || slot.h > now.getHours()) && slotFree(bks, bl, selDate, slot.h);
                    return (
                      <button key={slot.h} disabled={!isFree} onClick={() => pickSlot(slot)} style={{ width: '100%', marginBottom: 5, padding: '8px', border: \`1px solid \${C.border}\`, background: isFree ? C.cream : C.cream3, color: isFree ? C.inkMid : \`\${C.inkMid}40\`, cursor: isFree ? 'pointer' : 'default' }}>{slot.l}</button>
                    );
                  })}
                </div>
              )}
            </Panel>
          )}

          {step === 'form' && (
            <Panel>
              <PTitle text="Confirm Appointment" />
              <Inp lbl="Full Name" type="text" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} />
              <Inp lbl="WhatsApp Number" type="tel" value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))} />
              <Sel lbl="Occasion" value={form.occasion} opts={OCCASIONS} onChange={v => setForm(p => ({ ...p, occasion: v }))} />
              <button onClick={handleSubmit} style={{ width: '100%', padding: '11px', background: C.gold, color: C.cream, border: 'none', cursor: 'pointer' }}>Reserve Slot</button>
            </Panel>
          )}

          {step === 'done' && booking && (
            <Panel style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, color: C.gold, marginBottom: 10 }}>✓</div>
              <div style={{ ...T(18, { color: C.ink, marginBottom: 4 }) }}>Slot reserved!</div>
              <button onClick={reset} style={{ padding: '9px 18px', border: \`1px solid \${C.border}\`, background: 'none', cursor: 'pointer' }}>New Booking</button>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminLogin({ onSuccess, onBack }) {
  const [pass, setPass] = useState('');
  const submit = () => pass === ADMINPASS ? onSuccess() : (alert('Wrong password'), setPass(''));
  return (
    <div style={{ minHeight: '100vh', background: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: C.cream2, padding: 40, width: 320, textAlign: 'center' }}>
        <Lbl text="Password" />
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} style={{ width: '100%', marginBottom: 20 }} />
        <button onClick={submit} style={{ width: '100%', padding: 10, background: C.gold, color: C.cream }}>Sign In</button>
        <button onClick={onBack} style={{ marginTop: 10 }}>Back</button>
      </div>
    </div>
  );
}

function AdminView({ bks, onUpdate, onLogout }) {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1>Admin Portal</h1>
        <button onClick={onLogout}>Logout</button>
      </div>
      {bks.map(bk => (
        <div key={bk.id} style={{ padding: 10, borderBottom: '1px solid #ccc' }}>
          {bk.name} - {bk.date} @ {bk.slotLabel} ({bk.status})
          <BkActions bk={bk} onUpdate={onUpdate} />
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState('user');
  const [bks, setBks] = useState([]);
  const [bl, setBl] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([stor.load(SK.b, []), stor.load(SK.bl, [])]).then(([b, l]) => {
      setBks(b); setBl(l); setReady(true);
    });
  }, []);

  const addBk = async (bk) => { const u = [...bks, bk]; setBks(u); await stor.save(SK.b, u); };
  const updBk = async (id, ch) => { const u = bks.map(b => b.id === id ? { ...b, ...ch } : b); setBks(u); await stor.save(SK.b, u); };

  if (!ready) return <div>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: C.cream }}>
      {screen === 'user' && <UserView bks={bks} bl={bl} onBook={addBk} onAdmin={() => setScreen('login')} />}
      {screen === 'login' && <AdminLogin onSuccess={() => setScreen('admin')} onBack={() => setScreen('user')} />}
      {screen === 'admin' && <AdminView bks={bks} onUpdate={updBk} onLogout={() => setScreen('user')} />}
    </div>
  );
}
