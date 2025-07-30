
import PerformanceBlock from "./PerformanceBlock";

const ResultsShowcase = () => {
  const performanceData = [
    {
      title: "Weight Loss Challenge",
      stats: [
        { label: "Leads", value: "327", dateRange: "7 days" },
        { label: "Calls Booked", value: "89", dateRange: "7 days" },
        { label: "Sign-ups", value: "43", dateRange: "7 days" },
        { label: "Revenue", value: "£2.1k", dateRange: "7 days" }
      ],
      fbMetrics: {
        costPerLead: "£4.32",
        amountSpent: "£1,412.64"
      }
    },
    {
      title: "Strength Training Program",
      stats: [
        { label: "Leads", value: "189", dateRange: "5 days" },
        { label: "Calls Booked", value: "67", dateRange: "5 days" },
        { label: "Conversions", value: "31", dateRange: "5 days" },
        { label: "Revenue", value: "£1.8k", dateRange: "5 days" }
      ],
      fbMetrics: {
        costPerLead: "£3.89",
        amountSpent: "£735.21"
      }
    },
    {
      title: "Nutrition Coaching",
      stats: [
        { label: "Leads", value: "412", dateRange: "10 days" },
        { label: "Calls Booked", value: "124", dateRange: "10 days" },
        { label: "Sign-ups", value: "78", dateRange: "10 days" },
        { label: "Revenue", value: "£3.9k", dateRange: "10 days" }
      ],
      fbMetrics: {
        costPerLead: "£2.97",
        amountSpent: "£1,223.64"
      }
    },
    {
      title: "Transformation Challenge",
      stats: [
        { label: "Leads", value: "298", dateRange: "6 days" },
        { label: "Calls Booked", value: "95", dateRange: "6 days" },
        { label: "Conversions", value: "52", dateRange: "6 days" },
        { label: "Revenue", value: "£2.6k", dateRange: "6 days" }
      ],
      fbMetrics: {
        costPerLead: "£3.67",
        amountSpent: "£1,093.66"
      }
    }
  ];

  return (
    <section className="py-12 px-4 bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            The Ads That Print Money Every Season.
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-6">
            From Black Friday to the New Year Waitlist – the exact campaigns that built fitness empires are now built into FitnessAds.ai.
          </p>
          <h3 className="text-xl font-bold text-white mb-6">Results Like This:</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {performanceData.map((block, index) => (
            <PerformanceBlock
              key={index}
              title={block.title}
              stats={block.stats}
              fbMetrics={block.fbMetrics}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsShowcase;
