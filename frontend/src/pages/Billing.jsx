import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, Building2, Cpu, TrendingUp, Wifi, Shield, Clock } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

const PLANS = [
  {
    id: 'essential',
    name: 'Essential',
    desc: 'Ideal for local delivery partners',
    monthlyPrice: 149,
    yearlyPrice: 99,
    features: [
      'Up to 10 Vehicles',
      'Standard Dispatching',
      'Basic Reporting',
      'Email Support',
    ],
    color: '#94a3b8',
    cta: 'Get Started',
    popular: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    desc: 'Optimized for growing fleet operators',
    monthlyPrice: 399,
    yearlyPrice: 299,
    features: [
      'Unlimited Vehicles',
      'Real-time Dispatching',
      'Predictive Analytics',
      'Multi-Vendor Management',
      '24/7 Priority Support',
    ],
    color: '#3b82f6',
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    desc: 'Custom solutions for global logistics',
    monthlyPrice: null,
    yearlyPrice: null,
    features: [
      'Custom SLA & Uptime',
      'Full API Access',
      'Custom Security Audit',
      'Dedicated Account Manager',
    ],
    color: '#8b5cf6',
    cta: 'Contact Sales',
    popular: false,
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'Dynamic Re-routing',
    desc: 'Our platform adjusts routes every 15 seconds based on traffic density, weather, and fleet availability.',
    color: '#3b82f6',
    large: false,
  },
  {
    icon: Cpu,
    title: 'AI Forecasting',
    desc: 'Predicts demand surges up to 4 hours in advance with 94.5% accuracy.',
    color: '#8b5cf6',
    large: true,
  },
  {
    icon: Shield,
    title: '99.99% Uptime',
    desc: "Our kinetic engine resync every 15 seconds for mission-critical operations where every second counts.",
    color: '#10b981',
    large: false,
  },
  {
    icon: Wifi,
    title: 'Seamless Integration',
    desc: 'Works out-of-the-box with leading vehicle telemetry and CRM systems.',
    color: '#f59e0b',
    large: false,
  },
];

export default function Billing() {
  const [yearly, setYearly] = useState(false);

  return (
    <AppLayout pageTitle="Billing">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 48, paddingTop: 16 }}
        >
          <div className="section-label" style={{ color: '#3b82f6', marginBottom: 14 }}>Scale Your Fleet</div>
          <h1 style={{ fontSize: 40, fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: 14 }}>
            Engineered for{' '}
            <span style={{ background: 'linear-gradient(135deg, #60a5fa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Kinetic
            </span>
            <br />Performance
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            Choose the plan that powers your logistics ecosystem. From single-vendor startups to global enterprise dispatch networks.
          </p>

          {/* Toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 28, padding: '8px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: 100, border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: 13, color: yearly ? '#64748b' : '#f1f5f9', fontWeight: 600 }}>Monthly</span>
            <button
              onClick={() => setYearly(p => !p)}
              style={{
                width: 44, height: 24, borderRadius: 100,
                background: yearly ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                border: 'none', cursor: 'pointer', position: 'relative',
                transition: 'background 0.25s',
              }}
            >
              <div style={{
                position: 'absolute', top: 3, left: yearly ? 23 : 3,
                width: 18, height: 18, borderRadius: '50%', background: 'white',
                transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
              }} />
            </button>
            <span style={{ fontSize: 13, color: yearly ? '#f1f5f9' : '#64748b', fontWeight: 600 }}>
              Yearly
              <span style={{ marginLeft: 6, padding: '2px 8px', borderRadius: 100, background: 'rgba(16,185,129,0.15)', color: '#10b981', fontSize: 10, fontWeight: 700 }}>
                Save 25%
              </span>
            </span>
          </div>
        </motion.div>

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 16, marginBottom: 64, alignItems: 'start' }}>
          {PLANS.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{
                borderRadius: 16, overflow: 'hidden',
                border: `1px solid ${plan.popular ? plan.color + '60' : 'rgba(255,255,255,0.08)'}`,
                background: plan.popular ? `linear-gradient(135deg, rgba(13,18,33,0.9), rgba(59,130,246,0.08))` : 'rgba(17,24,39,0.8)',
                boxShadow: plan.popular ? `0 0 32px rgba(59,130,246,0.15)` : 'none',
                transform: plan.popular ? 'scale(1.03)' : 'scale(1)',
                position: 'relative',
              }}
            >
              {plan.popular && (
                <div style={{
                  background: '#3b82f6', color: 'white',
                  textAlign: 'center', padding: '6px 0',
                  fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
                }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{ padding: '28px 26px' }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: plan.color, marginBottom: 4 }}>{plan.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{plan.desc}</div>
                </div>

                {plan.monthlyPrice ? (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                      <span style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>₹</span>
                      <span style={{ fontSize: 42, fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.04em', lineHeight: 1 }}>
                        {yearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>/mo</span>
                    </div>
                    {yearly && (
                      <div style={{ fontSize: 11, color: '#10b981', marginTop: 4, fontWeight: 600 }}>
                        Save ₹{(plan.monthlyPrice - plan.yearlyPrice) * 12}/year
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 36, fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.03em' }}>Custom</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Contact for pricing</div>
                  </div>
                )}

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8' }}>
                      <CheckCircle size={13} color={plan.color} style={{ flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  id={`plan-${plan.id}`}
                  style={{
                    width: '100%', padding: '11px',
                    borderRadius: 10, border: `1px solid ${plan.popular ? 'transparent' : plan.color + '40'}`,
                    background: plan.popular ? `linear-gradient(135deg, #3b82f6, #1d4ed8)` : 'transparent',
                    color: plan.popular ? 'white' : plan.color,
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s',
                    boxShadow: plan.popular ? '0 0 20px rgba(59,130,246,0.25)' : 'none',
                  }}
                  onMouseEnter={e => !plan.popular && (e.currentTarget.style.background = plan.color + '15')}
                  onMouseLeave={e => !plan.popular && (e.currentTarget.style.background = 'transparent')}
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ textAlign: 'center', marginBottom: 32 }}
        >
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.03em', marginBottom: 8 }}>
            Unrivaled Operational Depth
          </h2>
          <p style={{ fontSize: 13, color: '#64748b' }}>Powering the next generation of fleet mobility.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 48 }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="glass-card glass-card-hover"
                style={{
                  padding: '22px',
                  background: f.large ? `linear-gradient(135deg, rgba(${f.color === '#8b5cf6' ? '139,92,246' : '59,130,246'},0.15), rgba(${f.color === '#8b5cf6' ? '139,92,246' : '59,130,246'},0.05))` : undefined,
                  border: f.large ? `1px solid rgba(${f.color === '#8b5cf6' ? '139,92,246' : '59,130,246'},0.3)` : undefined,
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: f.color + '20',
                  border: `1px solid ${f.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 14,
                }}>
                  <Icon size={18} color={f.color} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={14} color="#3b82f6" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>FleetControl</span>
            <span style={{ fontSize: 11, color: '#64748b' }}>© 2025 Kinetic Machine Inc.</span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service', 'Documentation', 'Status'].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: '#64748b', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.target.style.color = '#94a3b8'}
                onMouseLeave={e => e.target.style.color = '#64748b'}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
