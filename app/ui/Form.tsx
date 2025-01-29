"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import * as React from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import formSchema from "../../components/validations"
import {createBooking} from "../../services/bookingService"
import { useToast } from "@/hooks/use-toast"

// Definicion de las ciudades disponibles
const CITIES = [
  { value: "CAL", label: "Cali" },
  { value: "BOG", label: "Bogotá" },
  { value: "MED", label: "Medellín" }
] as const;

const COUNTRY_CODES = [
  { value: "+57", label: "Colombia (+57)", flag: "🇨🇴 " },
  { value: "+1", label: "United States (+1)", flag: "🇺🇸 " },
  { value: "+34", label: "Spain (+34)", flag: "🇪🇸 " },
  { value: "+52", label: "Mexico (+52)", flag: "🇲🇽 " },
  { value: "+54", label: "Argentina (+54)", flag: "🇦🇷 " },
  { value: "+56", label: "Chile (+56)", flag: "🇨🇱 " },
  // Puedes agregar más países aquí
] as const;

export default function ProfileForm() {

  const {toast} = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      last_name: "",
      origin: "",
      destination: "",
      departureDate: null,
      returnDate: null,
      phoneNumber: {
        countryCode: "",
        number: ""
      },
      email:""
    },
  })

  const watchedOrigin = form.watch("origin");
  const watchedDepartureDate = form.watch("departureDate");
 
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Mostrar loading state
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.setAttribute('disabled', 'true');
        submitButton.textContent = 'Submitting...';
      }

      const result = await createBooking(values);
      
      if (result.success) {
        toast({
          title: "Booking Created",
          description: "Your booking has been successfully created.",
        });
        // Opcional: resetear el formulario
        form.reset();
      } else {
        throw new Error('Failed to create booking');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error creating your booking. Please try again.",
      });
    } finally {
      // Restaurar el botón
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.removeAttribute('disabled');
        submitButton.textContent = 'Submit';
      }
    }
  };

  const availableDestinations = CITIES.filter(city => city.value !== watchedOrigin);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full last name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display last name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="origin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Origin</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select origin city" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select your departure city</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!watchedOrigin} // Disable if no origin selected
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        watchedOrigin
                          ? "Select destination city"
                          : "Please select origin first"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableDestinations.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select your destination city</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="departureDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Departure date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Choose your departure date</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="returnDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Return date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={!watchedDepartureDate}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>
                          {watchedDepartureDate
                            ? "Pick a date"
                            : "Select departure date first"}
                        </span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < watchedDepartureDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Choose your return date</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

      <div className="space-y-2">
        <FormLabel>Phone Number</FormLabel>
        <div className="flex gap-2">
        <FormField
          control={form.control}
          name="phoneNumber.countryCode" // Cambié de phone.countryCode a phoneNumber.countryCode
          render={({ field }) => (
            <FormItem className="w-[140px]">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {COUNTRY_CODES.map((country) => (
                    <SelectItem
                      key={country.value}
                      value={country.value}
                      className="flex items-center gap-2"
                    >
                      <span>{country.flag}</span>
                      <span>{country.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber.number" // Cambié de phone.number a phoneNumber.number
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Phone number"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <FormDescription>
            Please enter your phone number with country code
        </FormDescription>
      </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...field}
                  // Opcional: convertir a minúsculas automáticamente
                  onChange={(e) => {
                    field.onChange(e.target.value.toLowerCase());
                  }}
                  // Opcional: agregar autocompletado
                  autoComplete="email"
                />
              </FormControl>
              <FormDescription>
                We will never share your email with anyone else.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}