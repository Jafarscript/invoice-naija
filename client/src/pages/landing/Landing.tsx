import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";

const features = [
  {
    icon: "📄",
    title: "Professional Invoices",
    description:
      "Create clean, professional invoices in seconds with your business branding and bank details.",
  },
  {
    icon: "👥",
    title: "Client Management",
    description:
      "Keep all your client details in one place. Never lose a contact or miss a follow-up again.",
  },
  {
    icon: "📊",
    title: "Track Payments",
    description:
      "Know exactly who has paid and who owes you. Track draft, sent, paid and overdue invoices.",
  },
  {
    icon: "📥",
    title: "PDF Download",
    description:
      "Download any invoice as a clean PDF and send it to your clients via WhatsApp or email.",
  },
  {
    icon: "💰",
    title: "Earnings Dashboard",
    description:
      "See your total earnings, paid invoices and unpaid invoices at a glance on your dashboard.",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    description:
      "Your data is yours alone. Every account is protected with JWT authentication and encryption.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your account",
    description:
      "Sign up in seconds with your name, email and business name. No credit card required.",
  },
  {
    number: "02",
    title: "Add your clients",
    description:
      "Add your clients once and reuse them across multiple invoices. Keep their details organized.",
  },
  {
    number: "03",
    title: "Create and send invoices",
    description:
      "Build your invoice, add line items and download a PDF to send to your client instantly.",
  },
];

const testimonials = [
  {
    name: "Chisom Okafor",
    role: "Freelance Graphic Designer, Lagos",
    avatar: "CO",
    text: "Before InvoiceNaija I was sending invoices as WhatsApp screenshots. Now my clients take me more seriously and I actually know who has paid me.",
  },
  {
    name: "Emeka Adeyemi",
    role: "Web Developer, Abuja",
    avatar: "EA",
    text: "The PDF invoices look so professional. My clients keep asking what tool I use. It has genuinely helped me close more deals.",
  },
  {
    name: "Fatima Bello",
    role: "Event Planner, Port Harcourt",
    avatar: "FB",
    text: "I used to chase clients for payment with no record. Now I just send the invoice link and everything is tracked. Game changer for my business.",
  },
];

const faqs = [
  {
    question: "Is InvoiceNaija free to use?",
    answer:
      "Yes. InvoiceNaija is completely free to use. Create your account and start invoicing your clients today with no hidden charges.",
  },
  {
    question: "Can I use InvoiceNaija on my phone?",
    answer:
      "Absolutely. InvoiceNaija is fully responsive and works on any device — phone, tablet or desktop.",
  },
  {
    question: "How do I get paid through InvoiceNaija?",
    answer:
      "Add your bank details in Settings and they appear automatically on every invoice PDF. Your clients pay directly to your bank account.",
  },
  {
    question: "Can my clients see my other invoices?",
    answer:
      "No. Every account is completely private. Your clients only see the PDF you send them — nothing else.",
  },
  {
    question: "Can I manage multiple clients?",
    answer:
      "Yes. You can add unlimited clients and create as many invoices as you need for each one.",
  },
];

