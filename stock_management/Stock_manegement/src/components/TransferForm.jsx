import { useEffect, useState } from "react";

export default function TransferForm() {

    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState({
        priority: "LOW",
        sourceWarehouseId: "",
        destinationWarehouseId: "",
        productId: "",
        quantity: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // USER
    useEffect(() => {

        async function fetchUser() {

            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:8080/auth/me", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();
            setUser(data);
        }

        fetchUser();

    }, []);

    // WAREHOUSES
    useEffect(() => {

        async function fetchWarehouses() {

            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:8080/warehouse", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();
            setWarehouses(data);
        }

        fetchWarehouses();

    }, []);

    // PRODUCTS
    useEffect(() => {

        async function fetchProducts() {

            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:8080/product", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();
            setProducts(data);
        }

        fetchProducts();

    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const onSubmit = async (e) => {

        e.preventDefault();

        const token = localStorage.getItem("token");

        // 🔥 DEBUG CLARO
        console.log("🧠 FORM DATA RAW:", formData);

        const bodyData = {
            priority: formData.priority,
            userId: user?.id,
            movement: {
                type: "transfer",
                productId: Number(formData.productId),
                sourceWarehouseId: Number(formData.sourceWarehouseId),
                destinationWarehouseId: Number(formData.destinationWarehouseId),
                quantity: Number(formData.quantity)
            }
        };

        console.log("📦 BODY SENT:", bodyData);

        setLoading(true);
        setMessage("");

        const response = await fetch("http://localhost:8080/order", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyData)
        });

        if (!response.ok) {
            setMessage("Error creando la orden");
            setLoading(false);
            return;
        }

        setMessage("Orden creada correctamente");

        setFormData({
            priority: "LOW",
            sourceWarehouseId: "",
            destinationWarehouseId: "",
            productId: "",
            quantity: ""
        });

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-8">

            <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-8">

                <h2 className="text-3xl font-bold text-gray-800 mb-8">
                    Crear Orden de Transferencia
                </h2>

                {user && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl mb-6">
                        Usuario: <strong>{user.username}</strong>
                    </div>
                )}

                <form onSubmit={onSubmit} className="flex flex-col gap-6">

                    {/* PRIORITY */}
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                    >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                    </select>

                    {/* PRODUCT */}
                    <select
                        name="productId"
                        value={formData.productId}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                    >
                        <option value="">Producto</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>

                    {/* SOURCE (ORIGEN REAL) */}
                    <select
                        name="sourceWarehouseId"
                        value={formData.sourceWarehouseId}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                    >
                        <option value="">Warehouse ORIGEN</option>
                        {warehouses.map(w => (
                            <option key={w.id} value={w.id}>
                                {w.name}
                            </option>
                        ))}
                    </select>

                    {/* DESTINATION (DESTINO REAL) */}
                    <select
                        name="destinationWarehouseId"
                        value={formData.destinationWarehouseId}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                    >
                        <option value="">Warehouse DESTINO</option>
                        {warehouses.map(w => (
                            <option key={w.id} value={w.id}>
                                {w.name}
                            </option>
                        ))}
                    </select>

                    {/* QUANTITY */}
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                        placeholder="Cantidad"
                    />

                    <button
                        disabled={loading || !user}
                        className="bg-blue-500 text-white p-3 rounded-xl"
                    >
                        {loading ? "Procesando..." : "Crear orden"}
                    </button>

                    {message && (
                        <p className="text-center text-gray-700">
                            {message}
                        </p>
                    )}

                </form>
            </div>
        </div>
    );
}