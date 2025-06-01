"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { MapPin, CalendarIcon, Users, Search } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function SearchSection() {
  const [destination, setDestination] = useState("")
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState(2)

  return (
    <section className="bg-blue-600 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Encontrá el telo perfecto para tu estadía</h1>
          <p className="text-xl text-blue-100">Desde telos económicos hasta suites de lujo</p>
        </div>

        {/* Search Form */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg p-2 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              {/* Destination */}
              <div className="relative">
                <div className="p-4 border-r border-gray-200">
                  <label className="block text-xs font-semibold text-gray-900 mb-1">Destino</label>
                  <div className="relative">
                    <MapPin className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="¿A dónde vas?"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="pl-6 border-0 p-0 text-sm focus-visible:ring-0"
                    />
                  </div>
                </div>
              </div>

              {/* Check-in */}
              <div className="border-r border-gray-200">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="p-4 cursor-pointer hover:bg-gray-50">
                      <label className="block text-xs font-semibold text-gray-900 mb-1">Llegada</label>
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {checkIn ? format(checkIn, "dd MMM", { locale: es }) : "Fecha"}
                        </span>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Check-out */}
              <div className="border-r border-gray-200">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="p-4 cursor-pointer hover:bg-gray-50">
                      <label className="block text-xs font-semibold text-gray-900 mb-1">Salida</label>
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {checkOut ? format(checkOut, "dd MMM", { locale: es }) : "Fecha"}
                        </span>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      disabled={(date) => date < new Date() || (checkIn && date <= checkIn)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Guests & Search */}
              <div className="flex">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="p-4 cursor-pointer hover:bg-gray-50 flex-1">
                      <label className="block text-xs font-semibold text-gray-900 mb-1">Huéspedes</label>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {guests} {guests === 1 ? "huésped" : "huéspedes"}
                        </span>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Adultos</span>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => setGuests(Math.max(1, guests - 1))}>
                            -
                          </Button>
                          <span className="w-8 text-center">{guests}</span>
                          <Button variant="outline" size="sm" onClick={() => setGuests(guests + 1)}>
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button className="bg-blue-600 hover:bg-blue-700 px-6">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
