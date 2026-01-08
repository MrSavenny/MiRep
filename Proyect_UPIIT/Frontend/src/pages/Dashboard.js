import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import SensorChart from '../components/SensorChart';
import Navbar from '../components/Navbar';
import jsPDF from 'jspdf'; 
import autoTable from 'jspdf-autotable'; 
import html2canvas from 'html2canvas';
import '../App.css'; 

const Dashboard = () => {
  const chartRef = useRef(null);
  const [estanques, setEstanques] = useState([]);
  const [nuevoEstanque, setNuevoEstanque] = useState({
    nombre_estanque: '', especie: 'Tilapia', cantidad_peces: 0, fecha_siembra: '', capacidad_litros: 1000
  });
  const [datosGrafica, setDatosGrafica] = useState({ estanque: [], clima: [] });
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [inventario, setInventario] = useState({ cantidad_total_kg: 50, alerta_minima_kg: 10 });
  const [showInventarioModal, setShowInventarioModal] = useState(false);
  const [showSanidadModal, setShowSanidadModal] = useState(false);
  const [sanidadData, setSanidadData] = useState({ id: null, nombre: '', bajas: 0, motivo: '', originalCant: 0, litros: 1000, historialPrevio: '' });
  const [showDataModal, setShowDataModal] = useState(false);
  const [sensorData, setSensorData] = useState({ id: null, nombre: '', ph: '', agua: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ id: null, nombre: '', peces: '', litros: '' });
  const [showClimaModal, setShowClimaModal] = useState(false);
  const [climaTemp, setClimaTemp] = useState('');
  const [showHistorial, setShowHistorial] = useState(false);
  const [estanqueHistorial, setEstanqueHistorial] = useState(null);

  const getAuthHeader = useCallback(() => ({
    headers: { 'x-auth-token': localStorage.getItem('token') }
  }), []);

  const catalogoEnfermedades = [
    { sintoma: "Puntos blancos (como sal), frotamiento en paredes.", enfermedad: "Ich (Parásitos)", cura: "Aumentar temp. a 30°C y añadir sal (1-3g/L)." },
    { sintoma: "Ojos inflamados, nado errático, hemorragias.", enfermedad: "Streptococcus", cura: "Bajar densidad, recambio de agua y dieta medicada." },
    { sintoma: "Boqueo en superficie, aletas extendidas.", enfermedad: "Hipoxia (Falta O2)", cura: "Aumentar aireación y revisar filtros inmediatamente." },
    { sintoma: "Cuerpo hinchado, escamas erizadas.", enfermedad: "Hidropesía", cura: "Aislar pez, reducir amoníaco y mejorar limpieza." },
    { sintoma: "Manchas algodonosas en piel o aletas.", enfermedad: "Saprolegniasis", cura: "Baños de sal y eliminar exceso de materia orgánica." }
  ];

  const obtenerGrafica = useCallback(async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/estanques/grafica/${id}`, getAuthHeader());
      setDatosGrafica(res.data);
      setIdSeleccionado(id);
    } catch (error) { setDatosGrafica({ estanque: [], clima: [] }); }
  }, [getAuthHeader]);

  const cargarTodo = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/estanques', getAuthHeader());
      const data = Array.isArray(res.data) ? res.data : [];
      setEstanques(data);
      if (data.length > 0 && !idSeleccionado) obtenerGrafica(data[0].id);
    } catch (error) { console.error("Error:", error); }
  }, [idSeleccionado, obtenerGrafica, getAuthHeader]);

  const calcularInfoCultivo = (fechaSiembra, cantidadPeces, capacidadLitros) => {
    if (!fechaSiembra || fechaSiembra === "0000-00-00") {
        return { dias: 0, biomasa: 0, densidad: 0, etapa: "---", porcentaje: 0, racionTotal: 0, horarios: [], porcion: 0, saludCarga: { texto: "-", clase: "" }, maxPeces: 0, tipoAlimento: "S/N" };
    }
    const diasV = Math.max(0, Math.floor((new Date() - new Date(fechaSiembra)) / (1000 * 60 * 60 * 24)));
    
    let pesoG = diasV <= 30 ? 5 : diasV <= 60 ? 50 : diasV <= 120 ? 250 : 550;
    let tasa = diasV <= 30 ? 0.06 : diasV <= 60 ? 0.04 : diasV <= 120 ? 0.03 : 0.015;
    let frec = diasV <= 30 ? 4 : diasV <= 60 ? 3 : 2;
    
    let tipoAlimento = diasV <= 30 ? "Iniciador (Harina)" : diasV <= 60 ? "Crecimiento (2mm)" : diasV <= 120 ? "Desarrollo (4mm)" : "Engorda (6mm)";

    const biomasaKg = (pesoG * cantidadPeces) / 1000;
    const volumenM3 = (capacidadLitros || 1000) / 1000;
    const densidad = biomasaKg / volumenM3; 
    const racionTotal = (biomasaKg * 1000) * tasa;
    const maxPeces = Math.floor((volumenM3 * 20) / 0.5);
    
    return { 
        dias: diasV, etapa: diasV <= 30 ? "Alevín" : diasV <= 60 ? "Cría" : diasV <= 120 ? "Desarrollo" : "Cosecha",
        biomasa: biomasaKg.toFixed(2), densidad: densidad.toFixed(2), 
        saludCarga: densidad > 20 ? { texto: "Sobrepoblado", clase: "text-danger" } : { texto: "Óptima", clase: "text-success" },
        racionTotal: racionTotal.toFixed(1), porcion: (racionTotal / frec).toFixed(1),
        horarios: frec === 4 ? ["08:00", "11:00", "14:00", "17:00"] : frec === 3 ? ["08:00", "13:00", "18:00"] : ["09:00", "16:00"],
        porcentaje: Math.min(Math.round((diasV / 180) * 100), 100),
        maxPeces, tipoAlimento
    };
  };

  const generarReportePDF = async () => {
    if (estanques.length === 0) return alert("No hay datos para exportar.");
    setIsGeneratingPDF(true);
    const doc = new jsPDF('p', 'mm', 'a4');
    const idOriginal = idSeleccionado;
    let currentY = 45; 

    doc.setFillColor(0, 50, 70);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(0, 210, 255);
    doc.setFontSize(18);
    doc.text("INFORME OPERATIVO AQUASMART", 14, 15);
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 25);
    doc.text(`Inventario: ${inventario.cantidad_total_kg} kg`, 150, 25);

    for (let i = 0; i < estanques.length; i++) {
        const est = estanques[i];
        const info = calcularInfoCultivo(est.fecha_siembra, est.cantidad_peces, est.capacidad_litros);
        await obtenerGrafica(est.id);
        await new Promise(resolve => setTimeout(resolve, 700));

        if (currentY + 105 > 280) { doc.addPage(); currentY = 20; }

        doc.setDrawColor(0, 210, 255); doc.setLineWidth(0.5); doc.line(14, currentY, 196, currentY);
        doc.setTextColor(0, 80, 120); doc.setFontSize(12); doc.text(`ESTANQUE: ${est.nombre_estanque.toUpperCase()}`, 14, currentY + 7);
        doc.setFontSize(9); doc.setTextColor(50);
        doc.text(`Población: ${est.cantidad_peces} pz | Biomasa: ${info.biomasa} kg | Día: ${info.dias}`, 14, currentY + 13);

        autoTable(doc, {
            startY: currentY + 18, margin: { left: 14 }, tableWidth: 80,
            head: [['Parámetro', 'Valor']],
            body: [['Densidad', `${info.densidad} kg/m3`], ['Progreso', `${info.porcentaje}%`], ['Alimento Sug.', info.tipoAlimento], ['Ración/Día', `${info.racionTotal}g`]],
            theme: 'grid', styles: { fontSize: 8, cellPadding: 2 }, headStyles: { fillColor: [0, 100, 150] }
        });

        if (chartRef.current) {
            const canvas = await html2canvas(chartRef.current, { scale: 2, backgroundColor: '#0a192f' });
            doc.addImage(canvas.toDataURL('image/png'), 'PNG', 100, currentY + 18, 95, 65); 
        }

        const historialY = currentY + 65 + 22; 
        const notas = est.observaciones_salud ? est.observaciones_salud.split('---').slice(0, 2) : ["Sin novedades."];
        doc.setFontSize(8); doc.setTextColor(100); doc.text("Bitácora Sanitaria Reciente:", 14, historialY);
        doc.text(notas.join(" | ").substring(0, 180), 14, historialY + 4, { maxWidth: 180 });

        currentY += 105; 
    }
    await obtenerGrafica(idOriginal);
    doc.save(`Reporte_AquaSmart.pdf`);
    setIsGeneratingPDF(false);
  };

  const guardarSanidad = async () => {
    const numBajas = parseFloat(sanidadData.bajas);
    if (numBajas < 0 || !Number.isInteger(numBajas)) return alert("Error: Debe ingresar un número entero positivo.");
    const nuevaCant = sanidadData.originalCant - parseInt(sanidadData.bajas);
    const fechaActual = new Date().toLocaleString();
    const nuevaNota = `[${fechaActual}] - Bajas: ${sanidadData.bajas}. Síntomas: ${sanidadData.motivo}`;
    const historialActualizado = sanidadData.historialPrevio ? `${nuevaNota} \n---\n ${sanidadData.historialPrevio}` : nuevaNota;
    try {
      await axios.put(`http://localhost:5000/api/estanques/${sanidadData.id}`, { nombre_estanque: sanidadData.nombre, cantidad_peces: nuevaCant, capacidad_litros: sanidadData.litros, observaciones_salud: historialActualizado }, getAuthHeader());
      setShowSanidadModal(false); cargarTodo();
    } catch (error) { alert("Error al guardar"); }
  };

  const guardarDataSensor = async () => {
    try {
      await axios.post('http://localhost:5000/api/estanques/monitoreo', { estanque_id: sensorData.id, ph_nivel: sensorData.ph, temperatura: sensorData.agua }, getAuthHeader());
      setShowDataModal(false); cargarTodo(); obtenerGrafica(sensorData.id);
    } catch (error) { alert("Error"); }
  };

  const guardarEdicion = async () => {
    try {
      await axios.put(`http://localhost:5000/api/estanques/${editData.id}`, { nombre_estanque: editData.nombre, cantidad_peces: editData.peces, capacidad_litros: editData.litros }, getAuthHeader());
      setShowEditModal(false); cargarTodo();
    } catch (error) { alert("Error"); }
  };

  const guardarClima = async () => {
    try {
      await axios.post('http://localhost:5000/api/estanques/clima-manual', { temp_ambiente: climaTemp }, getAuthHeader());
      setShowClimaModal(false); if (idSeleccionado) obtenerGrafica(idSeleccionado);
    } catch (error) { alert("Error"); }
  };

  const eliminarEstanque = async (id) => {
    if (window.confirm('¿Eliminar?')) {
      try {
        await axios.delete(`http://localhost:5000/api/estanques/${id}`, getAuthHeader());
        cargarTodo(); if (idSeleccionado === id) setIdSeleccionado(null);
      } catch (error) { alert("Error"); }
    }
  };

  const handleSubmitEstanque = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/estanques', nuevoEstanque, getAuthHeader());
      setNuevoEstanque({ nombre_estanque: '', especie: 'Tilapia', cantidad_peces: 0, fecha_siembra: '', capacidad_litros: 1000 });
      cargarTodo();
    } catch (error) { alert("Error"); }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) window.location.href = '/login';
    else cargarTodo();
  }, [cargarTodo]);

  const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, backdropFilter: 'blur(10px)' };

  return (
    <div className="dashboard-bg">
      <Navbar />
      <div className="container mt-4">
        {isGeneratingPDF && ( <div className="modal-overlay" style={{...overlayStyle, zIndex: 5000}}><div className="glass-panel p-4 text-center"><div className="spinner-border text-info mb-3"></div><h5 className="text-white">Generando Reporte...</h5></div></div> )}

        {/* MODALES */}
        {showInventarioModal && ( <div className="modal-overlay" style={overlayStyle}><div className="glass-panel p-4" style={{ width: '350px', border: '1px solid #00d2ff' }}><h5 className="text-aqua-glow mb-3">📦 Gestionar Bodega</h5><input type="number" className="input-minimalist w-100 mb-4" value={inventario.cantidad_total_kg} onChange={(e) => setInventario({...inventario, cantidad_total_kg: e.target.value})} /><div className="d-flex gap-2"><button className="btn-aqua w-100 py-2" onClick={() => setShowInventarioModal(false)}>ACTUALIZAR</button><button className="btn btn-outline-light w-100" onClick={() => setShowInventarioModal(false)}>CERRAR</button></div></div></div> )}
        {showSanidadModal && ( <div className="modal-overlay" style={overlayStyle}><div className="glass-panel p-4" style={{ width: '400px', border: '1px solid rgba(255, 59, 59, 0.4)' }}><h5 className="text-danger mb-3">🏥 Bajas: {sanidadData.nombre}</h5><input type="number" className="input-minimalist w-100 mb-3" placeholder="Bajas" value={sanidadData.bajas} onChange={(e) => setSanidadData({...sanidadData, bajas: e.target.value})} /><textarea className="input-minimalist w-100 mb-4" rows="3" placeholder="Síntomas..." value={sanidadData.motivo} onChange={(e) => setSanidadData({...sanidadData, motivo: e.target.value})} /><div className="d-flex gap-2"><button className="btn-aqua w-100 py-2" onClick={guardarSanidad}>REGISTRAR</button><button className="btn btn-outline-light w-100" onClick={() => setShowSanidadModal(false)}>CANCELAR</button></div></div></div> )}
        {showDataModal && ( <div className="modal-overlay" style={overlayStyle}><div className="glass-panel p-4" style={{ width: '400px', border: '1px solid #00d2ff' }}><h5 className="text-aqua-glow mb-3">📝 Datos: {sensorData.nombre}</h5><input type="number" className="input-minimalist w-100 mb-3" placeholder="pH" value={sensorData.ph} onChange={(e) => setSensorData({...sensorData, ph: e.target.value})} /><input type="number" className="input-minimalist w-100 mb-4" placeholder="Temp Agua" value={sensorData.agua} onChange={(e) => setSensorData({...sensorData, agua: e.target.value})} /><div className="d-flex gap-2"><button className="btn-aqua w-100 py-2" onClick={guardarDataSensor}>GUARDAR</button><button className="btn btn-outline-light w-100" onClick={() => setShowDataModal(false)}>CANCELAR</button></div></div></div> )}
        {showEditModal && ( <div className="modal-overlay" style={overlayStyle}><div className="glass-panel p-4" style={{ width: '400px', border: '1px solid #ffc107' }}><h5 className="text-warning mb-3">⚙️ Editar Estanque</h5><input type="text" className="input-minimalist w-100 mb-3" value={editData.nombre} onChange={(e) => setEditData({...editData, nombre: e.target.value})} /><input type="number" className="input-minimalist w-100 mb-3" value={editData.peces} onChange={(e) => setEditData({...editData, peces: e.target.value})} /><input type="number" className="input-minimalist w-100 mb-4" value={editData.litros} onChange={(e) => setEditData({...editData, litros: e.target.value})} /><div className="d-flex gap-2"><button className="btn-aqua w-100 py-2" onClick={guardarEdicion}>ACTUALIZAR</button><button className="btn btn-outline-light w-100" onClick={() => setShowEditModal(false)}>CANCELAR</button></div></div></div> )}
        {showClimaModal && ( <div className="modal-overlay" style={overlayStyle}><div className="glass-panel p-4" style={{ width: '350px', border: '1px solid #00d2ff' }}><h5 className="text-aqua-glow mb-3">🌦️ Clima</h5><input type="number" className="input-minimalist w-100 mb-4" placeholder="°C Ambiente" value={climaTemp} onChange={(e) => setClimaTemp(e.target.value)} /><div className="d-flex gap-2"><button className="btn-aqua w-100 py-2" onClick={guardarClima}>GUARDAR</button><button className="btn btn-outline-light w-100" onClick={() => setShowClimaModal(false)}>CANCELAR</button></div></div></div> )}
        {showHistorial && estanqueHistorial && ( <div className="modal-overlay" style={overlayStyle}><div className="glass-panel p-4" style={{ width: '550px', maxHeight: '85vh', overflowY: 'auto', border: '1px solid #00d2ff' }}><div className="d-flex justify-content-between align-items-center mb-4"><h5 className="text-aqua-glow mb-0">📋 Bitácora: {estanqueHistorial.nombre_estanque}</h5><button className="btn btn-sm btn-outline-light" onClick={() => setShowHistorial(false)}>Cerrar</button></div><div className="historial-scroll">{estanqueHistorial.observaciones_salud ? estanqueHistorial.observaciones_salud.split('---').map((nota, idx) => (<div key={idx} className="p-3 mb-3 rounded" style={{ background: 'rgba(255,255,255,0.05)', borderLeft: '4px solid #00d2ff' }}><pre className="text-white small m-0" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{nota.trim()}</pre></div>)) : ( <p className="text-center text-white-50">Sin registros previos.</p> )}</div></div></div> )}

        <div className="glass-panel d-flex justify-content-between align-items-center mb-4 border-info"><h5 className="text-aqua-glow mb-0">🌦️ Monitoreo Ambiental</h5><div className="d-flex gap-2"><button className="btn btn-outline-info btn-sm" onClick={generarReportePDF}>📄 Reporte Maestro</button><button className="btn-action" onClick={() => setShowClimaModal(true)}>Registrar Clima</button></div></div>

        <div className="row">
          <div className="col-md-8">
            <div ref={chartRef} className="glass-panel mb-4" style={{minHeight: '400px', backgroundColor: '#0a192f'}}><SensorChart datos={datosGrafica} /></div>

            <div className="glass-panel p-3 mb-4 d-flex justify-content-between align-items-center" style={{border: inventario.cantidad_total_kg < inventario.alerta_minima_kg ? '1px solid #ff3b3b' : '1px solid #00d2ff'}}>
                <div><h6 className="text-white mb-1">📦 Inventario de Alimento</h6><span className={inventario.cantidad_total_kg < inventario.alerta_minima_kg ? "text-danger fw-bold" : "text-aqua-glow"}>{inventario.cantidad_total_kg} kg disponibles</span></div>
                <button className="btn btn-sm btn-outline-info" onClick={() => setShowInventarioModal(true)}>Gestionar Bodega</button>
            </div>

            <div className="glass-panel p-4">
                <h6 className="text-aqua-glow mb-3">🔬 Guía Rápida de Patologías</h6>
                <div className="table-responsive"><table className="table table-dark table-hover table-borderless"><thead><tr className="border-bottom border-info text-aqua-glow"><th style={{padding: '15px'}}>Síntomas</th><th style={{padding: '15px'}}>Patología</th><th style={{padding: '15px'}}>Cura Sugerida</th></tr></thead><tbody>{catalogoEnfermedades.map((enf, i) => (<tr key={i} className="border-bottom border-secondary"><td style={{padding: '15px'}}>{enf.sintoma}</td><td style={{padding: '15px'}}>{enf.enfermedad}</td><td style={{padding: '15px'}} className="text-info">{enf.cura}</td></tr>))}</tbody></table></div>
            </div>
          </div>

          <div className="col-md-4">
            <h5 className="text-aqua-glow mb-3">Mis Estanques Activos</h5>
            <div className="overflow-auto mb-4" style={{maxHeight: '600px', paddingRight: '5px'}}>
              {estanques.map(est => {
                const info = calcularInfoCultivo(est.fecha_siembra, est.cantidad_peces, est.capacidad_litros);
                return (
                  <div key={est.id} onClick={() => obtenerGrafica(est.id)} className={`glass-panel mb-3 p-3 ${idSeleccionado === est.id ? 'border-info' : ''}`} style={{ cursor: 'pointer', background: idSeleccionado === est.id ? 'rgba(0, 210, 255, 0.1)' : '' }}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <strong className="text-white">{est.nombre_estanque}</strong>
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-danger" title="Sanidad" onClick={(e) => { e.stopPropagation(); setSanidadData({ id: est.id, nombre: est.nombre_estanque, bajas: 0, motivo: '', originalCant: est.cantidad_peces, litros: est.capacidad_litros, historialPrevio: est.observaciones_salud }); setShowSanidadModal(true); }}>💊</button>
                        <button className="btn btn-sm btn-outline-info" title="Añadir Datos" onClick={(e) => { e.stopPropagation(); setSensorData({ id: est.id, nombre: est.nombre_estanque, ph: '', agua: '' }); setShowDataModal(true); }}>+Data</button>
                        <button className="btn btn-sm btn-outline-warning" title="Editar" onClick={(e) => { e.stopPropagation(); setEditData({ id: est.id, nombre: est.nombre_estanque, peces: est.cantidad_peces, litros: est.capacidad_litros }); setShowEditModal(true); }}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" title="Eliminar" onClick={(e) => { e.stopPropagation(); eliminarEstanque(est.id); }}>×</button>
                      </div>
                    </div>
                    
                    <div className="small text-white-50">
                        {est.cantidad_peces} peces - {est.capacidad_litros} L <br />
                        <span className="text-aqua-glow">🌱 Siembra: {est.fecha_siembra ? new Date(est.fecha_siembra).toLocaleDateString() : '---'}</span>
                    </div>

                    <div className="progress mt-3" style={{ height: '8px', background: 'rgba(255,255,255,0.1)' }}><div className={`progress-bar progress-bar-striped progress-bar-animated ${info.porcentaje === 100 ? 'bg-success' : 'bg-info'}`} style={{ width: `${info.porcentaje}%` }}></div></div>
                    
                    {/* SECCIÓN DE PROGRESO DE DÍAS */}
                    <div className="d-flex justify-content-between mt-1 mb-2 small text-white-50">
                        <span>Día {info.dias}</span>
                        <span>{info.porcentaje}% del ciclo</span>
                    </div>

                    <div className="mt-3 p-2 rounded" style={{ background: 'rgba(0, 210, 255, 0.05)', border: '1px solid rgba(0, 210, 255, 0.2)' }}><div className="d-flex justify-content-between align-items-center mb-1"><span className="text-aqua-glow small fw-bold">📊 Biomasa: {info.biomasa} kg</span><span className={`small fw-bold ${info.saludCarga.clase}`}>{info.saludCarga.texto}</span></div><div className="text-white-50 small" style={{fontSize: '0.65rem'}}>Densidad: {info.densidad} kg/m³</div></div>
                    
                    <div className="mt-2 p-2 rounded" style={{ background: 'rgba(255, 193, 7, 0.1)', border: '1px solid rgba(255, 193, 7, 0.3)' }}>
                        <div className="d-flex justify-content-between mb-1">
                            <span className="text-warning small fw-bold">🍴 NUTRICIÓN</span>
                            <span className="text-white fw-bold small">{info.racionTotal}g/día</span>
                        </div>
                        <div className="text-white small mb-1" style={{fontSize: '0.7rem'}}>Sugerido: {info.tipoAlimento}</div>
                        <div className="row g-1">{info.horarios.map((h, idx) => (<div key={idx} className="col-6 p-1 rounded text-center text-white" style={{background:'rgba(255,255,255,0.1)', fontSize:'0.55rem'}}>{h} - {info.porcion}g</div>))}</div>
                    </div>

                    <div className="mt-3"><button className="btn btn-sm w-100 text-aqua-glow" style={{ background: 'rgba(0, 210, 255, 0.1)', border: '1px solid rgba(0, 210, 255, 0.2)', fontSize: '0.65rem' }} onClick={(e) => { e.stopPropagation(); setEstanqueHistorial(est); setShowHistorial(true); }}>👁️ VER HISTORIAL CLÍNICO</button></div>
                  </div>
                );
              })}
            </div>

            <div className="glass-panel">
              <h6 className="text-aqua-glow mb-3 small">REGISTRAR NUEVO ESTANQUE</h6>
              <form onSubmit={handleSubmitEstanque}>
                <input type="text" className="input-minimalist mb-2 w-100" placeholder="Nombre" value={nuevoEstanque.nombre_estanque} onChange={e => setNuevoEstanque({ ...nuevoEstanque, nombre_estanque: e.target.value })} required />
                <div className="row g-2">
                    <div className="col-6"><input type="number" className="input-minimalist mb-2 w-100" placeholder="Peces" value={nuevoEstanque.cantidad_peces} onChange={e => setNuevoEstanque({ ...nuevoEstanque, cantidad_peces: e.target.value })} required /></div>
                    <div className="col-6"><input type="number" className="input-minimalist mb-2 w-100" placeholder="Litros" value={nuevoEstanque.capacidad_litros} onChange={e => setNuevoEstanque({ ...nuevoEstanque, capacidad_litros: e.target.value })} required /></div>
                </div>
                {nuevoEstanque.capacidad_litros > 0 && (
                    <div className="text-info mb-2 px-1" style={{fontSize: '0.65rem', fontStyle: 'italic'}}>
                        💡 Capacidad sugerida: Máx {Math.floor((nuevoEstanque.capacidad_litros / 1000 * 20) / 0.5)} peces.
                    </div>
                )}
                <input type="date" className="input-minimalist mb-3 w-100" value={nuevoEstanque.fecha_siembra} onChange={e => setNuevoEstanque({ ...nuevoEstanque, fecha_siembra: e.target.value })} required />
                <button className="btn-aqua w-100 py-2 small" type="submit">DAR DE ALTA</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;