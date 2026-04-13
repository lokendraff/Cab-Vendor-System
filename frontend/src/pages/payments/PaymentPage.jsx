import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Zap, Building2, Rocket, Check, Shield, ArrowRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';

// Pricing Plans Config
const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 499,
    period: '/month',
    description: 'For small vendors managing a few cabs',
    icon: Zap,
    color: 'gray',
    features: [
      'Up to 10 Cabs',
      'Up to 10 Drivers',
      'Basic dashboard analytics',
      'Email support',
      'Document uploads'
    ],
    popular: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 1499,
    period: '/month',
    description: 'For growing fleets with compliance needs',
    icon: Building2,
    color: 'gold',
    features: [
      'Up to 50 Cabs',
      'Up to 50 Drivers',
      'AI Document Verification (OCR)',
      'Priority support',
      'Audit trail access',
      'Sub-vendor management',
      'Push notifications'
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 4999,
    period: '/month',
    description: 'For super vendors managing citywide networks',
    icon: Rocket,
    color: 'indigo',
    features: [
      'Unlimited Cabs & Drivers',
      'Full AI Verification Suite',
      'Dedicated account manager',
      'Custom integrations',
      'Vendor hierarchy (4 tiers)',
      'Advanced analytics & reports',
      'SLA & uptime guarantee',
      'White-label option'
    ],
    popular: false,
  },
];

const PaymentPage = () => {
  const [processing, setProcessing] = useState(null); // stores plan.id being processed
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Dynamically load Razorpay script only on the Payment page
  useEffect(() => {
    const scriptId = 'razorpay-checkout-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = async (plan) => {
    try {
      setProcessing(plan.id);

      // Step 1: Create Razorpay order on backend
      const { data } = await API.post(ENDPOINTS.PAYMENTS.CREATE_ORDER, {
        amount: plan.price
      });

      if (!data.success) {
        toast.error('Could not create order');
        return;
      }

      const order = data.data;

      // Step 2: Open Razorpay checkout modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: order.amount,
        currency: order.currency,
        name: 'FleetMaster SaaS',
        description: `${plan.name} Plan — Monthly Subscription`,
        order_id: order.id,
        handler: async function (response) {
          // Step 3: Verify payment on backend
          try {
            const verifyRes = await API.post(ENDPOINTS.PAYMENTS.VERIFY, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
              setPaymentSuccess(true);
              toast.success('🎉 Payment verified! Your plan is now active.');
            } else {
              toast.error('Payment verification failed');
            }
          } catch (err) {
            toast.error('Verification error. Contact support.');
          }
        },
        prefill: {
          name: 'Vendor User',
          email: 'vendor@fleetmaster.com',
        },
        theme: {
          color: '#d4a853',
          backdrop_color: 'rgba(10, 10, 15, 0.85)',
        },
        modal: {
          ondismiss: function () {
            toast('Payment cancelled', { icon: '⚠️' });
          }
        }
      };

      if (!window.Razorpay) {
        toast.error('Payment gateway failed to load. Please refresh.');
        return;
      }

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment initiation failed');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="p-6 md:p-10 relative">
      {/* Ambient glows */}
      <div className="absolute top-[-25%] left-[10%] w-[600px] h-[600px] bg-gold-500/[0.03] rounded-full blur-[180px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[5%] w-[400px] h-[400px] bg-indigo-900/[0.04] rounded-full blur-[140px] pointer-events-none"></div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-500/10 border border-gold-500/20 rounded-full mb-4">
          <Shield className="text-gold-400" size={14} />
          <span className="text-[10px] font-bold text-gold-400 uppercase tracking-[0.2em]">Secure Payments via Razorpay</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-wide text-white">
          Choose Your <span className="text-gold-gradient">Fleet Plan</span>
        </h1>
        <p className="text-gray-500 text-sm mt-3 max-w-lg mx-auto">
          Scale your vendor operations with the right plan. All plans include SSL encryption, 99.9% uptime, and 24/7 monitoring.
        </p>
      </motion.div>

      {/* Payment Success Banner */}
      {paymentSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 relative z-10"
        >
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <Check className="text-emerald-400" size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-400">Payment Successful!</p>
            <p className="text-xs text-gray-400">Your subscription is now active. Thank you for choosing FleetMaster.</p>
          </div>
        </motion.div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto relative z-10">
        {PLANS.map((plan, index) => {
          const Icon = plan.icon;
          const isGold = plan.color === 'gold';
          const isIndigo = plan.color === 'indigo';

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.1 }}
              className={`relative rounded-2xl p-6 md:p-7 flex flex-col transition-all duration-300 ${
                isGold
                  ? 'glass-panel-strong border-gold-500/30 golden-glow'
                  : 'glass-panel glass-panel-hover'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-to-r from-gold-400 to-gold-600 text-space-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-golden">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <div className={`p-2.5 rounded-xl border inline-block mb-4 ${
                  isGold ? 'bg-gold-500/10 border-gold-500/20' : isIndigo ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-white/[0.03] border-white/[0.06]'
                }`}>
                  <Icon size={22} className={
                    isGold ? 'text-gold-400' : isIndigo ? 'text-indigo-400' : 'text-gray-400'
                  } />
                </div>
                <h3 className="text-lg font-display font-bold text-white tracking-wide">{plan.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-xs text-gray-500">₹</span>
                <span className="text-4xl font-bold font-display text-white">{plan.price.toLocaleString('en-IN')}</span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check size={14} className={`shrink-0 mt-0.5 ${isGold ? 'text-gold-400' : 'text-gray-500'}`} />
                    <span className="text-xs text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handlePayment(plan)}
                disabled={processing === plan.id}
                className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 ${
                  isGold
                    ? 'btn-gold'
                    : 'border border-white/10 text-gray-300 hover:border-gold-500/30 hover:text-gold-400 hover:bg-gold-500/5'
                }`}
              >
                {processing === plan.id ? (
                  'Processing...'
                ) : (
                  <>
                    <CreditCard size={16} />
                    {isGold ? 'Get Started' : 'Select Plan'}
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Trust Badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 text-center relative z-10"
      >
        <div className="flex items-center justify-center gap-6 text-gray-600">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider">
            <Shield size={12} /> SSL Encrypted
          </div>
          <div className="w-px h-4 bg-white/[0.06]"></div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider">
            <CreditCard size={12} /> Razorpay Secured
          </div>
          <div className="w-px h-4 bg-white/[0.06]"></div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider">
            <Check size={12} /> Cancel Anytime
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentPage;
