import { useState, useEffect } from "react";

export default function ProductList() {

    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(1);

    // asc | desc
    const [sortOrder, setSortOrder] = useState("");

    useEffect(() => {

        async function fetchWarehouses() {

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:8080/warehouse",
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Error loading warehouses");
            }

            const data = await response.json();
            setWarehouses(data);
        }

        fetchWarehouses();

    }, []);

    useEffect(() => {

        async function fetchProducts() {

            const token = localStorage.getItem("token");

            let endpoint = `http://localhost:8080/inventory/${selectedWarehouse}`;

            if (sortOrder === "asc") {
                endpoint = `http://localhost:8080/inventory/${selectedWarehouse}/qnt/asc`;
            }

            if (sortOrder === "desc") {
                endpoint = `http://localhost:8080/inventory/${selectedWarehouse}/qnt/desc`;
            }

            const response = await fetch(endpoint, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Error loading products");
            }

            const data = await response.json();
            setProducts(data);
        }

        fetchProducts();

    }, [selectedWarehouse, sortOrder]);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <h2 className="text-3xl font-bold mb-8 text-gray-800">
                    Product List
                </h2>

                {/* Filters */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center gap-4">

                    {/* Warehouse select */}
                    <select
                        value={selectedWarehouse}
                        onChange={(e) => setSelectedWarehouse(e.target.value)}
                        className="w-full md:w-80 p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        {warehouses.map((warehouse) => (
                            <option key={warehouse.id} value={warehouse.id}>
                                {warehouse.name}
                            </option>
                        ))}
                    </select>

                    {/* Sort buttons */}
                    <div className="flex gap-3">

                        <button
                            onClick={() => setSortOrder("asc")}
                            className={`px-4 py-2 rounded-xl transition font-medium ${
                                sortOrder === "asc"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white border hover:bg-gray-50"
                            }`}
                        >
                            Stock ↑
                        </button>

                        <button
                            onClick={() => setSortOrder("desc")}
                            className={`px-4 py-2 rounded-xl transition font-medium ${
                                sortOrder === "desc"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white border hover:bg-gray-50"
                            }`}
                        >
                            Stock ↓
                        </button>

                        <button
                            onClick={() => setSortOrder("")}
                            className={`px-4 py-2 rounded-xl transition font-medium ${
                                sortOrder === ""
                                    ? "bg-black text-white"
                                    : "bg-white border hover:bg-gray-50"
                            }`}
                        >
                            Reset
                        </button>

                    </div>

                </div>

                {/* List */}
                <div className="flex flex-col gap-4">

                    {products.map((inventory, index) => (

                        <div
                            key={inventory.id || index}
                            className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-5 hover:shadow-lg transition"
                        >

                            {/* Image */}
                            <div className="w-28 h-28 flex-shrink-0 overflow-hidden rounded-xl">
                                <img
                                    src={inventory.product.img}
                                    alt={inventory.product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <h3 className="text-2xl font-semibold text-gray-800">
                                    {inventory.product.name}
                                </h3>

                                <p className="text-gray-500 mt-1">
                                    {inventory.product.description}
                                </p>
                            </div>

                            {/* Price + Stock */}
                            <div className="text-right">
                                <p className="text-2xl font-bold text-blue-600">
                                    {inventory.product.price}€
                                </p>

                                <p className="text-gray-700 mt-2">
                                    Stock: {inventory.quantity}
                                </p>
                            </div>

                        </div>

                    ))}

                </div>

            </div>
        </div>
    );
}