import jsPDF from 'jspdf';
import { CampaignWithContent } from '@/hooks/useCampaigns';

export const generateCampaignPDF = async (campaign: CampaignWithContent) => {
  // Create new PDF instance
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to add text with proper wrapping
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
    pdf.setFontSize(fontSize);
    if (isBold) {
      pdf.setFont('helvetica', 'bold');
    } else {
      pdf.setFont('helvetica', 'normal');
    }
    
    const lines = pdf.splitTextToSize(text, maxWidth);
    const lineHeight = fontSize * 0.4;
    
    // Check if we need a new page
    if (yPosition + (lines.length * lineHeight) > pdf.internal.pageSize.height - margin) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.text(lines, margin, yPosition);
    yPosition += lines.length * lineHeight + 5;
  };

  // Add header
  pdf.setFillColor(59, 130, 246); // Blue background
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Campaign Export', margin, 25);
  
  pdf.setTextColor(0, 0, 0);
  yPosition = 60;

  // Campaign basic info
  addText(`Campaign Name: ${campaign.name}`, 16, true);
  
  if (campaign.description) {
    addText(`Description: ${campaign.description}`, 12);
  }
  
  addText(`Created: ${new Date(campaign.created_at).toLocaleDateString()}`, 10);
  addText(`Offer Type: ${campaign.offer_type || 'Not specified'}`, 10);
  addText(`Tone Style: ${campaign.tone_style || 'Not specified'}`, 10);
  
  yPosition += 10;

  // Add content sections
  const contentSections = [
    { key: 'campaign_name', title: 'Campaign Name Content' },
    { key: 'headline', title: 'Headlines' },
    { key: 'ad_caption', title: 'Ad Captions' },
    { key: 'ig_story', title: 'Instagram Story Content' },
    { key: 'creative_prompt', title: 'Creative Prompts' }
  ];

  contentSections.forEach(section => {
    const content = campaign.content[section.key];
    if (content && content.content) {
      yPosition += 10;
      addText(section.title, 14, true);
      
      try {
        // Try to parse JSON content
        const parsedContent = typeof content.content === 'string' 
          ? JSON.parse(content.content) 
          : content.content;
        
        if (Array.isArray(parsedContent)) {
          parsedContent.forEach((item: any, index: number) => {
            if (typeof item === 'string') {
              addText(`${index + 1}. ${item}`, 10);
            } else if (typeof item === 'object') {
              // Handle object content
              Object.entries(item).forEach(([key, value]) => {
                if (typeof value === 'string') {
                  addText(`${key}: ${value}`, 10);
                }
              });
            }
          });
        } else if (typeof parsedContent === 'object') {
          Object.entries(parsedContent).forEach(([key, value]) => {
            if (typeof value === 'string') {
              addText(`${key}: ${value}`, 10);
            }
          });
        } else {
          addText(String(parsedContent), 10);
        }
      } catch (e) {
        // If not JSON, treat as plain text
        addText(String(content.content), 10);
      }
    }
  });

  // Add footer
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(
      `Page ${i} of ${totalPages} - Generated on ${new Date().toLocaleDateString()}`,
      margin,
      pdf.internal.pageSize.height - 10
    );
  }

  // Generate filename
  const filename = `${campaign.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_campaign.pdf`;
  
  // Save the PDF
  pdf.save(filename);
};