import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function OrderDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [product, setProduct] = useState(null);
    const [sourceWarehouse, setSourceWarehouse] = useState(null);
    const [destinationWarehouse, setDestinationWarehouse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const isValidId = (val) => val !== null && val !== undefined && Number(val) > 0;

    useEffect(() => {
        let isMounted = true;

        async function fetchAll() {
            if (!id) return;

            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");

            try {
                const orderRes = await fetch(`http://localhost:8080/order/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!orderRes.ok) {
                    throw new Error(`Error fetching order: ${orderRes.status}`);
                }

                const orderJson = await orderRes.json();
                const realOrder = orderJson.data ?? orderJson;

                if (isMounted) setOrder(realOrder);

                const movement = realOrder?.movementData;
                if (!movement) {
                    if (isMounted) setLoading(false);
                    return;
                }

                const { productId, sourceWarehouseId, destinationWarehouseId } = movement;

                // PRODUCT
                if (isValidId(productId)) {
                    try {
                        const productRes = await fetch(
                            `http://localhost:8080/product/${productId}`,
                            { headers: { "Authorization": `Bearer ${token}` } }
                        );

                        if (productRes.ok) {
                            const productJson = await productRes.json();
                            if (isMounted) setProduct(productJson.data ?? productJson);
                        } else {
                            if (isMounted) setProduct(null);
                        }
                    } catch {
                        if (isMounted) setProduct(null);
                    }
                }

                // SOURCE WAREHOUSE
                if (isValidId(sourceWarehouseId)) {
                    try {
                        const sourceRes = await fetch(
                            `http://localhost:8080/warehouse/${sourceWarehouseId}`,
                            { headers: { "Authorization": `Bearer ${token}` } }
                        );

                        if (sourceRes.ok) {
                            const sourceJson = await sourceRes.json();
                            if (isMounted) setSourceWarehouse(sourceJson.data ?? sourceJson);
                        } else {
                            if (isMounted) setSourceWarehouse(null);
                        }
                    } catch {
                        if (isMounted) setSourceWarehouse(null);
                    }
                } else {
                    if (isMounted) setSourceWarehouse(null);
                }

                // DESTINATION WAREHOUSE
                if (isValidId(destinationWarehouseId)) {
                    try {
                        const destRes = await fetch(
                            `http://localhost:8080/warehouse/${destinationWarehouseId}`,
                            { headers: { "Authorization": `Bearer ${token}` } }
                        );

                        if (destRes.ok) {
                            const destJson = await destRes.json();
                            if (isMounted) setDestinationWarehouse(destJson.data ?? destJson);
                        } else {
                            if (isMounted) setDestinationWarehouse(null);
                        }
                    } catch {
                        if (isMounted) setDestinationWarehouse(null);
                    }
                } else {
                    if (isMounted) setDestinationWarehouse(null);
                }

                if (isMounted) setLoading(false);

            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        }

        fetchAll();
        return () => { isMounted = false; };
    }, [id]);

    const handleAccept = async () => {
        if (!window.confirm("Are you sure you want to accept this order?")) return;

        setProcessing(true);
        const token = localStorage.getItem("token");

        try {
            await fetch(`http://localhost:8080/orderProcess/accept/${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            navigate("/dashboard/orderList");

        } catch {
            navigate("/dashboard/orderList");
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!window.confirm("Are you sure you want to reject this order?")) return;

        setProcessing(true);
        const token = localStorage.getItem("token");

        try {
            await fetch(`http://localhost:8080/orderProcess/reject/${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            navigate("/dashboard/orderList");

        } catch {
            navigate("/dashboard/orderList");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">

            <div className="bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Order Details #{id}
                    </h1>

                    <div className="flex gap-3">
                        <button
                            onClick={handleReject}
                            disabled={processing || order?.accepted === true}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                processing || order?.accepted === true
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-red-600 hover:bg-red-700 text-white"
                            }`}
                        >
                            {processing ? "..." : "Reject"}
                        </button>

                        <button
                            onClick={handleAccept}
                            disabled={processing || order?.accepted === true}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                processing || order?.accepted === true
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                        >
                            {processing ? "..." : "Accept"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">

                {/* Status */}
                <div className="mb-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        order?.accepted === true
                            ? "bg-green-100 text-green-800"
                            : order?.accepted === false
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                    }`}>
                        {order?.accepted === true && "Accepted"}
                        {order?.accepted === false && "Rejected"}
                        {order?.accepted == null && "Pending"}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <div className="bg-white rounded-2xl shadow p-5">
                        <h2 className="text-lg font-semibold mb-3 border-b pb-2">
                            Order Information
                        </h2>

                        <div className="space-y-2">
                            <p><span className="text-gray-500 text-sm">Order ID:</span> {order?.id}</p>
                            <p><span className="text-gray-500 text-sm">Movement Type:</span> {order?.movementData?.type || "-"}</p>
                            <p><span className="text-gray-500 text-sm">Quantity:</span> {order?.movementData?.quantity || "-"}</p>
                            <p><span className="text-gray-500 text-sm">Priority:</span> {order?.priority || "-"}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow p-5">
                        <h2 className="text-lg font-semibold mb-3 border-b pb-2">
                            Product Information
                        </h2>

                        <div className="space-y-2">
                            <p><span className="text-gray-500 text-sm">Name:</span> {product?.name || "-"}</p>
                            <p><span className="text-gray-500 text-sm">Description:</span> {product?.description || "-"}</p>
                            {product?.sku && (
                                <p><span className="text-gray-500 text-sm">SKU:</span> {product.sku}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow p-5">
                        <h2 className="text-lg font-semibold mb-3 border-b pb-2">
                            Source Warehouse
                        </h2>

                        {sourceWarehouse ? (
                            <div className="space-y-2">
                                <p><span className="text-gray-500 text-sm">Name:</span> {sourceWarehouse.name}</p>
                                {sourceWarehouse.location && (
                                    <p><span className="text-gray-500 text-sm">Location:</span> {sourceWarehouse.location}</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">Not applicable</p>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow p-5">
                        <h2 className="text-lg font-semibold mb-3 border-b pb-2">
                            Destination Warehouse
                        </h2>

                        {destinationWarehouse ? (
                            <div className="space-y-2">
                                <p><span className="text-gray-500 text-sm">Name:</span> {destinationWarehouse.name}</p>
                                {destinationWarehouse.location && (
                                    <p><span className="text-gray-500 text-sm">Location:</span> {destinationWarehouse.location}</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">Not applicable</p>
                        )}
                    </div>
                </div>

                {order?.userResponsable && (
                    <div className="mt-6 bg-white rounded-2xl shadow p-5">
                        <h2 className="text-lg font-semibold mb-3 border-b pb-2">
                            Responsible User
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <p><span className="text-gray-500 text-sm">Username:</span> {order.userResponsable.username || "-"}</p>
                            <p><span className="text-gray-500 text-sm">Email:</span> {order.userResponsable.email || "-"}</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}