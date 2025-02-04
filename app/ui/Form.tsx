"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import * as React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import formSchema from "../../components/validations";
import { createBooking } from "../../services/bookingService";
import { useToast } from "@/hooks/use-toast";
import PDFGenerator from "../../src/generadorPdf";

{/*Definicion de las ciudades disponibles*/}
const CITIES = [
  { value: "CAL", label: "Cali" },
  { value: "BOG", label: "Bogotá" },
  { value: "MED", label: "Medellín" },
  { value: "CTG", label: "Cartagena" },
  { value: "BAQ", label: "Barranquilla" },
  { value: "SMR", label: "Santa Marta" },
  { value: "PEI", label: "Pereira" },
  { value: "BGA", label: "Bucaramanga" },
  { value: "MZL", label: "Manizales" },
  { value: "PSO", label: "Pasto" },
  { value: "VUP", label: "Valledupar" },
  { value: "CUC", label: "Cúcuta" },
  { value: "IBE", label: "Ibagué" },
  { value: "VVC", label: "Villavicencio" },
  { value: "NVA", label: "Neiva" },
  { value: "PPN", label: "Popayán" },
  { value: "AXM", label: "Armenia" },
  { value: "MTR", label: "Montería" },
  { value: "SNC", label: "Santa Rosa de Cabal" },
  { value: "TCO", label: "Tuluá" }
] as const;

{/*Definicion de las codigos de pais*/}
const COUNTRY_CODES = [
  { value: "+57", label: "Colombia (+57)", flag: "🇨🇴 " },
  { value: "+1", label: "United States or Canada (+1)", flag: "🇺🇸 " },
  { value: "+34", label: "Spain (+34)", flag: "🇪🇸 " },
  { value: "+52", label: "Mexico (+52)", flag: "🇲🇽 " },
  { value: "+54", label: "Argentina (+54)", flag: "🇦🇷 " },
  { value: "+56", label: "Chile (+56)", flag: "🇨🇱 " },
  { value: "+55", label: "Brazil (+55)", flag: "🇧🇷 " },
  { value: "+51", label: "Peru (+51)", flag: "🇵🇪 " },
  { value: "+593", label: "Ecuador (+593)", flag: "🇪🇨 " },
  { value: "+58", label: "Venezuela (+58)", flag: "🇻🇪 " },
  { value: "+591", label: "Bolivia (+591)", flag: "🇧🇴 " },
  { value: "+595", label: "Paraguay (+595)", flag: "🇵🇾 " },
  { value: "+598", label: "Uruguay (+598)", flag: "🇺🇾 " },
  { value: "+506", label: "Costa Rica (+506)", flag: "🇨🇷 " },
  { value: "+503", label: "El Salvador (+503)", flag: "🇸🇻 " },
  { value: "+502", label: "Guatemala (+502)", flag: "🇬🇹 " },
  { value: "+504", label: "Honduras (+504)", flag: "🇭🇳 " },
  { value: "+505", label: "Nicaragua (+505)", flag: "🇳🇮 " },
  { value: "+507", label: "Panama (+507)", flag: "🇵🇦 " },
  { value: "+44", label: "United Kingdom (+44)", flag: "🇬🇧 " },
  { value: "+33", label: "France (+33)", flag: "🇫🇷 " },
  { value: "+49", label: "Germany (+49)", flag: "🇩🇪 " },
  { value: "+39", label: "Italy (+39)", flag: "🇮🇹 " },
  { value: "+351", label: "Portugal (+351)", flag: "🇵🇹 " }
] as const;

