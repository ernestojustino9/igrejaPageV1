import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

const StepIndicator = ({ currentStep, totalSteps, labels }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isCompleted = currentStep > step;
        const isActive = currentStep === step;

        return (
          <div key={step} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  isCompleted
                    ? "gradient-gold text-primary-foreground"
                    : isActive
                    ? "border-2 border-primary text-primary"
                    : "border-2 border-muted text-muted-foreground"
                }`}
                initial={false}
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step}
              </motion.div>
              <span className={`text-xs font-body ${isActive ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                {labels[i]}
              </span>
            </div>
            {i < totalSteps - 1 && (
              <div className={`w-12 h-0.5 mb-5 ${isCompleted ? "gradient-gold" : "bg-muted"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
