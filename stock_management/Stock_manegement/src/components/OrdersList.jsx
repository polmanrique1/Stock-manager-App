import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OrdersList() {

    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        async function fetchData() {

            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:8080/order", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                console.error("Error cargando órdenes");
                return;
            }

            const data = await response.json();
            setOrders(data);
        }

        fetchData();

    }, []);

    const navigateToDetail = (id) => {
        navigate(`/dashboard/orderDetail/${id}`);
        localStorage.setItem("orderId", id);
    };

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case "LOW":
                return "border-green-200 bg-green-50 text-green-800";
            case "MEDIUM":
                return "border-orange-200 bg-orange-50 text-orange-800";
            case "HIGH":
                return "border-red-200 bg-red-50 text-red-800";
            default:
                return "border-gray-200 bg-gray-50 text-gray-800";
        }
    };

    // 🔥 SOLO PENDIENTES
    const pendingOrders = orders.filter(order => order.accepted === false);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                Pending Orders
            </h1>

            {pendingOrders.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                    🎉 No pending orders
                </div>
            ) : (
                <div className="flex flex-col gap-4">

                    {pendingOrders.map((order) => (

                        <div
                            key={order.id}
                            className={`rounded-2xl border shadow-sm p-5 flex items-center justify-between transition-all hover:shadow-lg hover:scale-[1.01] ${getPriorityStyle(order.priority)}`}
                        >

                            {/* LEFT */}
                            <div className="flex flex-col gap-1">

                                <h3 className="text-lg font-bold capitalize flex items-center gap-2">
                                    ⏳ {order.movementData?.type}
                                </h3>

                                <p className="text-sm opacity-80">
                                    Priority: <span className="font-semibold">{order.priority}</span>
                                </p>

                                <p className="text-xs opacity-70">
                                    Quantity: {order.movementData?.quantity}
                                </p>

                            </div>

                            {/* RIGHT */}
                            <button
                                onClick={() => navigateToDetail(order.id)}
                                className="bg-white px-4 py-2 rounded-xl font-semibold shadow-sm border hover:bg-gray-100 transition"
                            >
                                View details →
                            </button>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}