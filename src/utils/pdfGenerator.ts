
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateCertificatePDF = async (certificateElement: HTMLElement, filename: string) => {
  try {
    // Temporarily scale the element to full size for PDF generation
    const originalTransform = certificateElement.style.transform;
    certificateElement.style.transform = 'scale(1)';
    
    const canvas = await html2canvas(certificateElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,   // A4 portrait width in pixels at 96 DPI
      height: 1122  // A4 portrait height in pixels at 96 DPI
    });
    
    // Restore original transform
    certificateElement.style.transform = originalTransform;
    
    const imgData = canvas.toDataURL('image/png');
    
    // Create PDF in portrait orientation
    const pdf = new jsPDF('portrait', 'mm', 'a4');
    
    // A4 portrait dimensions: 210mm x 297mm
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
    
    pdf.save(`${filename}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
