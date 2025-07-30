
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const handleValueChange = (value: string) => {
    setOpenItems(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

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

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-secondary/10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-black mb-4">
            Frequently Asked <span className="bg-red-600 text-white px-3 py-1 rounded-lg transform -rotate-2 inline-block">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about FitnessAds.AI
          </p>
        </div>

        {/* Enhanced FAQ Accordion */}
        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-0 bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <AccordionTrigger 
                  className="px-8 py-6 text-left hover:no-underline hover:bg-secondary/20 transition-colors duration-200 [&[data-state=open]]:bg-secondary/30 [&>svg]:hidden"
                  onClick={() => handleValueChange(`item-${index}`)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg font-bold text-foreground pr-6 group-hover:text-primary transition-colors duration-200">
                      {faq.question}
                    </span>
                    <div className="flex-shrink-0 ml-auto">
                      {openItems.includes(`item-${index}`) ? (
                        <Minus className="h-6 w-6 text-primary transition-transform duration-200" />
                      ) : (
                        <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-8 pt-2">
                  <div className="bg-secondary/10 backdrop-blur-sm rounded-xl p-6 border border-border/20">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-1 h-full bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-foreground/90 leading-relaxed text-base font-medium">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
