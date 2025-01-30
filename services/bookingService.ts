// services/bookingService.ts
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

export const createBooking = async (bookingData: BookingData) => {
  try {
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      createdAt: serverTimestamp(),
      status: 'pending'
    });
    console.log(docRef);
    return { success: true, id: docRef.id };
    
  } catch (error) {
    console.error('Error creating booking:', error);
    return { success: false, error };
  }
};

export const validateBooking = (booking: BookingData) => {
    // Validación adicional si es necesaria
    const errors: string[] = [];
  
    if (booking.departureDate <= new Date()) {
      errors.push('Departure date must be in the future');
    }
  
    if (booking.returnDate <= booking.departureDate) {
      errors.push('Return date must be after departure date');
    }
  
    return {
      isValid: errors.length === 0,
      errors
    };
  };