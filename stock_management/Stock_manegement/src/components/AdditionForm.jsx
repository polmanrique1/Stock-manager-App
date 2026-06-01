import { useEffect, useState } from "react";

export default function AdditionForm() {

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

    // USER
    useEffect(() => {
        async function fetchUser() {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch("http://localhost:8080/auth/me", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }
        fetchUser();
    }, []);

    // WAREHOUSES
    useEffect(() => {
        async function fetchWarehouses() {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch("http://localhost:8080/warehouse", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                const data = await response.json();
                setWarehouses(data);
            } catch (error) {
                console.error("Error fetching warehouses:", error);
            }
        }
        fetchWarehouses();
    }, []);

    // PRODUCTS
    useEffect(() => {
        async function fetchProducts() {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch("http://localhost:8080/product", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                const data = await response.json();
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
            setMessage("User not authenticated");
            return;
        }

        if (!formData.productId || !formData.warehouseId || !formData.quantity) {
            setMessageType("error");
            setMessage("Please complete all fields");
            return;
        }

        setLoading(true);
        setMessage("");
        setMessageType("");

        const bodyData = {
            priority: formData.priority,
            userId: user.id,
            movement: {
                type: "addition",
                productId: safeNumber(formData.productId),
                sourceWarehouseId: safeNumber(formData.warehouseId),
                destinationWarehouseId: 0,
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
                setMessage("Order created successfully");
                setFormData({
                    priority: "LOW",
                    productId: "",
                    warehouseId: "",
                    quantity: ""
                });
            } else {
                setMessageType("error");
                setMessage("Error creating order");
            }
        } catch (error) {
            setMessageType("error");
            setMessage("Connection error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-8">
            <div className="bg-white w-full max-w-xl rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Add Stock
                </h2>

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                    </select>

                    <select
                        name="productId"
                        value={formData.productId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    >
                        <option value="">Product</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>

                    <select
                        name="warehouseId"
                        value={formData.warehouseId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    >
                        <option value="">Warehouse</option>
                        {warehouses.map(w => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                    </select>

                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Quantity"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />

                    <button
                        type="submit"
                        disabled={loading || !user}
                        className={`w-full py-2 px-4 rounded font-semibold transition-colors ${
                            loading || !user
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    >
                        {loading ? "Processing..." : "Create Order"}
                    </button>

                    {message && (
                        <p className={`text-center text-sm p-2 rounded ${
                            messageType === 'success' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                        }`}>
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}