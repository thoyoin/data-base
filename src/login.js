import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError('');
        try {
            const res = await fetch('https://db-backend-0p5f.onrender.com/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }
            navigate('/AdminPanel');
        } catch (err) {
            setError(err.message || 'Something went wrong..');
            setShowError(true);
        }
    };

    const show = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                </svg>;
    const hide = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
                <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
                </svg> ;

    useEffect(() => {
        if (error) {
            setShowError(false);
            const timeout = setTimeout(() => setShowError(true), 10);
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => setShowError(false), 1000);
            return () => clearTimeout(timeout);
        }
    }, [error]);

    const closeAlert = () => {
        setShowError(false);
        setTimeout(() => {
            setError('');
        }, 1000);
    };

    const getContacts = () => setShowToast(true);

    return (
        <div className="App position-relative text-bg-light">
        <div className="position-relative container-sm min-vh-100 d-flex flex-column justify-content-center align-items-center">
            {(error || showError) && 
                        <div 
                        className={`position-absolute alert top-0 alert-warning alert-dismissible m-5 d-flex justify-content-between align-items-center fade ${showError ? 'show' : ''}`} 
                        role="alert">
                            {error}!
                            <button 
                                type="button" 
                                className="btn-close p-3" 
                                aria-label="Close" 
                                onClick={closeAlert}></button>
                            </div>}
                <div className="text-center mb-4 d-flex flex-column justify-content-center">
                    <h3 className='fs-5 fw-lighter'>Start your journey</h3>
                    <h1 className='fs-2 fw-semibold pb-5'>SIGN TO THE APP</h1>
                </div>
                <div className='mw-100 mx-5'style={{width:'300px'}}>
                    <div className="form-floating mb-4">
                        <input type="email" className="form-control" id="floatingInput" 
                            placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                        <label htmlFor="floatingInput">Email address</label>
                    </div>
                    <div className="form-floating position-relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control"
                            id="floatingPassword"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <label htmlFor="floatingPassword">Password</label>
                        <button
                            type="button"
                            className="btn position-absolute top-50 end-0 translate-middle-y me-2"
                            style={{ zIndex: 5 }}
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? hide : show}
                        </button>
                    </div>
                </div>
                <div className="d-grid gap-2 mt-5 mw-100" style={{width:'200px'}}>
                    <button className="btn btn-primary" type="button" onClick={handleLogin}>Sign In</button>
                </div>
                <div className='d-flex justify-content-between align-items-center mw-100 mt-5 fw-light'
                style={{width:'500px'}}
                >
                    <h4 className='m-0' id='acc'>Don't have an account? <a href='/Registration' className='text-decoration-underline'>Sign Up</a></h4>
                    <button type="button" class="btn text-primary fw-light" onClick={getContacts}>Forgot password?</button>
                </div>
                {showToast && (
                            <div className="alert alert-primary alert-dismissible fade show position-absolute m-5 bottom-0 end-0" role="alert">
                            Write to <a href='mailto:lukharchik@gmail.com' target='_blank'>this email</a> to reset your password.
                            <button type="button" className="btn-close p-3" onClick={() => setShowToast(false)}></button>
                        </div>)}
        </div>
        </div>
    );
}

export default Login;
