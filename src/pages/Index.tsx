import { motion } from "framer-motion";
import { Church, Cross, Heart, Users } from "lucide-react";
import heroImage from "@/assets/hero-church.jpg";
import ChurchRegistrationForm from "@/components/ChurchRegistrationForm";
import PricingProducts from "@/components/PricingProducts";

const features = [
  {
    icon: Church,
    title: "Gerencie sua Igreja",
    desc: "Cadastre e organize todas as informações da sua comunidade.",
  },
  {
    icon: Users,
    title: "Conecte Membros",
    desc: "Mantenha contato com todos os fiéis da sua congregação.",
  },
  {
    icon: Heart,
    title: "Fortaleça a Fé",
    desc: "Ferramentas para aproximar sua igreja da comunidade.",
  },
];

import { useState } from "react";

const Index = () => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedPlanName, setSelectedPlanName] = useState<string | null>(null);

  console.log("Index selectedPlanId:", selectedPlanId);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Interior de igreja com luz dourada"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-hero-overlay/75" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Cross className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-4 leading-tight">
              Cadastre sua <span className="text-gradient-gold">Igreja</span>
            </h1>
            <p className="text-lg md:text-xl font-body text-primary-foreground/80 max-w-xl mx-auto">
              Uma plataforma para pastores registrarem e gerenciarem suas
              igrejas com simplicidade e fé.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <a
              href="#produtos"
              className="inline-block gradient-gold text-primary-foreground font-body font-semibold px-8 py-3 rounded-lg shadow-gold hover:opacity-90 transition-opacity"
            >
              Começar Agora
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card rounded-xl p-6 text-center border border-border hover:shadow-gold/20 hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 rounded-full gradient-gold flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2 text-foreground">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground font-body">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Products & Pricing Section */}
      <div id="produtos">
        <PricingProducts
          selectedId={selectedPlanId}
          onSelect={(id, name) => {
            setSelectedPlanId(id);
            setSelectedPlanName(name);
          }}
        />
      </div>

      {/* Registration Form */}
      <section id="cadastro" className="py-24 px-4 bg-background">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl border border-border p-8 md:p-10 shadow-lg"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">
                Cadastro de Igreja
              </h2>
              <p className="text-muted-foreground font-body">
                {selectedPlanName ? (
                  <span className="text-primary font-bold">
                    Plano selecionado: {selectedPlanName}
                  </span>
                ) : (
                  "Preencha os dados abaixo para registrar sua conta e sua igreja"
                )}
              </p>
            </div>
            <ChurchRegistrationForm
              selectedPlanId={selectedPlanId}
              selectedPlanName={selectedPlanName}
            />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Cross className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold text-foreground">
              IgrejaOnline
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-body">
            © 2026 IgrejaOnline. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
