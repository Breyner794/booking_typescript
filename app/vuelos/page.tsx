import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Vuelo {
  ciudad: string;
  nombre_aeropuerto: string;
  pais: string;
}

// Marcamos el componente como un Server Component
export default async function VuelosPage() {
  try {
    const vuelosRef = collection(db, 'vuelos');
    const querySnapshot = await getDocs(vuelosRef);
    const vuelosData = querySnapshot.docs.map(doc => ({
      ...doc.data() as Vuelo,
      id: doc.id,
    }));

    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Aeropuertos Disponibles</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vuelosData.map((vuelo, index) => ( // Usamos vuelosData directamente
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex flex-col space-y-3">
            <h2 className="text-xl font-bold text-blue-600">{vuelo.nombre_aeropuerto}</h2>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-600">{vuelo.ciudad}</p>
            </div>
            <p className="text-gray-500">{vuelo.pais}</p>
          </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Error al cargar los datos.</div>; // Manejar el error visualmente
  }
}