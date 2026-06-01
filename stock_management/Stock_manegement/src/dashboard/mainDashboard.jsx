import { Outlet, Link } from "react-router-dom";

export default function MainDashboard() {

    return (

        <div className="min-h-screen flex bg-gray-100">

            {/* SIDEBAR */}
            <aside className="w-64 bg-white shadow-xl flex flex-col">

                {/* LOGO / TITLE */}
                <div className="p-6 border-b">

                    <h1 className="text-3xl font-bold text-blue-600">
                        Stock Manager
                    </h1>

                </div>

                {/* NAVIGATION */}
                <nav className="flex flex-col p-4 gap-2">

                    <Link
                        to="/dashboard/productsStock"
                        className="p-3 rounded-xl hover:bg-blue-100 transition duration-200 font-medium text-gray-700"
                    >
                        Stock Products
                    </Link>

                    <Link
                        to="/dashboard/warehouses"
                        className="p-3 rounded-xl hover:bg-blue-100 transition duration-200 font-medium text-gray-700"
                    >
                        Warehouses
                    </Link>

                    <Link
                        to="/dashboard/products"
                        className="p-3 rounded-xl hover:bg-blue-100 transition duration-200 font-medium text-gray-700"
                    >
                        Products
                    </Link>

                    <p className="text-xs text-gray-400 mt-4 uppercase tracking-wider">
                        Orders
                    </p>

                    <Link
                        to="/dashboard/addForm"
                        className="p-3 rounded-xl hover:bg-blue-100 transition duration-200 font-medium text-gray-700"
                    >
                        Add Order
                    </Link>

                    <Link
                        to="/dashboard/sellForm"
                        className="p-3 rounded-xl hover:bg-blue-100 transition duration-200 font-medium text-gray-700"
                    >
                        Sell Order
                    </Link>

                    <Link
                        to="/dashboard/transForm"
                        className="p-3 rounded-xl hover:bg-blue-100 transition duration-200 font-medium text-gray-700"
                    >
                        Transfer Order
                    </Link>

                    <Link
                        to="/dashboard/orderList"
                        className="p-3 rounded-xl hover:bg-blue-100 transition duration-200 font-medium text-gray-700"
                    >
                        Orders
                    </Link>

                    <Link
                        to="/dashboard/orderHistory"
                        className="p-3 rounded-xl hover:bg-blue-100 transition duration-200 font-medium text-gray-700"
                    >
                        Order History
                    </Link>

                    <Link
                        to="/dashboard/movementHistory"
                        className="p-3 rounded-xl hover:bg-blue-100 transition duration-200 font-medium text-gray-700"
                    >
                        Movement History
                    </Link>

                </nav>

                {/* FOOTER */}
                <div className="mt-auto p-4 border-t">

                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            window.location.href = "/";
                        }}
                        className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition duration-300"
                    >
                        Log out
                    </button>

                </div>

            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-8 overflow-y-auto">

                <Outlet />

            </main>

        </div>
    );
}