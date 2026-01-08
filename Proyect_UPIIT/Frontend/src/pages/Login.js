import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css'; 

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post('http://localhost:5000/api/auth/login', credentials);
        
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('nombreUsuario', res.data.usuario.nombre); 
        
        navigate('/dashboard');
    } catch (error) {
        alert('Error: ' + (error.response?.data?.msg || 'Servidor no disponible'));
    }
};

    return (
        <div className="login-screen">
            <div className="glass-card">
                <div className="text-center mb-5">
                    {/* Icono temático de agua/tecnología */}
                    <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 10px #00d2ff)' }}>💧</div>
                    <h2 className="title-aqua">AquaSmart</h2>
                    <p className="text-white-50 small">Sistema de Control Acuapónico</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input 
                            type="email" 
                            name="email" 
                            className="form-control input-minimalist" 
                            placeholder="Correo electrónico" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <input 
                            type="password" 
                            name="password" 
                            className="form-control input-minimalist" 
                            placeholder="Contraseña" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-aqua w-100 mb-3">
                        ENTRAR
                    </button>
                </form>

                <p className="mt-4 text-center">
                    <Link to="/register" className="link-aqua">
                        ¿No tienes cuenta? <span>Regístrate aquí</span>
                    </Link>
                </p>

                <div className="text-center mt-5">
                    <small style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '2px' }}>
                        UPIIT - INGENIERÍA
                    </small>
                </div>
            </div>
        </div>
    );
};

export default Login;