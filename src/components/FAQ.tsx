
import { useState } from "react";
import { ChevronDown, Plus, Minus } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does the AI generate fitness ads?",
      answer: "Our AI is specifically trained on high-converting fitness ads and marketing copy. It analyzes your input and creates compelling hooks, body copy, and CTAs that resonate with your target audience."
    },
    {
      question: "Can I customize the generated ads?",
      answer: "Yes! You can edit and refine any generated ad copy. The AI provides a strong foundation that you can customize to match your brand voice and specific offers."
    },
    {
      question: "What types of fitness businesses does this work for?",
      answer: "It works for personal trainers, gym owners, nutrition coaches, online fitness coaches, yoga instructors, and any fitness professional looking to improve their ad performance."
    },
    {
      question: "How much does it cost?",
      answer: "We're currently offering free lifetime access to the first 50 early users. After that, it will be $97/month. Lock in your free spot now!"
    },
    {
      question: "Do I need marketing experience to use this?",
      answer: "Not at all! The tool is designed for fitness professionals, not marketers. Simply input your service details and let the AI handle the copywriting expertise."
    },
    {
      question: "How long does it take to generate an ad?",
      answer: "Most ads are generated in under 30 seconds. You'll have professional-quality copy ready to use almost instantly."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background to-background/80">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
            FAQ
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
            Got <span className="text-gradient">Questions?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to the most common questions about FitnessAds.AI
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid gap-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl border border-border/50 transition-all duration-300 hover:border-primary/20 ${
                openIndex === index ? 'bg-primary/5 border-primary/30' : 'bg-card/50 hover:bg-card/80'
              }`}
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <button
                onClick={() => toggleFAQ(index)}
                className="relative w-full p-8 text-left transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition-colors pr-6">
                    {faq.question}
                  </h3>
                  
                  <div className="flex-shrink-0 relative">
                    {openIndex === index ? (
                      <Minus className="w-6 h-6 text-primary transition-transform duration-300" />
                    ) : (
                      <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-all duration-300" />
                    )}
                  </div>
                </div>
              </button>
              
              {/* Answer with smooth animation */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-8 pb-8">
                  <div className="w-12 h-px bg-gradient-to-r from-primary to-transparent mb-6"></div>
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Still have questions? We're here to help.
          </p>
          <button className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-primary to-red-500 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
