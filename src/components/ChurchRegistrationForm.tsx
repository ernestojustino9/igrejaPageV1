import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Church,
  User,
  CheckCircle,
  Mail,
  Lock,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import StepIndicator from "./StepIndicator";
import { toast } from "@/hooks/use-toast";

const stepLabels = ["Conta", "Igreja", "Finalizar"];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

interface ChurchRegistrationFormProps {
  selectedPlanId?: string | null;
  selectedPlanName?: string | null;
}

const ChurchRegistrationForm = ({
  selectedPlanId,
  selectedPlanName,
}: ChurchRegistrationFormProps) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    churchName: "",
    pastorName: "",
    address: "",
    city: "",
    phone: "",
    members: "",
    description: "",
  });
  const [municipios, setMunicipios] = useState<any[]>([]);
  const [completed, setCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/api/municipios/listar")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMunicipios(data);
        } else {
          console.error("Dados de municípios não são um array:", data);
          setMunicipios([]);
        }
      })
      .catch((err) => console.error("Erro ao buscar municípios:", err));
  }, []);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.email || !formData.password) {
        toast({
          title: "Preencha todos os campos obrigatórios",
          variant: "destructive",
        });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast({ title: "As senhas não coincidem", variant: "destructive" });
        return;
      }

      // Validação de E-mail Único
      setIsLoading(true);
      fetch(`http://localhost:3001/api/user/check-email/${formData.email}`)
        .then(async (res) => {
          if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "E-mail já cadastrado");
          }
          setDirection(1);
          setStep((s) => s + 1);
        })
        .catch((err) => {
          toast({
            title: "Erro de validação",
            description: err.message,
            variant: "destructive",
          });
        })
        .finally(() => setIsLoading(false));
      return; // O avanço é controlado pelo fetch
    }
    if (step === 2) {
      if (!formData.churchName || !formData.pastorName) {
        toast({
          title: "Preencha o nome da igreja e do pastor",
          variant: "destructive",
        });
        return;
      }
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleFinalize = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3001/api/user/progressive-registration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            pastorName: formData.pastorName,
            churchName: formData.churchName,
            address: formData.address,
            city: formData.city,
            phone: formData.phone,
            members: formData.members,
            description: formData.description,
            planoId: selectedPlanId,
            plano: selectedPlanName,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar igreja");
      }

      setCompleted(true);
      toast({ title: "Igreja cadastrada com sucesso! 🎉" });
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (completed) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
        </motion.div>
        <h2 className="text-3xl font-display font-bold mb-3 text-foreground">
          Cadastro Concluído!
        </h2>
        <p className="text-muted-foreground font-body text-lg mb-2">
          A igreja{" "}
          <strong className="text-foreground">{formData.churchName}</strong> foi
          cadastrada.
        </p>
        <p className="text-muted-foreground font-body">
          Pastor {formData.pastorName} • {formData.email}
        </p>
        <Button
          className="mt-8 gradient-gold text-primary-foreground shadow-gold font-body font-semibold px-8"
          onClick={() => {
            setCompleted(false);
            setStep(1);
            setFormData({
              email: "",
              password: "",
              confirmPassword: "",
              churchName: "",
              pastorName: "",
              address: "",
              city: "",
              phone: "",
              members: "",
              description: "",
            });
          }}
        >
          Cadastrar outra igreja
        </Button>
      </motion.div>
    );
  }

  return (
    <div>
      <StepIndicator currentStep={step} totalSteps={3} labels={stepLabels} />

      <div className="min-h-[320px] relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {step === 1 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      Dados da Conta
                    </h3>
                    <p className="text-sm text-muted-foreground font-body">
                      Crie sua conta de pastor
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-body flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" /> E-mail *
                  </Label>
                  <Input
                    type="email"
                    placeholder="pastor@email.com"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-body flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" /> Senha *
                  </Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    className="font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-body flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" /> Confirmar Senha *
                  </Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      updateField("confirmPassword", e.target.value)
                    }
                    className="font-body"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
                    <Church className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      Dados da Igreja
                    </h3>
                    <p className="text-sm text-muted-foreground font-body">
                      Informações sobre sua igreja
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-body flex items-center gap-2">
                      <Church className="w-4 h-4 text-primary" /> Nome da Igreja
                      *
                    </Label>
                    <Input
                      placeholder="Igreja Batista Central"
                      value={formData.churchName}
                      onChange={(e) =>
                        updateField("churchName", e.target.value)
                      }
                      className="font-body"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" /> Nome do Pastor *
                    </Label>
                    <Input
                      placeholder="Pastor João Silva"
                      value={formData.pastorName}
                      onChange={(e) =>
                        updateField("pastorName", e.target.value)
                      }
                      className="font-body"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> Endereço
                    </Label>
                    <Input
                      placeholder="Rua das Flores, 123"
                      value={formData.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      className="font-body"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> Município
                    </Label>
                    <select
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background font-body text-sm"
                    >
                      <option value="">Selecione um município</option>
                      {municipios.map((m) => (
                        <option key={m.id} value={m.nome}>
                          {m.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" /> Telefone
                    </Label>
                    <Input
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="font-body"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" /> Nº de Membros
                    </Label>
                    <Input
                      placeholder="150"
                      value={formData.members}
                      onChange={(e) => updateField("members", e.target.value)}
                      className="font-body"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-body">Descrição da Igreja</Label>
                  <Textarea
                    placeholder="Conte um pouco sobre sua igreja..."
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="font-body min-h-[80px]"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      Confirmar Dados
                    </h3>
                    <p className="text-sm text-muted-foreground font-body">
                      Revise as informações antes de finalizar
                    </p>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-5 space-y-3">
                  <h4 className="font-display font-semibold text-foreground">
                    Conta
                  </h4>
                  <p className="text-sm text-muted-foreground font-body">
                    {formData.email}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-5 space-y-3">
                  <h4 className="font-display font-semibold text-foreground">
                    Igreja
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm font-body">
                    <span className="text-muted-foreground">Nome:</span>
                    <span className="text-foreground">
                      {formData.churchName}
                    </span>
                    <span className="text-muted-foreground">Pastor:</span>
                    <span className="text-foreground">
                      {formData.pastorName}
                    </span>
                    {formData.city && (
                      <>
                        <span className="text-muted-foreground">Cidade:</span>
                        <span className="text-foreground">{formData.city}</span>
                      </>
                    )}
                    {formData.phone && (
                      <>
                        <span className="text-muted-foreground">Telefone:</span>
                        <span className="text-foreground">
                          {formData.phone}
                        </span>
                      </>
                    )}
                    {formData.members && (
                      <>
                        <span className="text-muted-foreground">Membros:</span>
                        <span className="text-foreground">
                          {formData.members}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 1}
          className="font-body"
        >
          Voltar
        </Button>
        {step < 3 ? (
          <Button
            onClick={nextStep}
            className="gradient-gold text-primary-foreground shadow-gold font-body font-semibold px-8"
          >
            Próximo
          </Button>
        ) : (
          <Button
            onClick={handleFinalize}
            disabled={isLoading}
            className="gradient-gold text-primary-foreground shadow-gold font-body font-semibold px-8"
          >
            {isLoading ? "Processando..." : "Finalizar Cadastro"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChurchRegistrationForm;
