import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        setError('');
        setMessage('');
        if (!email || !password || !name) {
            setError('Please fill in all field');
            return;
        }
        try {
            const res = await fetch('https://db-backend-0p5f.onrender.com/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            setMessage('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/Login'), 2000);
            
        } catch (err) {
            setError(err.message);
        }
    };


    return (
        <div className="App position-relative text-bg-light">
        <div className="container-lg min-vh-100 d-flex flex-column justify-content-center align-items-center position-relative">
                <div className="text-center mb-4 d-flex flex-column justify-content-center">
                    <h3 className='fs-5 fw-lighter'>Start your journey</h3>
                    <h1 className='fs-2 fw-semibold pb-5'>SIGN UP TO THE APP</h1>
                </div>
                <div className='mw-100 mx-5'style={{width:'300px'}}>
                    <div className="form-floating mb-4">
                        <input type="email" className="form-control" id="floatingInput" placeholder="Name"
                            value={name} onChange={e => setName(e.target.value)} />
                        <label htmlFor="floatingInput">Name</label>
                    </div>
                    <div className="form-floating mb-4">
                        <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"
                            value={email} onChange={e => setEmail(e.target.value)} />
                        <label htmlFor="floatingInput">Email address</label>
                    </div>
                    <div className="form-floating mb-4">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
                            value={password} onChange={e => setPassword(e.target.value)} />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                </div>
                {error && <div className="text-danger mt-2">{error}</div>}
                {message && <div className="alert alert-success position-absolute top-0 mt-3" role="alert">{message}</div>}
                <div className="d-grid gap-2 mt-5 mw-100" style={{width:'200px'}}>
                    <button className="btn btn-primary" type="button" onClick={handleRegister}>Sign Up</button>
                </div>
                <div className='d-flex justify-content-center align-items-center mw-100 mt-5 fw-light'
                style={{width:'500px'}}>
                    <h4>Already have an account? <a href='/Login' className='text-decoration-underline'>Sign In</a></h4>
                </div>
        </div>
        </div>
    );
};
 
export default Registration;