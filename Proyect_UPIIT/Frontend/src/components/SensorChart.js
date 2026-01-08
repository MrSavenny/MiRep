import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const SensorChart = ({ datos }) => {
  const listaEstanque = datos?.estanque || [];
  const listaClima = datos?.clima || [];

  if (listaEstanque.length === 0) {
    return (
      <div className="glass-panel text-center p-5">
        <h4 className="text-aqua-glow">📈 Sin datos suficientes</h4>
        <p className="text-white-50">Registra mediciones para ver el análisis.</p>
      </div>
    );
  }

  const ultimaLectura = listaEstanque[listaEstanque.length - 1];
  const phActual = Number(ultimaLectura.ph);
  const tempActual = Number(ultimaLectura.temp);

  let estadoPH = { texto: 'Ideal', clase: 'text-success', icono: '✅', alerta: false };
  if (phActual < 6.5) estadoPH = { texto: 'Ácido', clase: 'text-danger', icono: '⚠️', alerta: true };
  else if (phActual > 8.5) estadoPH = { texto: 'Alcalino', clase: 'text-danger', icono: '⚠️', alerta: true };

  let estadoTemp = { texto: 'Óptima', clase: 'text-success', icono: '✅' };
  if (tempActual > 32) estadoTemp = { texto: 'Crítica', clase: 'text-danger', icono: '🔥' };
  else if (tempActual < 20) estadoTemp = { texto: 'Baja', clase: 'text-warning', icono: '❄️' };

  const sharedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: 'rgba(255,255,255,0.8)', font: { size: 11 } } } },
    scales: {
      x: { ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  return (
    <div className="p-0">
      <div className="row mb-3">
        <div className="col-6">
          <div className="glass-panel text-center p-3">
            <span className="text-white-50 small d-block mb-1">Análisis de pH</span>
            <h5 className={`mb-0 ${estadoPH.clase}`}>{estadoPH.icono} {estadoPH.texto}</h5>
            <small className="text-white-50">Valor: {phActual}</small>
          </div>
        </div>
        <div className="col-6">
          <div className="glass-panel text-center p-3">
            <span className="text-white-50 small d-block mb-1">Temp. Agua</span>
            <h5 className={`mb-0 ${estadoTemp.clase}`}>{estadoTemp.icono} {estadoTemp.texto}</h5>
            <small className="text-white-50">Valor: {tempActual}°C</small>
          </div>
        </div>
      </div>

      <div className="glass-panel mb-4 p-3" style={{ height: '300px' }}>
        <h6 className="text-aqua-glow small mb-3">Monitoreo Progresivo del Estanque</h6>
        <Line
          data={{
            labels: listaEstanque.map(e => e.hora),
            datasets: [
              { label: 'Temp. Agua (°C)', data: listaEstanque.map(e => e.temp), borderColor: '#198754', backgroundColor: 'rgba(25,135,84,0.1)', yAxisID: 'y_temp', tension: 0.3, pointRadius: 4 },
              { label: 'pH', data: listaEstanque.map(e => e.ph), borderColor: '#00d2ff', backgroundColor: 'rgba(0,210,255,0.1)', yAxisID: 'y_ph', tension: 0.3, pointRadius: 4 }
            ]
          }}
          options={{
            ...sharedOptions,
            scales: {
              ...sharedOptions.scales,
              y_ph: { type: 'linear', position: 'left', min: 0, max: 14, ticks: { color: '#00d2ff' } },
              y_temp: { type: 'linear', position: 'right', min: 0, max: 50, ticks: { color: '#198754' }, grid: { display: false } }
            }
          }}
        />
      </div>

      {/* RECOMENDACIÓN TÉCNICA ÚNICA */}
      {estadoPH.alerta && (
        <div className="glass-panel border-warning mt-3 d-flex align-items-center p-3">
          <div className="me-3" style={{ fontSize: '2rem' }}>💡</div>
          <div>
            <h6 className="text-warning mb-1">Recomendación Técnica (pH {estadoPH.texto})</h6>
            <p className="mb-0 text-white-50 small">
              {phActual < 6.5
                ? 'El agua es ácida. Añade carbonato de calcio para estabilizar.'
                : 'El pH elevado indica exceso de algas. Realiza recambio parcial de agua.'}
            </p>
          </div>
        </div>
      )}

      <div className="glass-panel p-3 mt-4" style={{ height: '200px' }}>
        <h6 className="text-white-50 small mb-3">Historial Térmico Ambiente</h6>
        <Line
          data={{
            labels: listaClima.map(c => c.hora),
            datasets: [{ label: 'Temp. Ambiente (°C)', data: listaClima.map(c => c.tempAmb), borderColor: '#ffc107', backgroundColor: 'rgba(255,193,7,0.1)', fill: true, tension: 0.3, pointRadius: 3 }]
          }}
          options={sharedOptions}
        />
      </div>
    </div>
  );
};

export default SensorChart;