import jsPDF from 'jspdf';
import { CampaignWithContent } from '@/hooks/useCampaigns';
import { supabase } from '@/integrations/supabase/client';

// App color scheme (converting from HSL to RGB for jsPDF)
const APP_COLORS = {
  primary: [255, 85, 0], // hsl(13 100% 50%) -> #FF5500
  background: [36, 34, 41], // hsl(258 8% 14%) -> #242229
  foreground: [248, 250, 252], // hsl(210 40% 98%) -> #F8FAFC
  secondary: [42, 55, 68], // hsl(217.2 32.6% 17.5%) -> #2A3744
  muted: [166, 173, 187], // hsl(215 20.2% 65.1%) -> #A6ADBB
  accent: [255, 85, 0], // Same as primary
  border: [42, 55, 68], // Same as secondary
};

// Function to fetch user's logo
const fetchUserLogo = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('user_onboarding')
      .select('logo_url')
      .eq('user_id', userId)
      .single();

    if (error || !data?.logo_url) return null;
    return data.logo_url;
  } catch (error) {
    console.error('Error fetching user logo:', error);
    return null;
  }
};

// Function to convert image URL to base64 for PDF embedding
const imageToBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = url;
  });
};

export const generateCampaignPDF = async (campaign: CampaignWithContent, userId?: string) => {
  // Create new PDF instance
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Fetch user logo if available
  let logoBase64: string | null = null;
  if (userId) {
    const logoUrl = await fetchUserLogo(userId);
    if (logoUrl) {
      try {
        logoBase64 = await imageToBase64(logoUrl);
      } catch (error) {
        console.warn('Could not load logo image:', error);
      }
    }
  }

  // Helper function to add text with proper wrapping
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false, color: number[] = APP_COLORS.foreground) => {
    pdf.setFontSize(fontSize);
    pdf.setTextColor(color[0], color[1], color[2]);
    if (isBold) {
      pdf.setFont('helvetica', 'bold');
    } else {
      pdf.setFont('helvetica', 'normal');
    }
    
    const lines = pdf.splitTextToSize(text, maxWidth);
    const lineHeight = fontSize * 0.4;
    
    // Check if we need a new page
    if (yPosition + (lines.length * lineHeight) > pageHeight - margin - 20) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.text(lines, margin, yPosition);
    yPosition += lines.length * lineHeight + 5;
  };

  // Add colored background to the entire page
  pdf.setFillColor(APP_COLORS.background[0], APP_COLORS.background[1], APP_COLORS.background[2]);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Add header with gradient-like effect using primary color
  pdf.setFillColor(APP_COLORS.primary[0], APP_COLORS.primary[1], APP_COLORS.primary[2]);
  pdf.rect(0, 0, pageWidth, 50, 'F');
  
  // Add darker overlay for depth
  pdf.setFillColor(APP_COLORS.primary[0] * 0.8, APP_COLORS.primary[1] * 0.8, APP_COLORS.primary[2] * 0.8);
  pdf.rect(0, 40, pageWidth, 10, 'F');

  // Add logo if available
  if (logoBase64) {
    try {
      pdf.addImage(logoBase64, 'PNG', margin, 10, 30, 30);
    } catch (error) {
      console.warn('Could not add logo to PDF:', error);
    }
  }

  // Add title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  const titleX = logoBase64 ? margin + 40 : margin;
  pdf.text('Campaign Export', titleX, 25);
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Professional Ad Campaign Report', titleX, 35);
  
  yPosition = 70;

  // Add decorative border
  pdf.setDrawColor(APP_COLORS.primary[0], APP_COLORS.primary[1], APP_COLORS.primary[2]);
  pdf.setLineWidth(2);
  pdf.rect(margin - 5, 60, maxWidth + 10, pageHeight - 80, 'S');

  // Campaign basic info section
  pdf.setFillColor(APP_COLORS.secondary[0], APP_COLORS.secondary[1], APP_COLORS.secondary[2]);
  pdf.rect(margin, yPosition, maxWidth, 25, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Campaign Overview', margin + 10, yPosition + 15);
  yPosition += 35;

  addText(`Campaign Name: ${campaign.name}`, 14, true, APP_COLORS.primary);
  
  if (campaign.description) {
    addText(`Description: ${campaign.description}`, 12, false, APP_COLORS.foreground);
  }
  
  addText(`Created: ${new Date(campaign.created_at).toLocaleDateString()}`, 11, false, APP_COLORS.muted);
  addText(`Offer Type: ${campaign.offer_type || 'Not specified'}`, 11, false, APP_COLORS.muted);
  addText(`Tone Style: ${campaign.tone_style || 'Not specified'}`, 11, false, APP_COLORS.muted);
  
  yPosition += 15;

  // Add content sections
  const contentSections = [
    { key: 'campaign_name', title: 'Campaign Name Content', icon: '📝' },
    { key: 'headline', title: 'Headlines', icon: '💡' },
    { key: 'ad_caption', title: 'Ad Captions', icon: '📢' },
    { key: 'ig_story', title: 'Instagram Story Content', icon: '📱' },
    { key: 'creative_prompt', title: 'Creative Prompts', icon: '🎨' }
  ];

  contentSections.forEach(section => {
    const content = campaign.content[section.key];
    if (content && content.content) {
      // Section header with colored background
      pdf.setFillColor(APP_COLORS.accent[0] * 0.2, APP_COLORS.accent[1] * 0.2, APP_COLORS.accent[2] * 0.2);
      pdf.rect(margin, yPosition, maxWidth, 20, 'F');
      
      pdf.setTextColor(APP_COLORS.primary[0], APP_COLORS.primary[1], APP_COLORS.primary[2]);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${section.icon} ${section.title}`, margin + 10, yPosition + 13);
      yPosition += 30;
      
      try {
        // Try to parse JSON content
        const parsedContent = typeof content.content === 'string' 
          ? JSON.parse(content.content) 
          : content.content;
        
        if (Array.isArray(parsedContent)) {
          parsedContent.forEach((item: any, index: number) => {
            if (typeof item === 'string') {
              addText(`${index + 1}. ${item}`, 11, false, APP_COLORS.foreground);
            } else if (typeof item === 'object') {
              // Handle object content
              Object.entries(item).forEach(([key, value]) => {
                if (typeof value === 'string') {
                  addText(`${key}: ${value}`, 11, false, APP_COLORS.foreground);
                }
              });
            }
          });
        } else if (typeof parsedContent === 'object') {
          Object.entries(parsedContent).forEach(([key, value]) => {
            if (typeof value === 'string') {
              addText(`${key}: ${value}`, 11, false, APP_COLORS.foreground);
            }
          });
        } else {
          addText(String(parsedContent), 11, false, APP_COLORS.foreground);
        }
      } catch (e) {
        // If not JSON, treat as plain text
        addText(String(content.content), 11, false, APP_COLORS.foreground);
      }
      
      yPosition += 10;
    }
  });

  // Add footer with branding
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    
    // Footer background
    pdf.setFillColor(APP_COLORS.secondary[0], APP_COLORS.secondary[1], APP_COLORS.secondary[2]);
    pdf.rect(0, pageHeight - 25, pageWidth, 25, 'F');
    
    pdf.setFontSize(10);
    pdf.setTextColor(APP_COLORS.muted[0], APP_COLORS.muted[1], APP_COLORS.muted[2]);
    pdf.text(
      `Page ${i} of ${totalPages} • Generated ${new Date().toLocaleDateString()}`,
      margin,
      pageHeight - 12
    );
    
    // Add small accent line
    pdf.setDrawColor(APP_COLORS.primary[0], APP_COLORS.primary[1], APP_COLORS.primary[2]);
    pdf.setLineWidth(1);
    pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
  }

  // Generate filename
  const filename = `${campaign.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_campaign.pdf`;
  
  // Save the PDF
  pdf.save(filename);
};