import { useEffect, useState } from "react";

interface CountdownTimerProps {
  seconds: number;
  isActive: boolean;
  onComplete?: () => void;
}

export const CountdownTimer = ({ seconds, isActive, onComplete }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(seconds);
      return;
    }

    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, onComplete, seconds]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-black/80 backdrop-blur-sm rounded-lg px-6 py-3 border border-primary/30">
        <div className="text-center">
          <div className="text-sm text-white/70 font-medium mb-1">Campaign Building</div>
          <div className="text-3xl font-bold text-primary font-mono">
            {formatTime(timeLeft)}
          </div>
          <div className="text-xs text-white/50 mt-1">
            {isActive ? "Generating..." : "Ready to build"}
          </div>
        </div>
      </div>
    </div>
  );
};