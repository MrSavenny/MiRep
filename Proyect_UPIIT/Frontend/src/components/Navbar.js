import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState(localStorage.getItem('nombreUsuario') || "Usuario");

  useEffect(() => {
    const guardado = localStorage.getItem('nombreUsuario');
    if (guardado) setNombre(guardado);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/auth/perfil', 
        { nombre }, 
        { headers: { 'x-auth-token': token } }
      );
      
      localStorage.setItem('nombreUsuario', res.data.nuevoNombre);
      setNombre(res.data.nuevoNombre);
      setShowModal(false);
      alert("¡Nombre actualizado!");
    } catch (error) {
      alert("Error al actualizar perfil");
    }
  };

  const overlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center',
    alignItems: 'center', zIndex: 3000, backdropFilter: 'blur(8px)'
  };

  return (
    <>
      <nav className="navbar glass-panel mb-4" style={{ borderRadius: '0 0 20px 20px', borderTop: 'none' }}>
        <div className="container-fluid">
          <span className="navbar-brand text-aqua-glow fw-bold" style={{ fontSize: '1.5rem' }}>💧 AquaSmart</span>
          <div className="d-flex align-items-center">
            <div className="text-end me-3 d-none d-md-block" onClick={() => setShowModal(true)} style={{cursor: 'pointer'}}>
              <small className="text-white-50 d-block" style={{ fontSize: '0.6rem' }}>INGENIERO A CARGO</small>
              <span className="text-white small fw-bold text-uppercase">{nombre} ⚙️</span>
            </div>
            <button className="btn-action px-3 py-1" onClick={handleLogout}>SALIR</button>
          </div>
        </div>
      </nav>

      {showModal && (
        <div className="modal-overlay" style={overlayStyle}>
          <div className="glass-panel p-4" style={{ width: '350px', border: '1px solid rgba(0, 210, 255, 0.3)' }}>
            <h5 className="text-aqua-glow mb-4 text-center">Configuración de Perfil</h5>
            <form onSubmit={handleUpdate}>
              <input type="text" className="input-minimalist w-100 mb-4" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              <div className="d-flex gap-2">
                <button type="submit" className="btn-aqua w-100 py-2 small">GUARDAR</button>
                <button type="button" className="btn btn-outline-light w-100 py-2 small" onClick={() => setShowModal(false)}>CANCELAR</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;