import jsPDF from 'jspdf';
import { format } from 'date-fns'; // Si usas date-fns para formatear fechas
import { Button } from '@/components/ui/button';


function centerText(doc, txt, y) {
    const textWidth = doc.getTextWidth(txt);
    const x = (doc.internal.pageSize.getWidth() - textWidth) / 2;
    doc.text(txt, x, y);
  }

const PDFGenerator = ({ data }) => {
  const generarPDF = () => {
    const doc = new jsPDF();
  
    // Título y subtítulo
  doc.setFontSize(24);
  centerText(doc, 'Confirmación de Reserva', 10);
  doc.setFontSize(16);
  centerText(doc, 'Detalles de su vuelo', 20);

  // Logo
//   doc.addImage('./pngegg.png', 'PNG', 10, 10, 30, 30); // Usa la variable importada 'logo'

  // Datos del pasajero
  doc.setFillColor(240, 240, 240);
  doc.rect(10, 30, 180, 40, 'F');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Nombre: ${data.name}`, 15, 40);
  doc.text(`Apellido: ${data.last_name}`, 15, 50);

  // Detalles del vuelo
  doc.setFillColor(240, 240, 240);
  doc.rect(10, 80, 180, 60, 'F');
  doc.text(`Origen: ${data.origin}`, 15, 90);
  doc.text(`Destino: ${data.destination}`, 15, 100);
  doc.text(`Fecha de salida: ${format(data.departureDate, "PPP")}`, 15, 110);
  doc.text(`Fecha de regreso: ${format(data.returnDate, "PPP")}`, 15, 120);

  // Datos de contacto
  doc.setFillColor(240, 240, 240);
  doc.rect(10, 150, 180, 40, 'F');
  doc.text(`Teléfono: ${data.phoneNumber.countryCode} ${data.phoneNumber.number}`, 15, 160);
  doc.text(`Email: ${data.email}`, 15, 170);

  // Código QR
//   doc.addImage('./pngeggqr.png', 'PNG', 160, 250, 30, 30); // Usa la variable importada 'qrImage'

    doc.save('booking.pdf');
  };

  return (
    <Button onClick={generarPDF}>
      Generar PDF
    </Button>
  );
};

export default PDFGenerator;