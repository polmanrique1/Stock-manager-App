import { useState } from "react";

export default function CreateProductModal({
    isOpen,
    onClose,
    onProductCreated
}) {

    const [formData, setFormData] = useState({
        img: "",
        name: "",
        description: "",
        price: ""
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

        const token = localStorage.getItem("token");

        console.log("TOKEN:", token);

        const response = await fetch(
            "http://localhost:8080/product",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    img: formData.img,
                    name: formData.name,
                    description: formData.description,
                    price: Number(formData.price)
                })
            }
        );

        if (!response.ok) {

            const errorText = await response.text();

            console.log(errorText);

            throw new Error("Error creating product");
        }

        const responseData = await response.json();

        console.log("RESPONSE:", responseData);

        const createdProduct =
            responseData.data ||
            responseData.object ||
            responseData.product ||
            responseData;

        onProductCreated(createdProduct);

        setFormData({
            img: "",
            name: "",
            description: "",
            price: ""
        });

        onClose();
    };

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8">

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-3xl font-bold text-gray-800">
                        New Product
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
                        name="img"
                        placeholder="Image URL"
                        value={formData.img}
                        onChange={handleChange}
                        className="border rounded-xl p-3"
                        required
                    />

                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border rounded-xl p-3"
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="border rounded-xl p-3 min-h-28"
                        required
                    />

                    <input
                        type="number"
                        step="0.01"
                        name="price"
                        placeholder="Price"
                        value={formData.price}
                        onChange={handleChange}
                        className="border rounded-xl p-3"
                        required
                    />

                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition"
                    >
                        Create Product
                    </button>

                </form>

            </div>

        </div>
    );
}