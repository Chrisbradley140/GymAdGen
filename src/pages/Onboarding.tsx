
import React from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingWizard from '@/components/OnboardingWizard';

const Onboarding = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/');
  };

  return <OnboardingWizard onComplete={handleComplete} />;
};

export default Onboarding;
