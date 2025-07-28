
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

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
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about FitnessAds.AI
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <Card 
              key={index} 
              className={`overflow-hidden transition-all duration-300 hover:shadow-lg border-2 ${
                openIndex === index 
                  ? 'border-primary/30 bg-primary/5' 
                  : 'border-muted hover:border-primary/20'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-8 flex justify-between items-center text-left group transition-all duration-200 hover:bg-primary/5"
              >
                <h3 className="text-xl font-bold pr-6 group-hover:text-primary transition-colors">
                  {faq.question}
                </h3>
                <div className={`flex-shrink-0 transition-all duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}>
                  <ChevronDown className="w-6 h-6 text-primary" />
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-8 pb-8 text-muted-foreground leading-relaxed text-lg">
                  {faq.answer}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
