import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './styles.css';
import Login from './login';
import AdminPanel from './AdminPanel';
import Registration from './Registration';

function ProtectedRoute({ element: Element }) {
    const [authStatus, setAuthStatus] = useState(null); // null = loading
    const location = useLocation();

    useEffect(() => {
        fetch('http://localhost:4000/api/auth/check', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                setAuthStatus(data.authenticated && !data.blocked);
            })
            .catch(() => {
                setAuthStatus(false);
            });
    }, []);

    if (authStatus === null) return <div>Loading...</div>;
    if (!authStatus) return <Navigate to="/Login" state={{ from: location }} replace />;
    return <Element />;
}


function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Navigate to='/Login' replace />} />
                <Route path='/Login' element={<Login />} />
                <Route path='/Registration' element={<Registration />} />
                <Route path='/AdminPanel' element={<ProtectedRoute element={AdminPanel} />} />
            </Routes>
        </Router>
    );
}

export default App;
