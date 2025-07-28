
import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
                  openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
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
