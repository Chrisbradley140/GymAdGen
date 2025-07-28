
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What exactly is FitnessAds.ai?",
      answer: "FitnessAds.ai is your AI-powered ad campaign engine built specifically for fitness businesses. It creates proven, psychology-backed ad campaigns in 90 seconds, tailored to your offer, location, tone, and audience. No guesswork. No generic GPT fluff. Just unicorn-level ads that convert."
    },
    {
      question: "Who is it for?",
      answer: "If you're an online coach, gym owner, personal trainer, or niche fitness expert (think: menopause, pre/postnatal, rehab, etc.) making £2k/month+ and ready to grow — this is for you. It's not for hobbyists, side hustlers, or anyone who wants to \"see if it works.\""
    },
    {
      question: "What kind of ads can it generate?",
      answer: "FitnessAds.ai generates campaign-ready ad packs based on your business type, offer, and campaign goal. These include: Lead gen campaigns to grow your list, Book-a-call flows for high-ticket offers, Local domination campaigns for studios & gyms, Reactivation & win-back strategies, Seasonal launch campaigns (like Jan, Back to School, Black Friday), Brand-building & POV-style content ads."
    },
    {
      question: "How is this different from ChatGPT or Meta's AI tools?",
      answer: "They give you a horse with a cone on its head. We built the unicorn. FitnessAds.ai is trained on £100k/month of real ad spend, not scraped data. It's built with fitness-specific campaign logic, seasonal intelligence, and deep buyer psychology. Every output is brand-personalised, not cookie-cutter crap."
    },
    {
      question: "Do I need to be tech-savvy to use it?",
      answer: "Not at all. It's designed for fitness business owners, not tech bros. The onboarding flow is simple, the UI is clean, and every campaign is delivered ready to copy, tweak, or deploy."
    },
    {
      question: "Can I use this with my current ads team or VA?",
      answer: "100%. Use FitnessAds.ai to brief your team, speed up creative, and eliminate the \"blank page\" problem. Agencies love it. VAs look like pros. You stay in control without being in the weeds."
    },
    {
      question: "Does this replace my ad agency?",
      answer: "That depends. If your agency's smashing it — this will make them faster. If they're winging it or using templates... FitnessAds.ai is the replacement. Need full service? Tap the Done-For-You Ad Management option inside."
    },
    {
      question: "What if I'm not running ads yet?",
      answer: "Perfect. Start right. No wasting budget on bad creative. We'll give you plug-and-play campaigns to launch strong and learn fast. Think of it as your secret weapon from day one."
    },
    {
      question: "How do I know it'll work for my business?",
      answer: "Because it's not one-size-fits-all. Your input powers the output: business type, offer, niche, tone, goals, and location. You'll get campaigns that speak directly to your market. And if you're unsure, try it once. It'll earn its place."
    },
    {
      question: "Is there a free trial or refund policy?",
      answer: "We offer a low-cost entry campaign pack so you can try it with zero risk. No commitment, just ROI. If you want to scale, you'll know in 90 seconds."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-6 bg-secondary/10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about FitnessAds.AI
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
                openIndex === index ? 'ring-2 ring-primary/20 shadow-md' : ''
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left hover:bg-secondary/20 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-primary transition-transform duration-300 flex-shrink-0 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6">
                  <div className="border-l-4 border-primary/30 pl-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Still have questions? We're here to help.
          </p>
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
