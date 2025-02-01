// Importamos los componentes y utilidades necesarias
import Image from "next/image";
import ProfileForm from "@/app/ui/Form";
import ImageGallery from "@/components/ImageGallery";
import Footer from "@/components/footer";

// Componente principal de la página de inicio
export default function Home() {
 return (
   // Contenedor principal con altura completa de pantalla
   <div className="flex h-screen max-h-screen">
     {/* Sección del formulario con fondo de cristal */}
     <section className="remove-scrollbar container mx-auto flex flex-col items-center" id="glass-form">
       {/* Contenedor del logo y título */}
       <div className="max-w-[200px] space-y-6">
         {/* Logo de la aerolínea */}
         <Image
           src="/assets/icons/pngegg.png"
           height={100}
           width={100}
           alt="logo principal"
           className="bm-12 h-40 w-fit"
         />
         {/* Títulos de la página */}
         <h1 className="text-2xl font-bold text-center">Aerolinea Express ✈️</h1>
         <h2>Book your flight now 🛫</h2>
         {/* Formulario de reserva */}
         <ProfileForm />
       </div>
       {/* Pie de página */}
       <Footer/>
     </section>
     {/* Galería de imágenes lateral */}
     <ImageGallery/>
   </div>
 );
}