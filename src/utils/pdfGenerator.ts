
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateCertificatePDF = async (certificateElement: HTMLElement, filename: string) => {
  try {
    // Create a clone of the element to avoid modifying the original
    const clonedElement = certificateElement.cloneNode(true) as HTMLElement;
    
    // Temporarily add the cloned element to the document
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
    
    document.body.appendChild(clonedElement);
    
    // Wait for styles to apply
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const canvas = await html2canvas(clonedElement, {
      scale: 3, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,   // A4 width in pixels at 96 DPI (210mm)
      height: 1123, // A4 height in pixels at 96 DPI (297mm)
      removeContainer: false,
      logging: false,
      foreignObjectRendering: true
    });
    
    // Remove the cloned element
    document.body.removeChild(clonedElement);
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Create PDF in A4 portrait with no margins - ensuring full page coverage
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [210, 297], // Exact A4 dimensions
      compress: true
    });
    
    // Add image to fill entire A4 page exactly (210mm x 297mm) with no margins
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, '', 'FAST');
    
    pdf.save(`${filename}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
