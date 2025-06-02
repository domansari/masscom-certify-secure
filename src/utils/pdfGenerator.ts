
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateCertificatePDF = async (certificateElement: HTMLElement, filename: string) => {
  try {
    // Temporarily scale the element to full size for PDF generation
    const originalTransform = certificateElement.style.transform;
    certificateElement.style.transform = 'scale(1)';
    
    const canvas = await html2canvas(certificateElement, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,   // A4 portrait width in pixels at 96 DPI
      height: 1123, // A4 portrait height in pixels at 96 DPI
      removeContainer: true
    });
    
    // Restore original transform
    certificateElement.style.transform = originalTransform;
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Create PDF in portrait orientation with no margins
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });
    
    // A4 portrait dimensions: 210mm x 297mm - full size without margins
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, '', 'FAST');
    
    pdf.save(`${filename}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
