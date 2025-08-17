import jsPDF from 'jspdf';
import { CampaignWithContent } from '@/hooks/useCampaigns';

export const generateCampaignPDF = async (campaign: CampaignWithContent) => {
  // Create new PDF instance
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // FITNESSADS.AI Brand Colors
  const brandRed = [255, 54, 0]; // FF3600 - Updated brand color
  const brandDark = [36, 34, 41]; // Background dark
  const brandGray = [128, 128, 128]; // Muted text

  // Helper function to add logo image
  const addLogo = async () => {
    try {
      // Load the logo image from public uploads
      const logoImg = new Image();
      logoImg.src = '/lovable-uploads/72804423-844d-4d77-b5d2-c54beb091fea.png';
      
      return new Promise((resolve) => {
        logoImg.onload = () => {
          // Add logo to PDF (convert to canvas first for jsPDF compatibility)
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = logoImg.width;
          canvas.height = logoImg.height;
          ctx?.drawImage(logoImg, 0, 0);
          
          const logoData = canvas.toDataURL('image/png');
          pdf.addImage(logoData, 'PNG', margin, 5, 15, 15); // x, y, width, height
          resolve(true);
        };
        logoImg.onerror = () => resolve(false);
      });
    } catch (error) {
      console.warn('Could not load logo:', error);
      return false;
    }
  };

  // Helper function to add branded header on new pages
  const addHeader = async () => {
    // Add red header bar
    pdf.setFillColor(brandRed[0], brandRed[1], brandRed[2]);
    pdf.rect(0, 0, pageWidth, 25, 'F');
    
    // Add logo
    await addLogo();
    
    // Add FITNESSADS.AI text (positioned after logo)
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('FITNESSADS.AI', margin + 20, 17);
    
    // Add tagline
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('AI-Powered Ad Campaign Engine', pageWidth - margin - 80, 17);
    
    yPosition = 35; // Start content below header
  };

  // Helper function to add text with proper wrapping
  const addText = async (text: string, fontSize: number = 12, isBold: boolean = false, color: number[] = [0, 0, 0]) => {
    pdf.setTextColor(color[0], color[1], color[2]);
    pdf.setFontSize(fontSize);
    if (isBold) {
      pdf.setFont('helvetica', 'bold');
    } else {
      pdf.setFont('helvetica', 'normal');
    }
    
    const lines = pdf.splitTextToSize(text, maxWidth);
    const lineHeight = fontSize * 0.4;
    
    // Check if we need a new page
    if (yPosition + (lines.length * lineHeight) > pageHeight - 40) {
      pdf.addPage();
      await addHeader();
    }
    
    pdf.text(lines, margin, yPosition);
    yPosition += lines.length * lineHeight + 5;
  };

  // Add header to first page
  await addHeader();

  // Campaign basic info with styling
  await addText(`Campaign Name: ${campaign.name}`, 18, true, brandRed);
  await addText(`Generated on ${new Date().toLocaleDateString()}`, 10, false, brandGray);
  
  yPosition += 15;

  // Add content sections
  const contentSections = [
    { key: 'campaign_name', title: 'Campaign Name Content' },
    { key: 'headline', title: 'Headlines' },
    { key: 'ad_caption', title: 'Ad Captions' },
    { key: 'ig_story', title: 'Instagram Story Content' },
    { key: 'creative_prompt', title: 'Creative Prompts' }
  ];

  for (const section of contentSections) {
    const content = campaign.content[section.key];
    if (content && content.content) {
      yPosition += 10;
      await addText(section.title, 14, true, brandRed);
      
      try {
        // Try to parse JSON content
        const parsedContent = typeof content.content === 'string' 
          ? JSON.parse(content.content) 
          : content.content;
        
        if (Array.isArray(parsedContent)) {
          for (const [index, item] of parsedContent.entries()) {
            if (typeof item === 'string') {
              await addText(`${index + 1}. ${item}`, 10);
            } else if (typeof item === 'object') {
              // Handle object content
              for (const [key, value] of Object.entries(item)) {
                if (typeof value === 'string') {
                  await addText(`${key}: ${value}`, 10);
                }
              }
            }
          }
        } else if (typeof parsedContent === 'object') {
          for (const [key, value] of Object.entries(parsedContent)) {
            if (typeof value === 'string') {
              await addText(`${key}: ${value}`, 10);
            }
          }
        } else {
          await addText(String(parsedContent), 10);
        }
      } catch (e) {
        // If not JSON, treat as plain text
        await addText(String(content.content), 10);
      }
    }
  }

  // Add branded footer to all pages
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    
    // Footer background
    pdf.setFillColor(240, 240, 240);
    pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F');
    
    // Footer text
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Page ${i} of ${totalPages}`, margin, pageHeight - 7);
    pdf.text('Generated by FITNESSADS.AI', pageWidth - margin - 60, pageHeight - 7);
  }

  // Generate filename
  const filename = `${campaign.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_campaign.pdf`;
  
  // Save the PDF
  pdf.save(filename);
};