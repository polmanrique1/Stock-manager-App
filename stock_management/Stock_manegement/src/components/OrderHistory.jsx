import { useState, useEffect } from "react";

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        async function fetchdata() {
            const token = localStorage.getItem("token");

                const data = await fetch("http://localhost:8080/order", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                const response = await data.json();

                const acceptedOrders = response.filter(order => order.accepted === true);

                acceptedOrders.sort(
                    (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
                );

                setOrders(acceptedOrders);

            
        }

        fetchdata();
    }, []);

    const downloadHistoryPDF = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                "http://localhost:8080/document/orderHistory",
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Error downloading PDF");
            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "order-history.pdf";

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error downloading PDF:", error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTypeText = (type) => {
        switch(type) {
            case 'addition': return 'Adición de stock';
            case 'sell': return 'Venta';
            case 'transfer': return 'Transferencia';
            default: return type;
        }
    };

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'HIGH': return 'bg-red-100 text-red-800';
            case 'MEDIUM': return 'bg-orange-100 text-orange-800';
            case 'LOW': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto">

                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">
                            Historial
                        </h1>

                        <p className="text-gray-400 text-sm mt-2">
                            Órdenes completadas
                        </p>
                    </div>

                    <button
                        onClick={downloadHistoryPDF}
                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                        Descargar PDF
                    </button>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg border p-8 text-center">
                        <p className="text-gray-400">
                            No hay órdenes en el historial
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-lg border p-4 hover:shadow transition-shadow"
                            >

                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-medium text-gray-800">
                                            {getTypeText(order.movementData?.type)}
                                        </h3>

                                        <p className="text-xs text-gray-400 mt-1">
                                            {formatDate(order.orderDate)}
                                        </p>
                                    </div>

                                    <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(order.priority)}`}>
                                        {order.priority}
                                    </span>
                                </div>

                                {order.userResponsable && (
                                    <div className="mb-3 pb-2 border-b border-gray-100">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">
                                                Responsable:
                                            </span>

                                            <span className="text-gray-700 font-medium">
                                                {order.userResponsable.username ||
                                                    order.userResponsable.email}
                                            </span>
                                        </div>
                                    </div>
                                )}


                                <div className="text-sm text-gray-600 space-y-1">

                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Producto ID:
                                        </span>

                                        <span>
                                            {order.movementData?.productId}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Cantidad:
                                        </span>

                                        <span>
                                            {order.movementData?.quantity} unidades
                                        </span>
                                    </div>

                                    {order.movementData?.sourceWarehouseId > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">
                                                Almacén origen:
                                            </span>

                                            <span>
                                                #{order.movementData.sourceWarehouseId}
                                            </span>
                                        </div>
                                    )}

                                    {order.movementData?.destinationWarehouseId > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">
                                                Almacén destino:
                                            </span>

                                            <span>
                                                #{order.movementData.destinationWarehouseId}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-3 pt-2 border-t text-xs text-gray-300">
                                    Orden #{order.id}
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}