
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
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about FitnessAds.AI
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="p-6 border-muted">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left"
              >
                <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="mt-4 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
