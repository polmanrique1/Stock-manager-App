import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import ProductList from "./components/ProductList";
import MainDashboard from "./dashboard/mainDashboard";
import AdditionForm from "./components/AdditionForm";
import WarehouseList from "./components/WarehouseList";
import ProductAvilable from "./components/ProductAvilable";
import SellForm from "./components/SellForm";
import TransferForm from "./components/TransferForm";
import OrdersList from "./components/OrdersList";
import OrderDetails from "./components/OrderDetails";
import OrderHistory from "./components/OrderHistory";

function App() {

    return (
            <Routes>
                {/* LOGIN */}
                <Route path="/"element={<Login />} />

                <Route path="/dashboard" element={<MainDashboard />}>
                    <Route path="productsStock" element={<ProductList />}/>
                    <Route path="addForm" element={<AdditionForm />}/>
                    <Route path="warehouses" element={<WarehouseList />}/>
                    <Route path="products" element={<ProductAvilable />}/>
                    <Route path="sellForm" element={<SellForm />}/>
                    <Route path="transForm" element={<TransferForm />}/>
                    <Route path="orderList" element={<OrdersList />}/>
                    <Route path="orderDetail/:id" element={<OrderDetails />} />
                    <Route path="history" element={<OrderHistory />} />

                    
                </Route>

            </Routes>
    );
}

export default App;