{/*Definimos la estructura incial del formulario*/}
export default function ProfileForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      last_name: "",
      origin: "",
      destination: "",
      departureDate: undefined,
      returnDate: undefined,
      phoneNumber: {
        countryCode: "",
        number: "",
      },
      email: "",
    },
  });

  {/*Definimos constantes para origen y fecha de salida, es para que cuando seleccionemos
    un dato en alguna de esos dos campos, lo elimine o lo deshabilite para que no cometa el 
    erro de duplicado como un mismo origen, cali x cali, o 23 x 23.*/}
  const watchedOrigin = form.watch("origin");
  const watchedDepartureDate = form.watch("departureDate");

  {/*Definimos la constate para la accion del boton submit*/}
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Mostrar loading state
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.setAttribute("disabled", "true");
        submitButton.textContent = "Submitting...";
      }
      {/*Constante para validar el resultado al presionar el boton, si este falla muestra el error.*/}
      const result = await createBooking(values);

      if (result.success) {
        toast({
          title: "Booking Created",
          description: "Your booking has been successfully created.",
        });
        form.reset();
      } else {
        throw new Error("Failed to create booking");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "There was an error creating your booking. Please try again.",
      });
    } finally {
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.removeAttribute("disabled");
        submitButton.textContent = "Submit";
      }
    }
  };

  {/*Constante validacion para generar un estrictamentediferente es BOG diferente a origen
    esto quiere decir que si origen eligio a BOG, entonces traeme todas la ciudades
    que sean estrictamente diferente es BOG*/}
  const availableDestinations = CITIES.filter(
    (city) => city.value !== watchedOrigin
  );

  {/*Comienzo del frontend*/}
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        {/*Campo nombre*/}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormDescription className="text-white">
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

          {/*Campo Apellido*/}
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full last name" {...field} />
              </FormControl>
              <FormDescription className="text-white">
                This is your public display last name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*Campo origen*/}
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
                  {CITIES.map((city) => ( //Se crea un funcion flecha para construir los Selecciones de cada ciudad.
                    <SelectItem key={city.value} value={city.value}> 
                      {city.label} 
                    </SelectItem> //Definimos el city.label dentro del selectitem para mostar el nombre del label osea que el value es BOG y el label es BOGOTA
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-white">
                Select your departure city
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*Campo Destino*/}
        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!watchedOrigin} // Se mantiene deshabilitadohasta que elija un origen. 
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        watchedOrigin
                          ? "Select destination city" //Cuando tenga un origen, mostrara este mensaje dentro del campo
                          : "Please select origin first" //Cuando NO tenga un origen seleccionado, mostrara el mensaje
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableDestinations.map((city) => ( //Se crea un funcion flecha para construir los Selecciones de cada ciudad.
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem> //Definimos el city.label dentro del selectitem para mostar el nombre del label osea que el value es BOG y el label es BOGOTA
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-white">
                Select your destination city
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*Campo Fecha de salida*/}
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
                        "w-[240px] pl-3 text-left font-normal bg-transparent hover:bg-white/20",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP") //Si hay fecha muestrala formateada.
                      ) : (
                        <span>Pick a date</span> //Si no hay fecha, muestra "pick a date" 
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 text-black" align="start">
                  <Calendar
                    mode="single" //Permite seleccionar una sola fecha || (También existe modo "multiple" o "range" para rangos)
                    selected={field.value} // Muestra la fecha que está seleccionada actualmente
                    onSelect={field.onChange} // Define qué hacer cuando el usuario selecciona una fecha y a la vez actualiza el valor del formulario.
                    disabled={(date) => date < new Date()} // Define qué hacer cuando el usuario selecciona una fecha
                    initialFocus
                    className="bg-transparent bg-black/10"
                  />
                </PopoverContent>
              </Popover>
              <FormDescription className="text-white">
                Choose your departure date
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*Campo Fecha de regreso*/}
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
                        "w-[240px] pl-3 text-left font-normal bg-transparent hover:bg-white/20",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={!watchedDepartureDate} //Si no hay fecha es true osea que matengase deshabilitado, pero si es falso entonces habilitate. 
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
                    className="bg-transparent bg-black/10"
                  />
                </PopoverContent>
              </Popover>
              <FormDescription className="text-white">
                Choose your return date
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*Campo codigo de pais*/}
        <FormField
          control={form.control}
          name="phoneNumber.countryCode"
          render={({ field }) => (
            <FormItem className="w-[140px]">
              <FormLabel>Phone Number</FormLabel>
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

          {/*Campo numero de telefono*/}
        <FormField
          control={form.control}
          name="phoneNumber.number"
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
              <FormDescription className="text-white">
                Please enter your phone number with country code
              </FormDescription>
            </FormItem>
          )}
        />

        {/*Campo email*/}
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
                  //convertir a minúsculas automáticamente
                  onChange={(e) => {
                    field.onChange(e.target.value.toLowerCase());
                  }}
                  //agregar autocompletado
                  autoComplete="email"
                />
              </FormControl>
              <FormDescription className="text-white">
                We will never share your email with anyone else.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      {/*Se maneja el envio del formulario que a la vez que el PDFGenerator, pasa los valores actuales del formulario,
      y el objeto form ingresa a las validadiones y estados.*/}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <PDFGenerator data={form.getValues()} form={form}/>
      </form>
    </Form>
  );
}
