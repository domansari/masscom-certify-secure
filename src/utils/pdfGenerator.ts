
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

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
    
    // Create a temporary container for PDF generation
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '0';
    tempContainer.style.top = '0';
    tempContainer.style.width = '210mm';
    tempContainer.style.height = '297mm';
    tempContainer.style.transform = 'scale(1)';
    tempContainer.style.transformOrigin = 'top left';
    tempContainer.style.zIndex = '99999';
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.overflow = 'hidden';
    
    // Clone the certificate element
    const clonedElement = actualCertificate.cloneNode(true) as HTMLElement;
    clonedElement.style.transform = 'scale(1)';
    clonedElement.style.width = '210mm';
    clonedElement.style.height = '297mm';
    clonedElement.style.margin = '0';
    clonedElement.style.padding = '0';
    clonedElement.style.overflow = 'hidden';
    
    // Ensure QR code is visible in the cloned element
    const originalQRCanvas = actualCertificate.querySelector('canvas');
    const clonedQRCanvas = clonedElement.querySelector('canvas');
    if (originalQRCanvas && clonedQRCanvas) {
      const ctx = clonedQRCanvas.getContext('2d');
      if (ctx) {
        clonedQRCanvas.width = originalQRCanvas.width;
        clonedQRCanvas.height = originalQRCanvas.height;
        ctx.drawImage(originalQRCanvas, 0, 0);
      }
    }
    
    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);
    
    // Wait for fonts and rendering
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Creating canvas for PDF...');
    
    // Create canvas with exact A4 pixel dimensions at high resolution
    const canvas = await html2canvas(tempContainer, {
      scale: 3, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123, // A4 height in pixels at 96 DPI
      logging: false,
      removeContainer: false
    });
    
    // Remove the temporary container
    document.body.removeChild(tempContainer);
    
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
      format: 'a4'
    });
    
    // Add image to fill entire A4 page
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
    
    console.log('Saving PDF...');
    pdf.save(`${filename}_v1.0.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
