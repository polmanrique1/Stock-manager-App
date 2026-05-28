import { useState, useEffect } from "react";
import CreateProductModal from "../SubComponents/CreateProductModal";

export default function ProductAvilable(){

    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const token = localStorage.getItem("token");

            const data = await fetch("http://localhost:8080/product", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const response = await data.json();
            setProducts(response);
        }
        fetchData();
    }, []);

    return(
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-800">Productos</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 rounded-xl text-2xl font-bold transition duration-300 shadow-md"
                    >
                        +
                    </button>
                </div>
                <hr />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {
                        products.map(product => (
                            <div key={product.id} className="bg-white p-6 shadow-lg rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-100">
                                <img
                                    src={product.img}
                                    alt={product.name}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                                <h1 className="text-blue-700 text-xl font-bold mb-2">{product.name}</h1>
                                <p className="text-blue-600 mb-1">{product.description}</p>
                                <p className="text-blue-600">💰 {product.price}</p>    
                            </div>
                        ))
                    }
                </div>
            </div>

            <CreateProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProductCreated={(newProduct) => {
                    setProducts([...products, newProduct]);
                }}
            />
        </div>
    )
}