import { useState, useEffect, useRef } from "react";
import { Head, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { Header } from "@/Components/Header";
import { useToast } from "@/Hooks/use-toast";
import {
    Search,
    Plus,
    Minus,
    Trash2,
    ShoppingCart,
    DollarSign,
    X,
    User,
    CreditCard,
    Banknote,
    UserPlus,
    Check
} from "lucide-react";

// --- Interfaces ---
interface Product {
    id: number;
    barcode: string | null;
    description: string;
    sale_price: number;
    stock: number;
}

interface CartItem extends Product {
    quantity: number;
    total: number;
}

interface Customer {
    id?: number; // El ID es opcional solo porque al crear uno nuevo en el front no lo tiene aún
    name: string;
    phone?: string;
}

interface Props {
    allProducts: Product[];
    clients: Customer[]; // <--- Recibimos los clientes del controlador
}

// --- Componentes Auxiliares ---
function ProductCard({
    product,
    onAdd,
}: {
    product: Product;
    onAdd: (p: Product) => void;
}) {
    return (
        <button
            onClick={() => onAdd(product)}
            className="group relative flex flex-col items-center p-4 bg-white border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-200"
        >
            <div className="w-14 h-14 mb-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600 shadow-sm">
                {product.description.charAt(0).toUpperCase()}
            </div>
            <p className="text-sm font-semibold text-gray-800 text-center line-clamp-2 mb-1 leading-tight">
                {product.description}
            </p>
            <p className="text-lg font-bold text-blue-600">
                ${Number(product.sale_price).toFixed(2)}
            </p>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-blue-600 rounded-full p-1 shadow-md">
                    <Plus className="w-4 h-4 text-white" />
                </div>
            </div>
        </button>
    );
}

function CartItemRow({ item, onIncrease, onDecrease, onRemove }: any) {
    return (
        <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-lg border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate text-sm">
                    {item.description}
                </p>
                <p className="text-xs text-gray-500">
                    ${Number(item.sale_price).toFixed(2)} c/u
                </p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onDecrease(item.id)}
                    className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded hover:text-red-600"
                >
                    <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-bold text-sm tabular-nums">
                    {item.quantity}
                </span>
                <button
                    onClick={() => onIncrease(item.id)}
                    className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded hover:text-green-600"
                >
                    <Plus className="w-3 h-3" />
                </button>
            </div>
            <div className="flex flex-col items-end gap-1 min-w-[60px]">
                <p className="font-bold text-sm text-gray-800">
                    ${item.total.toFixed(2)}
                </p>
                <button
                    onClick={() => onRemove(item.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

function PaymentMethodButton({ icon: Icon, label, isSelected, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600"
            }`}
        >
            <Icon
                className={`w-6 h-6 ${
                    isSelected ? "text-blue-600" : "text-gray-500"
                }`}
            />
            <span className="text-xs font-semibold">{label}</span>
        </button>
    );
}

// --- Componente Principal ---
export default function Vender({ allProducts, clients }: Props) { // <--- Destructuramos clients
    const { toast } = useToast();

    const [searchQuery, setSearchQuery] = useState("");
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [showCheckout, setShowCheckout] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("efectivo");
    const [amountReceived, setAmountReceived] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Estados para clientes
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
    const [newCustomerName, setNewCustomerName] = useState("");
    const [newCustomerPhone, setNewCustomerPhone] = useState("");
    const [customerSearch, setCustomerSearch] = useState(""); // Texto del input de búsqueda de clientes

    // --- Lógica de Filtros ---
    const filteredProducts = allProducts.filter(
        (product) =>
            product.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            (product.barcode && product.barcode.includes(searchQuery))
    );

    // Filtrar clientes para el buscador
    const filteredClients = customerSearch.trim() === "" 
        ? [] 
        : clients.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()));

    const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal;
    const payment = parseFloat(amountReceived) || 0;
    const change = payment - total;

    useEffect(() => {
        searchInputRef.current?.focus();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "F9" && cartItems.length > 0 && !showCheckout) {
                e.preventDefault();
                setShowCheckout(true);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [cartItems.length, showCheckout]);

    // --- Funciones del Carrito ---
    const addToCart = (product: Product) => {
        const existingItem = cartItems.find((item) => item.id === product.id);
        const price = Number(product.sale_price);

        if (existingItem) {
            setCartItems(
                cartItems.map((item) =>
                    item.id === product.id
                        ? {
                              ...item,
                              quantity: item.quantity + 1,
                              total: (item.quantity + 1) * price,
                          }
                        : item
                )
            );
        } else {
            setCartItems([
                ...cartItems,
                { ...product, quantity: 1, total: price, sale_price: price },
            ]);
        }
        setSearchQuery("");
        searchInputRef.current?.focus();
    };

    const updateQuantity = (itemId: number, delta: number) => {
        setCartItems(
            cartItems.map((item) => {
                if (item.id === itemId) {
                    const newQuantity = Math.max(1, item.quantity + delta);
                    return {
                        ...item,
                        quantity: newQuantity,
                        total: newQuantity * Number(item.sale_price),
                    };
                }
                return item;
            })
        );
    };

    const removeFromCart = (itemId: number) => {
        setCartItems(cartItems.filter((item) => item.id !== itemId));
    };

    const clearCart = () => {
        if (confirm("¿Vaciar carrito?")) {
            setCartItems([]);
            setShowCheckout(false);
            setAmountReceived("");
        }
    };

    // --- Funciones de Clientes ---
    const handleSelectClient = (client: Customer) => {
        setSelectedCustomer(client);
        setCustomerSearch(""); // Limpiar búsqueda
    };

    const handleRemoveClient = () => {
        setSelectedCustomer(null);
    };

    const handleCreateCustomer = () => {
        if (!newCustomerName.trim()) return;
        // Creamos un objeto temporal, el ID se generará en el backend al guardar la venta
        const tempClient = { name: newCustomerName, phone: newCustomerPhone };
        setSelectedCustomer(tempClient);
        setIsCreatingCustomer(false);
        setNewCustomerName("");
        setNewCustomerPhone("");
    };

    // --- Procesar Venta ---
    const completeSale = () => {
        if (cartItems.length === 0) {
            toast({ title: "Error", description: "El carrito está vacío", variant: "destructive" });
            return;
        }

        if (paymentMethod === "efectivo" && payment < total) {
            toast({ title: "Error", description: "Monto insuficiente", variant: "destructive" });
            return;
        }

        const saleData = {
            items: cartItems.map((item) => ({
                id: item.id,
                quantity: item.quantity,
                salePrice: Number(item.sale_price),
            })),
            payment_method: paymentMethod,
            amount_received: paymentMethod === "efectivo" ? payment : total,
            // Enviamos ID si existe (cliente de BD) o nombre/teléfono si es nuevo
            client_id: selectedCustomer?.id || null, 
            client_name: selectedCustomer?.id ? null : selectedCustomer?.name,
            client_phone: selectedCustomer?.id ? null : selectedCustomer?.phone,
        };

        router.post("/vender", saleData, {
            onSuccess: () => {
                toast({
                    title: "¡Venta Exitosa!",
                    description: paymentMethod === "efectivo" ? `Cambio: $${change.toFixed(2)}` : "Venta procesada correctamente",
                    className: "bg-green-500 text-white",
                });
                setCartItems([]);
                setShowCheckout(false);
                setAmountReceived("");
                setSelectedCustomer(null);
                setCustomerSearch("");
                setPaymentMethod("efectivo");
            },
            onError: (errors) => {
                console.error("Error en venta:", errors);
                toast({
                    title: "Error",
                    description: "No se pudo procesar la venta. Verifique los datos.",
                    variant: "destructive",
                });
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Vender" />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Header title="Punto de Venta" subtitle="Nueva Venta" />

                <div className="flex-1 flex overflow-hidden">
                    {/* Panel Izquierdo - Productos */}
                    <div className="flex-1 flex flex-col bg-gray-50/50 border-r border-gray-200">
                        <div className="p-4 bg-white border-b border-gray-100 shadow-sm z-10">
                            <div className="relative max-w-2xl mx-auto">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Buscar producto por nombre o código..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                            {filteredProducts.length === 0 ? (
                                <p className="text-center text-gray-400 mt-10">No se encontraron productos</p>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {filteredProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} onAdd={addToCart} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel Derecho - Carrito */}
                    <div className="w-[380px] lg:w-[450px] bg-white flex flex-col shadow-xl z-20 rounded-t-xl overflow-hidden">
                        <div className="p-4 bg-blue-600 text-white shadow-md">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5" />
                                    <h2 className="font-bold text-lg">Carrito</h2>
                                </div>
                                <span className="bg-white/20 px-3 py-0.5 rounded-full text-sm font-medium">
                                    {cartItems.length} items
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
                            {cartItems.length === 0 ? (
                                <p className="text-center text-gray-400 mt-10">Carrito vacío</p>
                            ) : (
                                cartItems.map((item) => (
                                    <CartItemRow
                                        key={item.id}
                                        item={item}
                                        onIncrease={() => updateQuantity(item.id, 1)}
                                        onDecrease={() => updateQuantity(item.id, -1)}
                                        onRemove={removeFromCart}
                                    />
                                ))
                            )}
                        </div>

                        {cartItems.length > 0 && (
                            <div className="bg-white p-4 border-t border-gray-100">
                                <div className="flex justify-between items-baseline mb-4">
                                    <span className="text-xl font-bold text-gray-800">Total</span>
                                    <span className="text-3xl font-extrabold text-blue-600">${total.toFixed(2)}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={clearCart}
                                        className="px-4 py-3 border border-red-100 text-red-600 rounded-xl font-semibold hover:bg-red-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => setShowCheckout(true)}
                                        className="px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                                    >
                                        Cobrar (F9)
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal Checkout */}
                {showCheckout && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-6">
                            <div className="flex justify-between items-center border-b pb-4">
                                <h2 className="text-xl font-bold">Procesar Pago</h2>
                                <button onClick={() => setShowCheckout(false)}>
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Método de Pago */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Método de Pago</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <PaymentMethodButton icon={Banknote} label="Efectivo" isSelected={paymentMethod === "efectivo"} onClick={() => setPaymentMethod("efectivo")} />
                                    <PaymentMethodButton icon={CreditCard} label="Tarjeta" isSelected={paymentMethod === "tarjeta"} onClick={() => setPaymentMethod("tarjeta")} />
                                    <PaymentMethodButton icon={DollarSign} label="Transferencia" isSelected={paymentMethod === "transferencia"} onClick={() => setPaymentMethod("transferencia")} />
                                </div>
                            </div>

                            {/* Cliente */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cliente (Opcional)</label>
                                
                                {isCreatingCustomer ? (
                                    // Modo: Crear Nuevo
                                    <div className="space-y-2 border p-3 rounded bg-gray-50 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-semibold text-blue-600">Nuevo Cliente</span>
                                            <button onClick={() => setIsCreatingCustomer(false)} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4"/></button>
                                        </div>
                                        <input
                                            className="w-full border p-2 rounded text-sm"
                                            placeholder="Nombre completo *"
                                            value={newCustomerName}
                                            onChange={(e) => setNewCustomerName(e.target.value)}
                                            autoFocus
                                        />
                                        <input
                                            className="w-full border p-2 rounded text-sm"
                                            placeholder="Teléfono (opcional)"
                                            value={newCustomerPhone}
                                            onChange={(e) => setNewCustomerPhone(e.target.value)}
                                        />
                                        <button onClick={handleCreateCustomer} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 text-sm font-medium">
                                            Usar este cliente
                                        </button>
                                    </div>
                                ) : (
                                    // Modo: Buscar o Seleccionado
                                    <div className="relative">
                                        {selectedCustomer ? (
                                            // Cliente Seleccionado
                                            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-blue-100 p-1.5 rounded-full"><User className="w-4 h-4 text-blue-600" /></div>
                                                    <div>
                                                        <p className="font-semibold text-sm text-gray-800">{selectedCustomer.name}</p>
                                                        {selectedCustomer.phone && <p className="text-xs text-gray-500">{selectedCustomer.phone}</p>}
                                                    </div>
                                                </div>
                                                <button onClick={handleRemoveClient} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4"/></button>
                                            </div>
                                        ) : (
                                            // Input de Búsqueda
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                        placeholder="Buscar cliente..."
                                                        value={customerSearch}
                                                        onChange={(e) => setCustomerSearch(e.target.value)}
                                                    />
                                                    
                                                    {/* Resultados de búsqueda (Dropdown) */}
                                                    {customerSearch && (
                                                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                                            {filteredClients.length > 0 ? (
                                                                filteredClients.map(client => (
                                                                    <div 
                                                                        key={client.id} 
                                                                        onClick={() => handleSelectClient(client)}
                                                                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-0 flex justify-between items-center"
                                                                    >
                                                                        <span>{client.name}</span>
                                                                        {client.phone && <span className="text-xs text-gray-400">{client.phone}</span>}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="p-3 text-sm text-gray-500 text-center">No encontrado</div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => setIsCreatingCustomer(true)}
                                                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600 border border-gray-200"
                                                    title="Crear nuevo cliente"
                                                >
                                                    <UserPlus className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Resumen y Pago */}
                            <div className="bg-blue-50 p-4 rounded-xl space-y-3">
                                <div className="flex justify-between text-xl font-bold">
                                    <span>Total:</span>
                                    <span className="text-blue-600">${total.toFixed(2)}</span>
                                </div>

                                {paymentMethod === "efectivo" && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <label className="font-semibold">Recibido:</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                autoFocus
                                                className="flex-1 border rounded p-2 font-bold text-lg"
                                                value={amountReceived}
                                                onChange={(e) => setAmountReceived(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && completeSale()}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="flex justify-between text-lg">
                                            <span>Cambio:</span>
                                            <span className={`font-bold ${change < 0 ? "text-red-500" : "text-green-600"}`}>
                                                ${change.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={completeSale}
                                className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg"
                            >
                                Confirmar Venta
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}