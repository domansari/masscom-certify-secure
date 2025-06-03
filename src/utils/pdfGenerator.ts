
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateCertificatePDF = async (certificateElement: HTMLElement, filename: string) => {
  try {
    console.log('Starting PDF generation...');
    
    // Hide any no-print elements during PDF generation
    const noPrintElements = document.querySelectorAll('.no-print');
    noPrintElements.forEach(el => (el as HTMLElement).style.display = 'none');
    
    // Create a clone of the element
    const clonedElement = certificateElement.cloneNode(true) as HTMLElement;
    
    // Set up the clone for high-quality rendering
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
    clonedElement.style.backgroundColor = 'white';
    clonedElement.style.zIndex = '9999';
    
    // Find the actual certificate element inside the clone
    const actualCertificate = clonedElement.querySelector('#certificate-element') as HTMLElement;
    if (actualCertificate) {
      actualCertificate.style.transform = 'scale(1)';
      actualCertificate.style.transformOrigin = 'top left';
      actualCertificate.style.margin = '0';
    }
    
    document.body.appendChild(clonedElement);
    
    // Wait for rendering and fonts to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Creating canvas...');
    
    // Create canvas with exact A4 dimensions at high DPI
    const canvas = await html2canvas(actualCertificate || clonedElement, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123, // A4 height in pixels at 96 DPI
      removeContainer: false,
      logging: true,
      foreignObjectRendering: true,
      onclone: (clonedDoc) => {
        // Ensure all styles are applied in the cloned document
        const clonedCertificate = clonedDoc.querySelector('#certificate-element') as HTMLElement;
        if (clonedCertificate) {
          clonedCertificate.style.transform = 'scale(1)';
          clonedCertificate.style.width = '210mm';
          clonedCertificate.style.height = '297mm';
          clonedCertificate.style.margin = '0';
          clonedCertificate.style.padding = '0';
        }
      }
    });
    
    // Remove the cloned element
    document.body.removeChild(clonedElement);
    
    // Restore no-print elements
    noPrintElements.forEach(el => (el as HTMLElement).style.display = '');
    
    console.log('Canvas created, generating PDF...');
    console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
    
    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas has zero dimensions');
    }
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    if (!imgData || imgData === 'data:,') {
      throw new Error('Failed to create image data from canvas');
    }
    
    // Create PDF with exact A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: false
    });
    
    // Add image to fill entire A4 page exactly
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, '', 'FAST');
    
    console.log('Saving PDF...');
    pdf.save(`${filename}_v1.0.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
