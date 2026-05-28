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

                if (isMounted) {
                    setOrder(realOrder);
                }

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
                            {
                                headers: {
                                    "Authorization": `Bearer ${token}`
                                }
                            }
                        );

                        if (productRes.ok) {
                            const productJson = await productRes.json();
                            if (isMounted) setProduct(productJson.data ?? productJson);
                        } else {
                            if (isMounted) setProduct(null);
                        }
                    } catch (err) {
                        if (isMounted) setProduct(null);
                    }
                }

                // SOURCE WAREHOUSE
                if (isValidId(sourceWarehouseId)) {
                    try {
                        const sourceRes = await fetch(
                            `http://localhost:8080/warehouse/${sourceWarehouseId}`,
                            {
                                headers: {
                                    "Authorization": `Bearer ${token}`
                                }
                            }
                        );

                        if (sourceRes.ok) {
                            const sourceJson = await sourceRes.json();
                            if (isMounted) setSourceWarehouse(sourceJson.data ?? sourceJson);
                        } else {
                            if (isMounted) setSourceWarehouse(null);
                        }
                    } catch (err) {
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
                            {
                                headers: {
                                    "Authorization": `Bearer ${token}`
                                }
                            }
                        );

                        if (destRes.ok) {
                            const destJson = await destRes.json();
                            if (isMounted) setDestinationWarehouse(destJson.data ?? destJson);
                        } else {
                            if (isMounted) setDestinationWarehouse(null);
                        }
                    } catch (err) {
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

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleAccept = async () => {
        if (!window.confirm("¿Estás seguro de que quieres aceptar esta orden?")) {
            return;
        }

        setProcessing(true);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:8080/orderProcess/accept/${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            // Redirigir directamente sin mostrar mensaje
            navigate("/dashboard/orderList");
            
        } catch (err) {
            // En caso de error, también redirigir
            navigate("/dashboard/orderList");
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!window.confirm("¿Estás seguro de que quieres rechazar esta orden?")) {
            return;
        }

        setProcessing(true);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:8080/orderProcess/reject/${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            // Redirigir directamente sin mostrar mensaje
            navigate("/dashboard/orderList");
            
        } catch (err) {
            // En caso de error, también redirigir
            navigate("/dashboard/orderList");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600">Cargando...</p>
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
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header con botones */}
            <div className="bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Detalles de la Orden #{id}
                        </h1>
                        <div className="flex gap-3">
                            <button
                                onClick={handleReject}
                                disabled={processing || order?.accepted === true}
                                className={`
                                    px-4 py-2 rounded font-semibold transition-colors
                                    ${processing || order?.accepted === true
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700 text-white'
                                    }
                                `}
                            >
                                {processing ? "..." : "Rechazar"}
                            </button>
                            <button
                                onClick={handleAccept}
                                disabled={processing || order?.accepted === true}
                                className={`
                                    px-4 py-2 rounded font-semibold transition-colors
                                    ${processing || order?.accepted === true
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                    }
                                `}
                            >
                                {processing ? "..." : "Aceptar"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Estado de la orden */}
                <div className="mb-6">
                    <span className={`
                        inline-block px-3 py-1 rounded-full text-sm font-semibold
                        ${order?.accepted === true 
                            ? 'bg-green-100 text-green-800' 
                            : order?.accepted === false
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                        }
                    `}>
                        {order?.accepted === true && "Aceptada"}
                        {order?.accepted === false && "Rechazada"}
                        {(order?.accepted === null || order?.accepted === undefined) && "Pendiente"}
                    </span>
                </div>

                {/* Grid de información */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Información de la orden */}
                    <div className="bg-white rounded shadow p-5">
                        <h2 className="text-lg font-semibold mb-3 border-b pb-2">
                            Información de la Orden
                        </h2>
                        <div className="space-y-2">
                            <div>
                                <label className="text-sm text-gray-500">ID de Orden</label>
                                <p className="text-gray-900">{order?.id}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Tipo de Movimiento</label>
                                <p className="text-gray-900">{order?.movementData?.type || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Cantidad</label>
                                <p className="text-gray-900">{order?.movementData?.quantity || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Prioridad</label>
                                <p className="text-gray-900">{order?.priority || "-"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Información del producto */}
                    <div className="bg-white rounded shadow p-5">
                        <h2 className="text-lg font-semibold mb-3 border-b pb-2">
                            Información del Producto
                        </h2>
                        <div className="space-y-2">
                            <div>
                                <label className="text-sm text-gray-500">Nombre</label>
                                <p className="text-gray-900">{product?.name || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Descripción</label>
                                <p className="text-gray-700">{product?.description || "-"}</p>
                            </div>
                            {product?.sku && (
                                <div>
                                    <label className="text-sm text-gray-500">SKU</label>
                                    <p className="text-gray-900">{product.sku}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Almacenes */}
                    <div className="bg-white rounded shadow p-5">
                        <h2 className="text-lg font-semibold mb-3 border-b pb-2">
                            Almacén Origen
                        </h2>
                        {sourceWarehouse ? (
                            <div className="space-y-2">
                                <div>
                                    <label className="text-sm text-gray-500">Nombre</label>
                                    <p className="text-gray-900">{sourceWarehouse.name}</p>
                                </div>
                                {sourceWarehouse.location && (
                                    <div>
                                        <label className="text-sm text-gray-500">Ubicación</label>
                                        <p className="text-gray-700">{sourceWarehouse.location}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No aplica</p>
                        )}
                    </div>

                    <div className="bg-white rounded shadow p-5">
                        <h2 className="text-lg font-semibold mb-3 border-b pb-2">
                            Almacén Destino
                        </h2>
                        {destinationWarehouse ? (
                            <div className="space-y-2">
                                <div>
                                    <label className="text-sm text-gray-500">Nombre</label>
                                    <p className="text-gray-900">{destinationWarehouse.name}</p>
                                </div>
                                {destinationWarehouse.location && (
                                    <div>
                                        <label className="text-sm text-gray-500">Ubicación</label>
                                        <p className="text-gray-700">{destinationWarehouse.location}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No aplica</p>
                        )}
                    </div>
                </div>

                {/* Información del responsable */}
                {order?.userResponsable && (
                    <div className="mt-6 bg-white rounded shadow p-5">
                        <h2 className="text-lg font-semibold mb-3 border-b pb-2">
                            Responsable
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm text-gray-500">Nombre</label>
                                <p className="text-gray-900">{order.userResponsable.username || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Email</label>
                                <p className="text-gray-900">{order.userResponsable.email || "-"}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}