// Importamos las funciones necesarias de Firebase y nuestra configuración
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Definimos la interfaz para la estructura de datos de una reserva
export interface BookingData {
  name: string;
  last_name: string;
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate: Date;
  phoneNumber: {
    countryCode: string;
    number: string;
  };
  email: string;
}

// Función para crear una nueva reserva en Firestore
export const createBooking = async (bookingData: BookingData) => {
  try {

    // Agregamos el documento a la colección 'bookings' con timestamp y estado inicial
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      createdAt: serverTimestamp(), // Añade la fecha/hora de creación
      status: 'pending' // Estado inicial de la reserva
    });
    console.log(docRef);
    return { success: true, id: docRef.id };
    
  } catch (error) {
    // Manejo de errores en la creación de la reserva
    console.error('Error creating booking:', error);
    return { success: false, error };
  }
};

// Función para validar los datos de la reserva
export const validateBooking = (booking: BookingData) => {
    // Validación adicional
    const errors: string[] = [];
  
    // Verifica que la fecha de salida sea futura
    if (booking.departureDate <= new Date()) {
      errors.push('Departure date must be in the future');
    }
  
    // Verifica que la fecha de regreso sea posterior a la salida
    if (booking.returnDate <= booking.departureDate) {
      errors.push('Return date must be after departure date');
    }
  
    // Devuelve el resultado de la validación
    return {
      isValid: errors.length === 0,
      errors
    };
  };