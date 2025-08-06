import { Check, X } from "lucide-react";

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
                <div key={index} className="rounded-lg" style={{ 
                  backgroundColor: '#FF5440',
                  width: '496px',
                  height: '96px',
                  padding: '20px 16px',
                  borderRadius: '8px'
                }}>
                  <div className="flex items-start" style={{ gap: '16px' }}>
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
                <div key={index} className="rounded-lg" style={{ 
                  backgroundColor: '#00DD7B',
                  width: '496px',
                  height: '96px',
                  padding: '20px 16px',
                  borderRadius: '8px'
                }}>
                  <div className="flex items-start" style={{ gap: '16px' }}>
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#242229' }} />
                    <p className="font-medium" style={{ color: '#242229' }}>{item.newWay}</p>
                  </div>
                </div>
              ))}
              <div className="p-6 rounded-xl text-center" style={{ backgroundColor: '#00DD7B' }}>
                <p className="font-bold text-lg" style={{ color: '#242229' }}>🤑 RECORD-BREAKING MONTHS AND PROFITS</p>
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
              <div key={index} className="rounded-lg" style={{ 
                backgroundColor: '#FF5440',
                width: '496px',
                height: '96px',
                padding: '20px 16px',
                borderRadius: '8px'
              }}>
                <div className="flex items-start" style={{ gap: '16px' }}>
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
              <div key={index} className="rounded-lg" style={{ 
                backgroundColor: '#00DD7B',
                width: '496px',
                height: '96px',
                padding: '20px 16px',
                borderRadius: '8px'
              }}>
                <div className="flex items-start" style={{ gap: '16px' }}>
                  <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#242229' }} />
                  <p className="font-medium" style={{ color: '#242229' }}>{item.newWay}</p>
                </div>
              </div>
            ))}
            <div className="p-6 rounded-xl text-center" style={{ backgroundColor: '#00DD7B' }}>
              <p className="font-bold text-lg" style={{ color: '#242229' }}>🤑 RECORD-BREAKING MONTHS AND PROFITS</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;