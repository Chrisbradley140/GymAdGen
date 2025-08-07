
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OnboardingWizard from '@/components/OnboardingWizard';

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const forceRestart = location.state?.forceRestart || false;

  const handleComplete = () => {
    navigate('/dashboard');
  };

  return <OnboardingWizard onComplete={handleComplete} forceRestart={forceRestart} />;
};

export default Onboarding;
