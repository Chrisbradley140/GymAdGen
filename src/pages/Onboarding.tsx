
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OnboardingWizard from '@/components/OnboardingWizard';

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is retaking the quiz from brand setup
  const retakeQuiz = location.state?.retakeQuiz || false;

  const handleComplete = () => {
    navigate('/');
  };

  return <OnboardingWizard onComplete={handleComplete} retakeQuiz={retakeQuiz} />;
};

export default Onboarding;
