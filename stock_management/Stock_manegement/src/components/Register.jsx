import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const register = async (e) => {

        e.preventDefault();

        try {

            setError("");

            const data = await fetch("http://localhost:8080/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            if (!data.ok) {
                throw new Error("Error al registrar usuario");
            }

            const response = await data.json();

            console.log("Registro exitoso", response);
            
            localStorage.setItem("token", response.token)
            navigate("/dashboard/products");

        } catch (error) {

            console.error("Error en el registro:", error);

            setError(error.message);

        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">

                <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
                    Register
                </h1>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={register} className="flex flex-col gap-5">

                    <div className="flex flex-col">

                        <label htmlFor="username" className="mb-2 font-medium text-gray-700">
                            Username
                        </label>

                        <input id="username" name="username" type="text" value={formData.username} onChange={handleChange} className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Introduce tu usuario" />

                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="email" className="mb-2 font-medium text-gray-700" >
                            Email
                        </label>

                        <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"placeholder="Introduce tu email"/>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="password" className="mb-2 font-medium text-gray-700">
                            Password
                        </label>

                        <input id="password" name="password" type="password" value={formData.password} onChange={handleChange}className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Introduce tu contraseña"/>
                    </div>

                
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition duration-300">
                        Registrarse
                    </button>

                </form>

            </div>

        </div>
    );
}