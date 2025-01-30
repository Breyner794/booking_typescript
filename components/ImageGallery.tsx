import Image from 'next/image'

const ImageGallery = () => {
  return (
    <div className="w-[50%] min-h-screen flex items-center justify-center bg-blue-100 hidden md:block flex-1 ">
      <div className="w-full h-[100vh] ">
        <div className="grid grid-cols-3  h-full">
          {/* Imagen grande a la izquierda */}
          <div className="relative row-span-1 w-full h-full">
            <Image
              src="/assets/img/city.jpeg"
              alt="city"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 25vw"
              priority
            />
          </div>
          {/* Contenedor de imágenes derecha */}
          <div className="grid grid-rows-1 gap-4 h-full">

            <div className="relative w-full h-full">
              <Image
                src="/assets/img/city2.jpeg"
                alt="city"
                fill
                className="object-cover "
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div> 
          </div>
          <div className="relative w-full h-full">
              <Image
                src="/assets/img/city3.jpeg"
                alt="city"
                fill
                className="object-cover "
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
        </div>
      </div>
    </div>
  )
}

export default ImageGallery