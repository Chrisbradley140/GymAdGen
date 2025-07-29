
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, stepTitles }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Step Indicators */}
        <div className="flex justify-between mt-4">
          {Array.from({ length: totalSteps }, (_, i) => {
            const stepNumber = i + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            
            return (
              <div key={stepNumber} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary text-white scale-110 shadow-lg' 
                      : isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white/20 text-white/60'
                  }`}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <span className={`text-xs mt-2 text-center max-w-20 ${
                  isActive ? 'text-white font-semibold' : 'text-white/60'
                }`}>
                  {stepTitles[i].split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Current Step Info */}
      <div className="text-center">
        <span className="text-sm text-primary font-semibold">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
    </div>
  );
};

export default StepIndicator;
