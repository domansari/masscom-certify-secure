
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateCertificatePDF = async (certificateElement: HTMLElement, filename: string) => {
  try {
    console.log('Starting PDF generation...');
    
    // Hide any no-print elements during PDF generation
    const noPrintElements = document.querySelectorAll('.no-print');
    noPrintElements.forEach(el => (el as HTMLElement).style.display = 'none');
    
    // Find the actual certificate element
    const actualCertificate = certificateElement.querySelector('#certificate-element') as HTMLElement;
    if (!actualCertificate) {
      throw new Error('Certificate element not found');
    }
    
    // Create a clone specifically for PDF generation
    const clonedElement = actualCertificate.cloneNode(true) as HTMLElement;
    
    // Set up the clone for exact A4 rendering
    clonedElement.style.position = 'fixed';
    clonedElement.style.left = '0';
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
    clonedElement.style.zIndex = '99999';
    clonedElement.style.overflow = 'hidden';
    
    document.body.appendChild(clonedElement);
    
    // Wait for fonts and rendering
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('Creating high-resolution canvas...');
    
    // Create canvas with high DPI for A4 dimensions
    const canvas = await html2canvas(clonedElement, {
      scale: 4, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI (210mm)
      height: 1123, // A4 height in pixels at 96 DPI (297mm)
      removeContainer: false,
      logging: false,
      foreignObjectRendering: true,
      imageTimeout: 0,
      onclone: (clonedDoc) => {
        const clonedCert = clonedDoc.querySelector('#certificate-element') as HTMLElement;
        if (clonedCert) {
          clonedCert.style.transform = 'scale(1)';
          clonedCert.style.width = '210mm';
          clonedCert.style.height = '297mm';
          clonedCert.style.margin = '0';
          clonedCert.style.padding = '0';
          clonedCert.style.overflow = 'hidden';
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
    
    // Create PDF with exact A4 dimensions, no margins
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [210, 297], // Exact A4 dimensions
      compress: true
    });
    
    // Add image to fill entire A4 page with no margins
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, '', 'FAST');
    
    console.log('Saving PDF...');
    pdf.save(`${filename}_v1.0.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
