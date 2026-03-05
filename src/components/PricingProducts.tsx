import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Zap, ShieldCheck, Gem } from "lucide-react";
import { Button } from "./ui/button";

const iconMap: Record<string, any> = {
  Zap,
  ShieldCheck,
  Gem,
};

const PricingProducts = ({
  onSelect,
  selectedId,
}: {
  onSelect?: (id: string, name: string) => void;
  selectedId?: string | null;
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/planos")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Dados recebidos não são um array:", data);
          setProducts([]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar planos:", err);
        setProducts([]);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground animate-pulse font-body">
          Carregando planos...
        </p>
      </div>
    );
  }

  return (
    <section className="py-24 px-4 bg-muted/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4"
          >
            Nossos <span className="text-gradient-gold">Produtos</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground font-body max-w-2xl mx-auto"
          >
            Escolha o plano que melhor se adapta às necessidades da sua igreja e
            comece a gerenciar com fé e eficiência.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => {
                onSelect?.(product.id, product.name);
                document
                  .getElementById("cadastro")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`relative bg-card rounded-3xl p-8 border shadow-xl transition-all duration-500 cursor-pointer group ${
                product.id === selectedId
                  ? "ring-4 ring-gold border-transparent scale-105 z-20 shadow-gold/20"
                  : product.popular
                    ? "ring-2 ring-primary/50 border-transparent scale-100 z-10 hover:shadow-gold/10"
                    : "border-border hover:border-gold/50"
              }`}
            >
              {product.id === selectedId && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg animate-bounce">
                  Plano Selecionado
                </div>
              )}
              {product.popular && product.id !== selectedId && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Mais Popular
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`p-3 rounded-2xl ${product.popular ? "gradient-gold text-primary-foreground" : "bg-muted text-primary"}`}
                >
                  {(() => {
                    const Icon = iconMap[product.icon] || Zap;
                    return <Icon className="w-6 h-6" />;
                  })()}
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-foreground">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-display font-bold text-foreground">
                    {product.price}
                  </span>
                  {product.period && (
                    <span className="text-muted-foreground font-body">
                      {product.period}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {product.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-foreground/80 font-body"
                  >
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full font-body font-semibold py-6 rounded-xl transition-all ${
                  product.popular
                    ? "gradient-gold text-primary-foreground shadow-gold hover:opacity-90"
                    : "variant-outline hover:bg-muted"
                }`}
                onClick={() => {
                  onSelect?.(product.id, product.name);
                  document
                    .getElementById("cadastro")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {product.id === selectedId
                  ? "Plano Selecionado"
                  : `Selecionar ${product.name}`}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingProducts;
