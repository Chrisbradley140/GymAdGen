import { Card } from "@/components/ui/card";
import { Heart, MessageCircle, Share, Bookmark } from "lucide-react";

interface AdContent {
  headline?: string;
  body?: string;
  cta?: string;
  showImage?: boolean;
}

interface DeviceMockupsProps {
  adContent: AdContent;
  className?: string;
}

export const DeviceMockups = ({ adContent, className = "" }: DeviceMockupsProps) => {
  return (
    <div className={`flex flex-col lg:flex-row gap-8 items-center justify-center ${className}`}>
      {/* Desktop Mockup */}
      <div className="relative">
        <div className="w-80 h-64 bg-gray-900 rounded-lg p-4 shadow-2xl border border-gray-700">
          {/* Browser Header */}
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 bg-gray-800 rounded text-xs text-gray-400 px-2 py-1 ml-2">
              facebook.com/business
            </div>
          </div>
          
          {/* Facebook Feed */}
          <div className="space-y-3">
            {/* Post Header */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">F</span>
              </div>
              <div>
                <div className="text-white text-sm font-medium">FitnessStudio Pro</div>
                <div className="text-gray-400 text-xs">Sponsored</div>
              </div>
            </div>
            
            {/* Ad Content */}
            <div className="bg-gray-800 rounded-lg p-3 space-y-2">
              {adContent.showImage && (
                <div className="w-full h-20 bg-gradient-to-r from-primary/20 to-accent/20 rounded-md flex items-center justify-center">
                  <span className="text-white text-xs">Fitness Image</span>
                </div>
              )}
              
              {adContent.headline && (
                <div className="text-white font-semibold text-sm leading-tight">
                  {adContent.headline}
                </div>
              )}
              
              {adContent.body && (
                <div className="text-gray-300 text-xs leading-relaxed">
                  {adContent.body}
                </div>
              )}
              
              {adContent.cta && (
                <div className="pt-2">
                  <button className="bg-primary text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-primary/90 transition-colors">
                    {adContent.cta}
                  </button>
                </div>
              )}
            </div>
            
            {/* Engagement */}
            <div className="flex items-center justify-between text-gray-400 px-1">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs">24</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">8</span>
                </div>
                <Share className="w-4 h-4" />
              </div>
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
          Desktop
        </div>
      </div>

      {/* Mobile Mockup */}
      <div className="relative">
        <div className="w-48 h-80 bg-black rounded-3xl p-2 shadow-2xl">
          <div className="w-full h-full bg-gray-900 rounded-2xl p-3 relative overflow-hidden">
            {/* Phone Header */}
            <div className="flex justify-between items-center mb-3">
              <div className="text-white text-sm font-bold">Instagram</div>
              <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
            </div>
            
            {/* Story Preview */}
            <div className="relative w-full h-64 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden">
              {adContent.showImage && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30"></div>
              )}
              
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                {adContent.headline && (
                  <div className="text-white font-bold text-sm mb-2 leading-tight">
                    {adContent.headline}
                  </div>
                )}
                
                {adContent.body && (
                  <div className="text-white/90 text-xs mb-3 leading-relaxed">
                    {adContent.body.substring(0, 80)}...
                  </div>
                )}
                
                {adContent.cta && (
                  <button className="bg-white text-black px-3 py-1.5 rounded-full text-xs font-semibold self-start">
                    {adContent.cta}
                  </button>
                )}
              </div>
              
              {/* Story indicators */}
              <div className="absolute top-3 left-3 right-3 flex gap-1">
                <div className="flex-1 h-0.5 bg-white/30 rounded-full"></div>
                <div className="flex-1 h-0.5 bg-white rounded-full"></div>
                <div className="flex-1 h-0.5 bg-white/30 rounded-full"></div>
              </div>
            </div>
            
            {/* Bottom Actions */}
            <div className="flex justify-center mt-3">
              <div className="flex gap-4 text-gray-400">
                <Heart className="w-5 h-5" />
                <MessageCircle className="w-5 h-5" />
                <Share className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-2 -right-2 bg-pink-600 text-white px-2 py-1 rounded text-xs font-medium">
          Mobile
        </div>
      </div>
    </div>
  );
};