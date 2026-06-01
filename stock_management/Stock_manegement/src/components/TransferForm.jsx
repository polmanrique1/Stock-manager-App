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

        if (
            !formData.productId ||
            !formData.sourceWarehouseId ||
            !formData.destinationWarehouseId ||
            !formData.quantity
        ) {
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
                type: "transfer",
                productId: safeNumber(formData.productId),
                sourceWarehouseId: safeNumber(formData.sourceWarehouseId),
                destinationWarehouseId: safeNumber(formData.destinationWarehouseId),
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
                setMessage("Transfer order created successfully");
                setFormData({
                    priority: "LOW",
                    sourceWarehouseId: "",
                    destinationWarehouseId: "",
                    productId: "",
                    quantity: ""
                });
            } else {
                setMessageType("error");
                setMessage(`Error creating order (${response.status})`);
            }
        } catch (error) {
            setMessageType("error");
            setMessage(`Connection error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-8">
            <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-8">

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Transfer Stock
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                    Move inventory between warehouses
                </p>

                <form onSubmit={onSubmit} className="flex flex-col gap-5">

                    {/* Priority */}
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                    </select>

                    {/* Product */}
                    <select
                        name="productId"
                        value={formData.productId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                        <option value="">Select a product</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>

                    {/* Source */}
                    <select
                        name="sourceWarehouseId"
                        value={formData.sourceWarehouseId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                        <option value="">Source warehouse</option>
                        {warehouses.map(w => (
                            <option key={w.id} value={w.id}>
                                {w.name}
                            </option>
                        ))}
                    </select>

                    {/* Destination */}
                    <select
                        name="destinationWarehouseId"
                        value={formData.destinationWarehouseId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                        <option value="">Destination warehouse</option>
                        {warehouses.map(w => (
                            <option key={w.id} value={w.id}>
                                {w.name}
                            </option>
                        ))}
                    </select>

                    {/* Quantity */}
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Quantity"
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />

                    {/* Button */}
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
                        {loading ? "Processing..." : "Create Transfer Order"}
                    </button>

                    {/* Message */}
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

                    {/* User info */}
                    {user && (
                        <div className="text-center text-xs text-gray-400 pt-4 border-t">
                            Creating order as: {user.email}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}