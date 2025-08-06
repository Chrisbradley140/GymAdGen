import { Check, X, ArrowDown } from "lucide-react";

const ComparisonTable = () => {
  const comparisonData = [
    {
      oldWay: "Wait weeks on an agency",
      newWay: "Instant ads, made for you"
    },
    {
      oldWay: "Copy & Paste Canva Ads", 
      newWay: "Bold, original, on-brand ads"
    },
    {
      oldWay: "£2k/month retainers",
      newWay: "£39/month, cancel anytime"
    },
    {
      oldWay: "Zero ROAS tracking",
      newWay: "Built-in performance tracking"
    },
    {
      oldWay: "Generic GPT tools",
      newWay: "Trained on real fitness ad data"
    },
    {
      oldWay: "Waste precious time and money on sh*tty agencies",
      newWay: "Access to elite agency-level strategies & copy"
    }
  ];

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 font-klein">
            <span className="block md:inline">Old way vs FitnessAds.ai</span>
            <br className="md:hidden" />
            <span className="md:ml-2">
              <span 
                className="inline-block px-4 py-2 rounded-xl text-white font-black"
                style={{ backgroundColor: '#FF5440' }}
              >
                New AI method
              </span>
            </span>
          </h2>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {/* Old Way Column */}
            <div className="space-y-4 relative">
              <h3 className="text-2xl font-bold mb-6 text-center font-klein text-white">Old Way</h3>
              {/* Vertical line connecting all boxes */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-20 bottom-20 w-0.5 bg-red-400 z-0"></div>
              {comparisonData.map((item, index) => (
                <div key={index} className="p-4 rounded-lg w-[85%] max-w-xs mx-auto relative z-10" style={{ backgroundColor: '#FF5440' }}>
                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#FFFFFF' }} />
                    <p className="font-medium" style={{ color: '#FFFFFF' }}>{item.oldWay}</p>
                  </div>
                </div>
              ))}
              {/* Arrow pointing down */}
              <div className="flex justify-center py-4 relative z-10">
                <ArrowDown className="w-8 h-8" style={{ color: '#FF5440' }} />
              </div>
              <div className="p-6 rounded-xl text-center w-[85%] max-w-xs mx-auto relative z-10" style={{ backgroundColor: '#FF5440' }}>
                <p className="font-bold text-lg" style={{ color: '#FFFFFF' }}>🔥 BURNED CASH AND WASTED TIME</p>
              </div>
            </div>

            {/* FitnessAds.ai Column */}
            <div className="space-y-4 relative">
              <h3 className="text-2xl font-bold mb-6 text-center font-klein text-white">FitnessAds.ai</h3>
              {/* Vertical line connecting all boxes */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-20 bottom-20 w-0.5 bg-green-400 z-0"></div>
              {comparisonData.map((item, index) => (
                <div key={index} className="p-4 rounded-lg w-[85%] max-w-xs mx-auto relative z-10" style={{ backgroundColor: '#00DD7B' }}>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#242229' }} />
                    <p className="font-medium" style={{ color: '#242229' }}>{item.newWay}</p>
                  </div>
                </div>
              ))}
              {/* Arrow pointing down */}
              <div className="flex justify-center py-4 relative z-10">
                <ArrowDown className="w-8 h-8" style={{ color: '#00DD7B' }} />
              </div>
              <div className="p-6 rounded-xl text-center w-[85%] max-w-xs mx-auto relative z-10" style={{ backgroundColor: '#00DD7B' }}>
                <p className="font-bold text-lg" style={{ color: '#242229' }}>🤑 RECORD-BREAKING MONTHS AND PROFITS</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Stacked */}
        <div className="md:hidden space-y-8">
          {/* Old Way Mobile */}
          <div className="space-y-4 relative">
            <h3 className="text-xl font-bold mb-4 text-center font-klein text-white">Old Way</h3>
            {/* Vertical line connecting all boxes */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-16 bottom-16 w-0.5 bg-red-400 z-0"></div>
            {comparisonData.map((item, index) => (
              <div key={index} className="p-4 rounded-lg w-[85%] max-w-xs mx-auto relative z-10" style={{ backgroundColor: '#FF5440' }}>
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#FFFFFF' }} />
                  <p className="font-medium" style={{ color: '#FFFFFF' }}>{item.oldWay}</p>
                </div>
              </div>
            ))}
            {/* Arrow pointing down */}
            <div className="flex justify-center py-4 relative z-10">
              <ArrowDown className="w-8 h-8" style={{ color: '#FF5440' }} />
            </div>
            <div className="p-6 rounded-xl text-center w-[85%] max-w-xs mx-auto relative z-10" style={{ backgroundColor: '#FF5440' }}>
              <p className="font-bold text-lg" style={{ color: '#FFFFFF' }}>🔥 BURNED CASH AND WASTED TIME</p>
            </div>
          </div>

          {/* FitnessAds.ai Mobile */}
          <div className="space-y-4 relative">
            <h3 className="text-xl font-bold mb-4 text-center font-klein text-white">FitnessAds.ai</h3>
            {/* Vertical line connecting all boxes */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-16 bottom-16 w-0.5 bg-green-400 z-0"></div>
            {comparisonData.map((item, index) => (
              <div key={index} className="p-4 rounded-lg w-[85%] max-w-xs mx-auto relative z-10" style={{ backgroundColor: '#00DD7B' }}>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#242229' }} />
                  <p className="font-medium" style={{ color: '#242229' }}>{item.newWay}</p>
                </div>
              </div>
            ))}
            {/* Arrow pointing down */}
            <div className="flex justify-center py-4 relative z-10">
              <ArrowDown className="w-8 h-8" style={{ color: '#00DD7B' }} />
            </div>
            <div className="p-6 rounded-xl text-center w-[85%] max-w-xs mx-auto relative z-10" style={{ backgroundColor: '#00DD7B' }}>
              <p className="font-bold text-lg" style={{ color: '#242229' }}>🤑 RECORD-BREAKING MONTHS AND PROFITS</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;