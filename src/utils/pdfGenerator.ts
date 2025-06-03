
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateCertificatePDF = async (certificateElement: HTMLElement, filename: string) => {
  try {
    // Temporarily remove transform to capture at full size
    const originalTransform = certificateElement.style.transform;
    const originalWidth = certificateElement.style.width;
    const originalHeight = certificateElement.style.height;
    
    // Set to full size for capture
    certificateElement.style.transform = 'scale(1)';
    certificateElement.style.width = '210mm';
    certificateElement.style.height = '297mm';
    
    // Wait for styles to apply
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const canvas = await html2canvas(certificateElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,   // A4 width in pixels at 96 DPI (210mm)
      height: 1123, // A4 height in pixels at 96 DPI (297mm)
      removeContainer: false,
      logging: false
    });
    
    // Restore original styles
    certificateElement.style.transform = originalTransform;
    certificateElement.style.width = originalWidth;
    certificateElement.style.height = originalHeight;
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Create PDF in A4 portrait with no margins
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });
    
    // Add image to fill entire A4 page (210mm x 297mm)
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, '', 'FAST');
    
    pdf.save(`${filename}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
