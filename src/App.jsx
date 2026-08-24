import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {useContext} from 'react';

import './style/dark.scss';

import {DarkModeContext} from './context/darkModeContext';
import {productInputs} from './formSource';

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Home from './pages/home/Home';
import Login from './pages/login/Login';

import OrdersPage from './pages/OrdersPage/OrdersPage';
import DetectFalloutPage from './pages/DetectFalloutPage/DetectFalloutPage';
import AutomationAnalytics from './pages/automationAnalytics/AutomationAnalytics';

import Flowdesigner from './pages/flowdesigner/Flowdesigner';
import FixFlow from './pages/FixFlow/FixFlow';
import NDLHFlow from './pages/NDLHFlow/NDLHFlow';
import NBFlow from './pages/NBFlow/NBFlow';
import SOMFlow from './pages/SOMFlow/SOMFlow';

import AdminFlow from './pages/AdminRoles/Adminroles';
import Auditlog from './pages/Auditlogs/Auditlogs';

import List from './pages/list/List';
import Single from './pages/single/Single';
import New from './pages/new/New';

function App() {
    const {darkMode} = useContext(DarkModeContext);

    return (
        <div className={darkMode ? 'app dark' : 'app'}>
            <BrowserRouter>
                <Routes>

                    {/* Public Routes */}

                    <Route
                        path="/login"
                        element={<Login/>}
                    />

                    {/* Protected Routes */}

                    <Route path="/">

                        <Route
                            index
                            element={
                                <ProtectedRoute>
                                    <Home/>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="orders"
                            element={
                                <ProtectedRoute>
                                    <OrdersPage/>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="detect-fallout"
                            element={
                                <ProtectedRoute>
                                    <DetectFalloutPage/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="automation-analytics"
                            element={
                                <ProtectedRoute>
                                    <AutomationAnalytics/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="flow"
                            element={
                                <ProtectedRoute>
                                    <Flowdesigner/>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="fix-flow"
                            element={
                                <ProtectedRoute>
                                    <FixFlow/>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="ndlh-flow"
                            element={
                                <ProtectedRoute>
                                    <NDLHFlow/>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="nb-flow"
                            element={
                                <ProtectedRoute>
                                    <NBFlow/>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="som-flow"
                            element={
                                <ProtectedRoute>
                                    <SOMFlow/>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="admin/users"
                            element={
                                <ProtectedRoute>
                                    <AdminFlow/>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="audit"
                            element={
                                <ProtectedRoute>
                                    <Auditlog/>
                                </ProtectedRoute>
                            }
                        />

                        {/* Products */}

                        <Route path="products">

                            <Route
                                index
                                element={
                                    <ProtectedRoute>
                                        <List/>
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path=":productId"
                                element={
                                    <ProtectedRoute>
                                        <Single/>
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="new"
                                element={
                                    <ProtectedRoute>
                                        <New
                                            inputs={productInputs}
                                            title="Add New Product"
                                        />
                                    </ProtectedRoute>
                                }
                            />

                        </Route>

                    </Route>

                    {/* Catch All */}

                    <Route
                        path="*"
                        element={<Navigate to="/" replace/>}
                    />

                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;