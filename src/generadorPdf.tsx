import jsPDF from "jspdf";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
// import formSchema from "@/components/validations";

function centerText(doc, txt, y) {
  const textWidth = doc.getTextWidth(txt);
  const x = (doc.internal.pageSize.getWidth() - textWidth) / 2;
  doc.text(txt, x, y);
}

{/*data: Recibe los valores actuales del formulario (form.getValues())
  form: Recibe el objeto completo de React Hook Form*/}

const PDFGenerator = ({ data, form}) => {

  {/*Validacion de datos cuando hay datos en los campos requeridos si no hay muestra el mensaje pero si en emal, tiene un dato numerico o 2 letras va a pasar a descargarlo*/}
  // const validarDatos = () => {
  //   // Creamos un objeto para almacenar los errores
  //   const errores = [];

  //   // Validamos cada campo requerido
  //   if (!data.name) errores.push("El nombre es requerido");
  //   if (!data.last_name) errores.push("El apellido es requerido");
  //   if (!data.origin) errores.push("El origen es requerido");
  //   if (!data.destination) errores.push("El destino es requerido");
  //   if (!data.departureDate) errores.push("La fecha de salida es requerida");
  //   if (!data.returnDate) errores.push("La fecha de regreso es requerida");
  //   if (!data.email) errores.push("El email es requerido");
  //   if (!data.phoneNumber?.number) errores.push("El número de teléfono es requerido");

  //   try {
  //     formSchema.parse(data);
  //   } catch (zodError) {
  //     if (zodError instanceof z.ZodError) {
  //       zodError.errors.forEach((error) => {
  //         errores.push(error.message);
  //       });
  //     }
  //   }
  //   return errores;
  // };

  const generarPDF = () => {

    //Al tener un error, mostrara el siguiente mensaje.
    if (!form.formState.isValid) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Please correct the errors in the form",
      });
      return;
    }

    {/*Muestra el error si los datos de los campos estan vacios, pero si tiene algun dato al menos sea una letra en cualquier campo, sigue con su procedimiento a hacer la funcion de imprimir el PDF*/}

    // const errores = validarDatos();
    // if (errores.length > 0) {
    //   toast({
    //     title: `Error en el formulario`,
    //     description: `Por favor corrija los siguientes errores:\n${errores.join('\n')}`,
    //   });
    //   return;
    // }

    {/*Si no hay errores, continuamos con la generación del PDF*/}
    const doc = new jsPDF();

    //recuadro con bordes marcados.
    doc.rect(8, 260, 190, -255, "S");

    // Título y subtítulo
    doc.setFontSize(24);
    centerText(doc, "Confirmación de Reserva", 18);
    doc.setFontSize(16);
    centerText(doc, "Detalles de su vuelo", 29);

    // Datos del pasajero
    doc.setFillColor(200, 200, 200);
    doc.rect(10, 40, 180, 30, "DF");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Nombre: ${data.name}`, 15, 50);
    doc.text(`Apellido: ${data.last_name}`, 15, 60);

    // Detalles del vuelo
    doc.setFillColor(200, 200, 200);
    doc.rect(10, 80, 180, 50, "DF");
    doc.text(`Origen: ${data.origin}`, 15, 90);
    doc.text(`Destino: ${data.destination}`, 15, 100);
    doc.text(`Fecha de salida: ${format(data.departureDate, "PPP")}`, 15, 110);
    doc.text(`Fecha de regreso: ${format(data.returnDate, "PPP")}`, 15, 120);

    // Datos de contacto
    doc.setFillColor(200, 200, 200);
    doc.rect(10, 140, 180, 30, "DF");
    doc.text(
      `Teléfono: ${data.phoneNumber.countryCode} ${data.phoneNumber.number}`,
      15,
      150
    );
    doc.text(`Email: ${data.email}`, 15, 160);

    //Pie de pagina.
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(8);

    // Dibujar línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(8, 270, 200, 270);

    // Información de la aerolínea
    doc.text("Aerolinea Express S.A.", 10, 280);
    doc.text("Av. Principal 123, Torre Empresarial", 10, 285);
    doc.text("info@aerolineaexpress.com | www.aerolineaexpress.com", 10, 290);

    // Texto legal al lado derecho
    doc.text(
      "© 2025 Aerolinea Express. Todos los derechos reservados.",
      130,
      280
    );
    doc.text("IATA: SK123 | Registro Aeronáutico: AE-789", 130, 285);
    doc.text("Servicio al cliente: 1-800-AEROEXPRESS", 130, 290);

    doc.save("booking.pdf");
  };

  //Boton para generar el PDF juntando el boton de enviar al mismo tiempo.
  return <Button onClick={generarPDF}>Submit and Generator PDF</Button>;
};

export default PDFGenerator;