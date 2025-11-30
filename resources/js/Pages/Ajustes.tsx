import { useState } from "react";
import { Header } from "@/Components/Header";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Card, CardContent } from "@/Components/ui/card";
import { Menu, Printer, Settings, MapPin, Phone, MessageSquare, Save } from "lucide-react";
import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";

export default function Ajustes() {
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  return (
    <MainLayout>
      <Head title="Ajustes" />
      <div className="flex-1 flex flex-col">
        <Header title="proyecto" subtitle="Ajustes" />

        <main className="flex-1 p-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <Card className="border-none shadow-none">
              <CardContent className="p-0">
                <Tabs defaultValue="datos" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-primary h-16">
                    <TabsTrigger
                      value="datos"
                      className="data-[state=active]:bg-background data-[state=active]:text-foreground flex items-center gap-2"
                    >
                      <Menu className="w-5 h-5" />
                      DATOS NEGOCIO
                    </TabsTrigger>
                    <TabsTrigger
                      value="impresora"
                      className="data-[state=active]:bg-background data-[state=active]:text-foreground flex items-center gap-2"
                    >
                      <Printer className="w-5 h-5" />
                      IMPRESORA
                    </TabsTrigger>
                    <TabsTrigger
                      value="otros"
                      className="data-[state=active]:bg-background data-[state=active]:text-foreground flex items-center gap-2"
                    >
                      <Settings className="w-5 h-5" />
                      OTROS
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="datos" className="mt-6">
                    <div className="max-w-2xl space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="business-name" className="flex items-center gap-2">
                            <Menu className="w-4 h-4 text-muted-foreground" />
                            Nombre
                          </Label>
                          <Input
                            id="business-name"
                            placeholder="Nombre"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address" className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            Dirección
                          </Label>
                          <Input
                            id="address"
                            placeholder="Dirección"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            Teléfono
                          </Label>
                          <Input
                            id="phone"
                            placeholder="Teléfono"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message" className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-muted-foreground" />
                            Mensaje personal
                          </Label>
                          <Input
                            id="message"
                            placeholder="Mensaje personal"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                        </div>
                      </div>

                      <Button className="bg-primary hover:bg-primary/90 rounded-full px-8">
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="impresora" className="mt-6">
                    <div className="max-w-2xl">
                      <p className="text-muted-foreground">
                        Configuración de impresora disponible próximamente
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="otros" className="mt-6">
                    <div className="max-w-2xl">
                      <p className="text-muted-foreground">
                        Otras configuraciones disponibles próximamente
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}