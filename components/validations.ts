
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  origin: z.string().min(2, {
    message: "Origin must be selected"
  }),
  destination: z.string().min(2, {
    message: "Destination must be selected"
  }),
  departureDate: z.date({
    required_error: "A departure date is required.",
  }),
  returnDate: z.date({
    required_error: "A return date is required.",
  }),
  phoneNumber: z.object({
    countryCode: z.string({
      required_error: "Country code is required",
    }),
    number: z.string()
      .min(7, "Phone number must be at least 7 digits")
      .max(10, "Phone number must not exceed 10 digits")
      .regex(/^\d+$/, "Must be only digits"),
  }),
  email: z.string({
    required_error: "Email is required",
  }).email("Invalid email format")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must not exceed 100 characters")
    .regex(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      "Please enter a valid email address"
    ),
}).refine((data) => {
  return data.origin !== data.destination;
}, {
  message: "Origin and destination cannot be the same",
  path: ["destination"],
}).refine((data) => {
  if (data.departureDate && data.returnDate) {
    return data.returnDate > data.departureDate;
  }
  return true;
}, {
  message: "Return date must be after departure date",
  path: ["returnDate"],
});

export default formSchema;