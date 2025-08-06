import { Check, X } from "lucide-react";

const ComparisonTable = () => {
  const comparisonData = [
    {
      oldWay: "Generic copywriting formulas that every coach uses",
      newWay: "AI trained on $200M+ of real fitness ad data"
    },
    {
      oldWay: "Trial and error with your ad budget", 
      newWay: "Proven templates from 7-figure fitness businesses"
    },
    {
      oldWay: "Hiring expensive copywriters or agencies",
      newWay: "Generate unlimited ads in 20 seconds"
    },
    {
      oldWay: "ChatGPT generic responses for any industry",
      newWay: "Purpose-built for fitness psychology & buyer behavior"
    },
    {
      oldWay: "Months of A/B testing to find what works",
      newWay: "Skip straight to the winners with proven frameworks"
    },
    {
      oldWay: "Copying competitors and hoping for the best",
      newWay: "Access to elite agency-level strategies & copy"
    }
  ];

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 font-klein">
            Old way vs FitnessAds.ai
            <br />
            <span 
              className="inline-block px-4 py-2 rounded-xl text-white font-black"
              style={{ backgroundColor: '#FF5440' }}
            >
              New AI method
            </span>
          </h2>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Old Way Column */}
            <div className="space-y-4">
              <div className="p-6 rounded-xl text-center" style={{ backgroundColor: '#FF5440' }}>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#FFFFFF' }}>Old Way</h3>
              </div>
              {comparisonData.map((item, index) => (
                <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: '#FF5440' }}>
                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#FFFFFF' }} />
                    <p className="font-medium" style={{ color: '#FFFFFF' }}>{item.oldWay}</p>
                  </div>
                </div>
              ))}
              <div className="p-6 rounded-xl text-center" style={{ backgroundColor: '#FF5440' }}>
                <p className="font-bold text-lg" style={{ color: '#FFFFFF' }}>🔥 BURNED CASH AND WASTED TIME</p>
              </div>
            </div>

            {/* FitnessAds.ai Column */}
            <div className="space-y-4">
              <div className="p-6 rounded-xl text-center" style={{ backgroundColor: '#00DD7B' }}>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#242229' }}>FitnessAds.ai</h3>
              </div>
              {comparisonData.map((item, index) => (
                <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: '#00DD7B' }}>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#242229' }} />
                    <p className="font-medium" style={{ color: '#242229' }}>{item.newWay}</p>
                  </div>
                </div>
              ))}
              <div className="p-6 rounded-xl text-center" style={{ backgroundColor: '#00DD7B' }}>
                <p className="font-bold text-lg" style={{ color: '#242229' }}>🥇 RECORD-BREAKING MONTHS AND PROFITS</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Stacked */}
        <div className="md:hidden space-y-8">
          {/* Old Way Mobile */}
          <div className="space-y-4">
            <div className="p-6 rounded-xl text-center" style={{ backgroundColor: '#FF5440' }}>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#FFFFFF' }}>Old Way</h3>
            </div>
            {comparisonData.map((item, index) => (
              <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: '#FF5440' }}>
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#FFFFFF' }} />
                  <p className="font-medium" style={{ color: '#FFFFFF' }}>{item.oldWay}</p>
                </div>
              </div>
            ))}
            <div className="p-6 rounded-xl text-center" style={{ backgroundColor: '#FF5440' }}>
              <p className="font-bold text-lg" style={{ color: '#FFFFFF' }}>🔥 BURNED CASH AND WASTED TIME</p>
            </div>
          </div>

          {/* FitnessAds.ai Mobile */}
          <div className="space-y-4">
            <div className="p-6 rounded-xl text-center" style={{ backgroundColor: '#00DD7B' }}>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#242229' }}>FitnessAds.ai</h3>
            </div>
            {comparisonData.map((item, index) => (
              <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: '#00DD7B' }}>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#242229' }} />
                  <p className="font-medium" style={{ color: '#242229' }}>{item.newWay}</p>
                </div>
              </div>
            ))}
            <div className="p-6 rounded-xl text-center" style={{ backgroundColor: '#00DD7B' }}>
              <p className="font-bold text-lg" style={{ color: '#242229' }}>🥇 RECORD-BREAKING MONTHS AND PROFITS</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;