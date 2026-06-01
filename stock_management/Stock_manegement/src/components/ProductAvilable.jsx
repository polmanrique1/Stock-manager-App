import { useState, useEffect } from "react";
import CreateProductModal from "../SubComponents/CreateProductModal";

export default function ProductAvailable() {
    const [products, setProducts] = useState([]);
    const [warehouseData, setWarehouseData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("http://localhost:8080/product", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const productsResponse = await res.json();
                setProducts(productsResponse);

                const warehouseResults = await Promise.all(
                    productsResponse.map(async (product) => {
                        const warehouseRes = await fetch(
                            `http://localhost:8080/inventory/warehouse/${product.id}`,
                            {
                                method: "GET",
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json",
                                },
                            }
                        );

                        const warehouses = await warehouseRes.json();

                        return {
                            productId: product.id,
                            warehouses,
                        };
                    })
                );

                const warehouseMap = {};

                warehouseResults.forEach((item) => {
                    warehouseMap[item.productId] = item.warehouses;
                });

                setWarehouseData(warehouseMap);
            } catch (error) {
                console.error("Error loading products:", error);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">
                            Products
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Available catalog
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-xl text-2xl font-bold transition shadow-md"
                    >
                        +
                    </button>
                </div>

                <hr className="mb-6" />

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition border border-gray-100"
                        >

                            <img
                                src={product.img}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />

                            <h1 className="text-blue-700 text-xl font-bold mb-2">
                                {product.name}
                            </h1>

                            <p className="text-gray-600 mb-1">
                                {product.description}
                            </p>

                            <p className="text-gray-700 font-medium mb-3">
                                {product.price} €
                            </p>

                            {/* Warehouses */}
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">
                                    Warehouses:
                                </h3>

                                {warehouseData[product.id]?.length > 0 ? (
                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                        {warehouseData[product.id].map(
                                            (warehouse, index) => (
                                                <li key={index}>
                                                    {warehouse}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-400">
                                        No stock available
                                    </p>
                                )}
                            </div>

                        </div>
                    ))}

                </div>
            </div>

            <CreateProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProductCreated={(newProduct) => {
                    setProducts((prev) => [...prev, newProduct]);
                }}
            />
        </div>
    );
}