const Landing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
    const { user } = useAuth();
  

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-emerald-950 to-slate-900 text-white">
      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-6 md:px-16 py-5 sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
        <h1 className="text-xl font-bold text-emerald-400">InvoiceNaija</h1>
        {user ? <div className="flex items-center gap-3">
            <Link to='/dashboard' className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition">Dashbaord</Link>
            <h3 className="text-lg text-white">Hi, {user.name}</h3>

        </div> : <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-slate-300 hover:text-white text-sm transition px-4 py-2"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            Get Started Free
          </Link>
        </div>}
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 md:px-16 py-24 md:py-36 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-emerald-500/10 via-transparent to-emerald-500/10 pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Built for Nigerian Freelancers & Small Businesses
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
          Stop Sending Invoices{" "}
          <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            on WhatsApp
          </span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          InvoiceNaija helps you create professional invoices, manage your
          clients and track payments — all in one place. Free, fast and built
          for Nigeria.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto bg-linear-330-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white font-semibold px-8 py-4 rounded-xl transition text-center text-lg"
          >
            Start Invoicing Free →
          </Link>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl transition text-center text-lg"
          >
            See How it Works
          </a>
        </div>

        <p className="text-slate-500 text-sm mt-6">
          No credit card required • Free forever
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-20">
          {[
            { value: "100%", label: "Free to use" },
            { value: "PDF", label: "Invoice download" },
            { value: "🔒", label: "Secure & private" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-4"
            >
              <p className="text-2xl font-bold text-emerald-400">
                {stat.value}
              </p>
              <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 md:px-16 py-24 bg-linear-to-b from-transparent to-slate-900/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to{" "}
            <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              get paid faster
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Built specifically for Nigerian freelancers and small businesses who
            are tired of informal payment processes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-linear-to-br from-white/5 to-white/2 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition group"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-emerald-400 transition">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it Works ── */}
      <section id="how-it-works" className="px-6 md:px-16 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Up and running in{" "}
            <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              3 simple steps
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            No complicated setup. No long tutorials. Just sign up and start
            invoicing your clients today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {/* Connector line on desktop */}
          <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-linear-to-r from-emerald-500/50 to-teal-500/50" />

          {steps.map((step) => (
            <div key={step.number} className="text-center relative">
              <div className="w-20 h-20 bg-linear-to-br from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">
                  {step.number}
                </span>
              </div>
              <h3 className="font-semibold text-lg mb-3">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            to="/register"
            className="inline-block bg-linear-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white font-semibold px-8 py-4 rounded-xl transition text-lg"
          >
            Get Started for Free →
          </Link>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="px-6 md:px-16 py-24 bg-linear-to-b from-transparent to-slate-900/80">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nigerians are already{" "}
            <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              getting paid faster
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            See what freelancers and small business owners across Nigeria are
            saying about InvoiceNaija.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-linear-to-br from-white/5 to-white/2 border border-white/10 rounded-2xl p-6 flex flex-col gap-4"
            >
              <p className="text-slate-300 text-sm leading-relaxed flex-1">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 md:px-16 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently asked{" "}
            <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              questions
            </span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-linear-to-br from-white/5 to-white/2 border border-white/10 rounded-2xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-medium text-sm md:text-base">
                  {faq.question}
                </span>
                <span
                  className={`text-emerald-400 text-xl transition-transform duration-300 shrink-0 ml-4 ${
                    openFaq === index ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>

              {openFaq === index && (
                <div className="px-6 pb-5">
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 md:px-16 py-24">
        <div className="max-w-4xl mx-auto bg-linear-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to get paid like a professional?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Join thousands of Nigerian freelancers and small business owners who
            are already using InvoiceNaija to manage their invoices and get paid
            faster.
          </p>
          <Link
            to="/register"
            className="inline-block bg-linear-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white font-bold px-10 py-4 rounded-xl transition text-lg"
          >
            Create Free Account →
          </Link>
          <p className="text-slate-500 text-sm mt-4">
            No credit card required • Free forever
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 md:px-16 py-10 border-t border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl mx-auto">
          <div>
            <h1 className="text-emerald-400 font-bold text-xl mb-1">
              InvoiceNaija
            </h1>
            <p className="text-slate-500 text-sm">
              Built for Nigerian freelancers and small businesses.
            </p>
          </div>

          <div className="flex items-center gap-6 text-slate-400 text-sm">
            <Link to="/login" className="hover:text-white transition">
              Login
            </Link>
            <Link to="/register" className="hover:text-white transition">
              Register
            </Link>
            <a href="#how-it-works" className="hover:text-white transition">
              How it Works
            </a>
          </div>

          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} InvoiceNaija. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
