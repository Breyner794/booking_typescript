import Image from "next/image";
import ProfileForm from "@/app/ui/Form";
import ImageGallery from "@/components/ImageGallery";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container mx-auto flex flex-col items-center" id="glass-form">
        <div className="max-w-[200px] space-y-6">
          <Image
            src="/assets/icons/pngegg.png"
            height={100}
            width={100}
            alt="logo principal"
            className="bm-12 h-40 w-fit"
          />
          <h1 className="text-2xl font-bold text-center">Aerolinea Express ✈️</h1>
          <h2>Reserva Ahora tu vuelo 🛫</h2>
          <ProfileForm />
        </div>
        <Footer/>
      </section>
      <ImageGallery />
    </div>
  );
}