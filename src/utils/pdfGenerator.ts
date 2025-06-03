
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateCertificatePDF = async (certificateElement: HTMLElement, filename: string) => {
  try {
    // Create a clone of the element to avoid modifying the original
    const clonedElement = certificateElement.cloneNode(true) as HTMLElement;
    
    // Temporarily add the cloned element to the document with proper sizing
    clonedElement.style.position = 'absolute';
    clonedElement.style.left = '-9999px';
    clonedElement.style.top = '0';
    clonedElement.style.transform = 'scale(1)';
    clonedElement.style.transformOrigin = 'top left';
    clonedElement.style.width = '210mm';
    clonedElement.style.height = '297mm';
    clonedElement.style.margin = '0';
    clonedElement.style.padding = '0';
    clonedElement.style.boxSizing = 'border-box';
    clonedElement.style.display = 'block';
    clonedElement.style.visibility = 'visible';
    
    document.body.appendChild(clonedElement);
    
    // Wait for styles to apply and fonts to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Convert mm to pixels at 300 DPI for high quality
    const mmToPx = (mm: number) => Math.round((mm * 300) / 25.4);
    const width = mmToPx(210);  // A4 width in pixels
    const height = mmToPx(297); // A4 height in pixels
    
    const canvas = await html2canvas(clonedElement, {
      scale: 4, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: width,
      height: height,
      removeContainer: false,
      logging: false,
      foreignObjectRendering: true,
      onclone: (clonedDoc) => {
        const clonedCert = clonedDoc.getElementById('certificate-element');
        if (clonedCert) {
          clonedCert.style.width = '210mm';
          clonedCert.style.height = '297mm';
          clonedCert.style.transform = 'none';
          clonedCert.style.margin = '0';
          clonedCert.style.padding = '0';
        }
      }
    });
    
    // Remove the cloned element
    document.body.removeChild(clonedElement);
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Create PDF in A4 portrait with exact dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });
    
    // Add image to fill entire A4 page (210mm x 297mm) with no margins
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, '', 'FAST');
    
    pdf.save(`${filename}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
