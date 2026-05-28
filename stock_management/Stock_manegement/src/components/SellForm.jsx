import { useEffect, useState } from "react";

export default function SellForm() {

    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState({
        priority: "LOW",
        productId: "",
        warehouseId: "",
        quantity: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const safeNumber = (v) => (v === "" ? null : Number(v));

    useEffect(() => {
        async function fetchUser() {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://localhost:8080/auth/me", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                const data = await res.json();
                setUser(data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        async function fetchWarehouses() {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://localhost:8080/warehouse", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                const data = await res.json();
                setWarehouses(data);
            } catch (error) {
                console.error("Error fetching warehouses:", error);
            }
        }
        fetchWarehouses();
    }, []);

    useEffect(() => {
        async function fetchProducts() {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://localhost:8080/product", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        }
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setMessageType("error");
            setMessage("Usuario no autenticado");
            return;
        }

        if (!formData.productId || !formData.warehouseId || !formData.quantity) {
            setMessageType("error");
            setMessage("Por favor, completa todos los campos");
            return;
        }

        setLoading(true);
        setMessage("");
        setMessageType("");

        // Configuración correcta: sourceWarehouseId es el warehouse seleccionado
        // destinationWarehouseId es null para ventas
        const bodyData = {
            priority: formData.priority,
            userId: user.id,
            movement: {
                type: "sell",
                productId: safeNumber(formData.productId),
                sourceWarehouseId: safeNumber(formData.warehouseId), // ✅ Warehouse como origen
                destinationWarehouseId: null, // ✅ Null para ventas
                quantity: safeNumber(formData.quantity)
            }
        };

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:8080/order", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyData)
            });

            if (response.ok) {
                setMessageType("success");
                setMessage("✅ Orden de venta creada correctamente");
                setFormData({
                    priority: "LOW",
                    productId: "",
                    warehouseId: "",
                    quantity: ""
                });
            } else {
                const errorText = await response.text();
                setMessageType("error");
                setMessage(`❌ Error creando la orden: ${response.status}`);
            }
        } catch (error) {
            setMessageType("error");
            setMessage(`❌ Error de conexión: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-8">
            <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Vender Producto
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                    Registra una venta de inventario
                </p>

                <form onSubmit={onSubmit} className="flex flex-col gap-5">
                    {/* Prioridad */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prioridad
                        </label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                        >
                            <option value="LOW">LOW - Baja prioridad</option>
                            <option value="MEDIUM">MEDIUM - Prioridad media</option>
                            <option value="HIGH">HIGH - Alta prioridad</option>
                        </select>
                    </div>

                    {/* Producto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Producto
                        </label>
                        <select
                            name="productId"
                            value={formData.productId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                        >
                            <option value="">Selecciona un producto</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name} {p.sku ? `(${p.sku})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Almacén de origen */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Almacén de origen
                        </label>
                        <select
                            name="warehouseId"
                            value={formData.warehouseId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                        >
                            <option value="">Selecciona un almacén</option>
                            {warehouses.map(w => (
                                <option key={w.id} value={w.id}>
                                    {w.name} {w.location ? `- ${w.location}` : ''}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            El stock se retirará de este almacén
                        </p>
                    </div>

                    {/* Cantidad */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cantidad
                        </label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="Ej: 10"
                            min="1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Botón submit */}
                    <button
                        type="submit"
                        disabled={loading || !user}
                        className={`
                            mt-2 w-full py-2 px-4 rounded-lg font-semibold transition-colors
                            ${loading || !user
                                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }
                        `}
                    >
                        {loading ? "Procesando..." : "Crear Orden de Venta"}
                    </button>

                    {/* Mensaje */}
                    {message && (
                        <div className={`
                            p-3 rounded-lg text-sm text-center
                            ${messageType === 'success' 
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-red-100 text-red-700 border border-red-200'
                            }
                        `}>
                            {message}
                        </div>
                    )}

                    {/* Info usuario */}
                    {user && (
                        <div className="text-center text-xs text-gray-400 pt-4 border-t">
                            Creando orden como: {user.email}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}