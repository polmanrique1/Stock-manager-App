import { useState, useEffect } from "react";
import CreateWarehouseModal from "../SubComponents/CreateWarehouseModal";

export default function WarehouseList(){

    const [warehouses, setWarehouses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {

        async function fetchData() {

            const token = localStorage.getItem("token");

            const data = await fetch("http://localhost:8080/warehouse", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const response = await data.json();

            setWarehouses(response);
        }

        fetchData();

    }, []);

    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-5xl mx-auto">

                <div className="flex justify-between items-center mb-8">

                    <h2 className="text-4xl font-bold text-gray-800"> Lista de Almacenes</h2>

                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 rounded-xl text-2xl font-bold transition duration-300 shadow-md">
                        +
                    </button>

                </div>

                <hr />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {
                        warehouses.map(warehouse => (
                            <div key={warehouse.id} className="bg-white p-6 shadow-lg rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-100">
                                {/* Imagen realista de almacén */}
                                <div className="flex justify-center mb-4">
                                    <img 
                                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop" 
                                        alt="Warehouse" 
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                </div>
                                
                                <h1 className="text-blue-700 text-xl font-bold mb-2 text-center">{warehouse.name}</h1>

                                <p className="text-blue-600 mb-1">📍 {warehouse.location}</p>

                                <p className="text-gray-500 font-semibold mt-3 mb-1">Contact:</p>

                                <p className="text-blue-600">📞 {warehouse.phoneNumber}</p>

                                <p className="text-blue-600">✉️ {warehouse.contactMail}</p>

                            </div>
                        ))
                    }
                </div>

            </div>

            <CreateWarehouseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onWarehouseCreated={(newWarehouse) => {
                    setWarehouses([...warehouses, newWarehouse]);
                }}
            />

        </div>
    )
}