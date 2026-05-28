import { useState } from "react";

export default function CreateWarehouseModal({
    isOpen,
    onClose,
    onWarehouseCreated
}) {

    // Warehouse structure
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        phoneNumber: "",
        contactMail: ""
    });

    if (!isOpen) return null;

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            console.log("TOKEN:", token);

            const response = await fetch(
                "http://localhost:8080/warehouse",
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        location: formData.location,
                        phoneNumber: formData.phoneNumber,
                        contactMail: formData.contactMail
                    })
                }
            );

            if (!response.ok) {

                const errorText = await response.text();

                console.log(errorText);

                throw new Error("Error creando warehouse");
            }

            const responseData = await response.json();

            console.log("RESPUESTA:", responseData);

            const createdWarehouse =
                responseData.data ||
                responseData.object ||
                responseData.warehouse ||
                responseData;

            onWarehouseCreated(createdWarehouse);

            setFormData({
                name: "",
                location: "",
                phoneNumber: "",
                contactMail: ""
            });

            onClose();

        } catch (error) {

            console.error(error);
        }
    };

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8">

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-3xl font-bold text-gray-800">
                        Nuevo Warehouse
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-2xl text-gray-500 hover:text-red-500"
                    >
                        ✕
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                >

                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre del warehouse"
                        value={formData.name}
                        onChange={handleChange}
                        className="border rounded-xl p-3"
                        required
                    />

                    <input
                        type="text"
                        name="location"
                        placeholder="Ubicación"
                        value={formData.location}
                        onChange={handleChange}
                        className="border rounded-xl p-3"
                        required
                    />

                    <input
                        type="text"
                        name="phoneNumber"
                        placeholder="Número de teléfono"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="border rounded-xl p-3"
                        required
                    />

                    <input
                        type="email"
                        name="contactMail"
                        placeholder="Correo de contacto"
                        value={formData.contactMail}
                        onChange={handleChange}
                        className="border rounded-xl p-3"
                        required
                    />

                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition"
                    >
                        Crear Warehouse
                    </button>

                </form>

            </div>

        </div>
    );
}