import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css'; 

const Register = () => {
    const [user, setUser] = useState({
        nombre: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', user);
            alert(res.data.msg);
            navigate('/login');
        } catch (error) {
            alert('Error: ' + (error.response?.data?.msg || 'Error al registrar'));
        }
    };

    return (
        <div className="login-screen"> {/* Usamos la misma clase de fondo que el Login */}
            <div className="glass-card">
                <div className="text-center mb-4">
                    <div style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 0 10px #00d2ff)' }}>🌱</div>
                    <h2 className="title-aqua">Únete a AquaSmart</h2>
                    <p className="text-white-50 small">Crea tu cuenta para comenzar el monitoreo</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input 
                            type="text" 
                            name="nombre" 
                            className="form-control input-minimalist" 
                            placeholder="Nombre Completo" 
                            onChange={handleChange} 
                            value={user.nombre}
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <input 
                            type="email" 
                            name="email" 
                            className="form-control input-minimalist" 
                            placeholder="Correo Electrónico" 
                            onChange={handleChange} 
                            value={user.email}
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
                            value={user.password}
                            required 
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-aqua w-100 mb-3">
                        CREAR CUENTA
                    </button>
                </form>

                <p className="mt-3 text-center">
                    <Link to="/login" className="link-aqua">
                        ¿Ya tienes cuenta? <span>Inicia sesión aquí</span>
                    </Link>
                </p>

                <div className="text-center mt-4">
                    <small style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>
                        TECNOLOGÍA SUSTENTABLE PARA ACUAPONIA
                    </small>
                </div>
            </div>
        </div>
    );
};

export default Register;