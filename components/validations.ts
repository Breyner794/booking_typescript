// Importamos Zod para validación de esquemas
import { z } from "zod";

// Definimos el esquema del formulario
const formSchema = z.object({

  // Validación del nombre - mínimo 2 caracteres
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  // Validación del apellido - mínimo 2 caracteres
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  // Validación del origen - debe estar seleccionado
  origin: z.string().min(2, {
    message: "Origin must be selected"
  }),
  // Validación del destino - debe estar seleccionado
  destination: z.string().min(2, {
    message: "Destination must be selected"
  }),
  // Validación de fecha de salida - campo requerido
  departureDate: z.date({
    required_error: "A departure date is required.",
  }),
  // Validación de fecha de regreso - campo requerido
  returnDate: z.date({
    required_error: "A return date is required.",
  }),
  // Validación del teléfono - objeto con código de país y número
  phoneNumber: z.object({
    countryCode: z.string({
      required_error: "Country code is required",
    }),
    // Número debe tener entre 7-10 dígitos y solo números
    number: z.string()
      .min(7, "Phone number must be at least 7 digits")
      .max(10, "Phone number must not exceed 10 digits")
      .regex(/^\d+$/, "Must be only digits"),
  }),
  // Validación del email - formato, longitud y caracteres permitidos
  email: z.string({
    required_error: "Email is required",
  }).email("Invalid email format")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must not exceed 100 characters")
    .regex(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      "Please enter a valid email address"
    ),

  // Validación personalizada: origen y destino deben ser diferentes
}).refine((data) => {
  return data.origin !== data.destination;
}, {
  message: "Origin and destination cannot be the same",
  path: ["destination"],
})
  // Validación personalizada: fecha de regreso debe ser posterior a la salida
  .refine((data) => {
    if (data.departureDate && data.returnDate) {
      return data.returnDate > data.departureDate;
    }
    return true;
  }, {
    message: "Return date must be after departure date",
    path: ["returnDate"],
  });

export default formSchema;