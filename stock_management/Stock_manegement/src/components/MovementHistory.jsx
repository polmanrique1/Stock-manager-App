import { useState, useEffect } from "react";

export default function MovementHistory() {
    const [movements, setMovements] = useState([]);
    const [showRecent, setShowRecent] = useState(false);

    useEffect(() => {
        fetchMovements();
    }, [showRecent]);

    async function fetchMovements() {
        const token = localStorage.getItem("token");

        const url = showRecent ? "http://localhost:8080/movement/recent" : "http://localhost:8080/movement";

            const res = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            const sorted = data.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );

            setMovements(sorted);
        
    }

    const downloadHistoryPDF = async () => {
        const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:8080/document/movementHistory",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Error downloading PDF");
            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "movement-history.pdf";

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getTypeColor = (type) => {
        switch (type) {
            case "addition":
                return "bg-green-100 text-green-700";
            case "sell":
                return "bg-red-100 text-red-700";
            case "transfer":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getTypeText = (type) => {
        switch (type) {
            case "addition":
                return "Stock Added";
            case "sell":
                return "Sale";
            case "transfer":
                return "Transfer";
            default:
                return type;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">
                            Movement History
                        </h1>

                        <p className="text-gray-400 text-sm mt-2">
                            Stock movement tracking
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowRecent(false)}
                            className={`px-4 py-2 rounded-lg transition ${
                                !showRecent
                                    ? "bg-black text-white"
                                    : "bg-gray-200 text-gray-700"
                            }`}
                        >
                            All
                        </button>

                        <button
                            onClick={() => setShowRecent(true)}
                            className={`px-4 py-2 rounded-lg transition ${
                                showRecent
                                    ? "bg-black text-white"
                                    : "bg-gray-200 text-gray-700"
                            }`}
                        >
                            Recent
                        </button>

                        <button
                            onClick={downloadHistoryPDF}
                            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                        >
                            Download PDF
                        </button>
                    </div>
                </div>

                {/* Empty state */}
                {movements.length === 0 ? (
                    <div className="bg-white rounded-lg border p-8 text-center">
                        <p className="text-gray-400">
                            No movements found
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {movements.map((movement) => (
                            <div key={movement.id} className="bg-white rounded-2xl border p-5 hover:shadow-lg transition">
                                {/* Top section */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">
                                            {getTypeText(movement.type)}
                                        </h3>

                                        <p className="text-xs text-gray-400 mt-1">
                                            {formatDate(movement.date)}
                                        </p>
                                    </div>

                                    <span className={`text-xs px-3 py-1 rounded-full ${getTypeColor(movement.type)}`}>
                                        {movement.type}
                                    </span>
                                </div>

                                {/* Product info */}
                                <div className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl">
                                    <img src={movement.product.img} alt={movement.product.name}className="w-16 h-16 object-cover rounded-lg" />

                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800">
                                            {movement.product.name}
                                        </h4>

                                        <p className="text-xs text-gray-400">
                                            {movement.product.description}
                                        </p>

                                        <p className="text-sm text-gray-600 mt-1">
                                            💰 {movement.product.price}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                                    <span>
                                        Product ID: {movement.product.id}
                                    </span>

                                    <span>
                                        Movement #{movement.id}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}