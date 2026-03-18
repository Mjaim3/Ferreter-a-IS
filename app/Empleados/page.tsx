"use client"
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

export default function ModuloEmpleado() {
  const [empleados, setEmpleados] = useState([]);
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [genero, setGenero] = useState('M');
  const [edad, setEdad] = useState('');
  const [estadoCivil, setEstadoCivil] = useState('S');
  const [fechaInicio, setFechaInicio] = useState(new Date().getFullYear());
  
  // NUEVO: Estado para controlar si estamos editando
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    const { data, error } = await supabase
      .from('empleado')
      .select('*')
      .order('id', { ascending: false });
    
    if (!error) setEmpleados(data);
  };

  const guardarEmpleado = async (e) => {
    e.preventDefault();
    
    const datos = {
      nombre,
      dni,
      genero,
      edad: parseInt(edad),
      estado_civil: estadoCivil,
      fecha_inicio: parseInt(fechaInicio),
      estado: 1
    };

    if (editandoId) {
      // MODO EDITAR
      const { error } = await supabase
        .from('empleado')
        .update(datos)
        .eq('id', editandoId);

      if (error) alert("Error al actualizar: " + error.message);
      else {
        alert("Actualizado con éxito");
        setEditandoId(null);
      }
    } else {
      // MODO GUARDAR NUEVO
      const { error } = await supabase
        .from('empleado')
        .insert([datos]);

      if (error) alert("Error al guardar: " + error.message);
      else alert("Empleado registrado con éxito");
    }

    limpiarFormulario();
    cargarEmpleados();
  };

  const eliminarEmpleado = async (id) => {
    if (confirm("¿Estás seguro de eliminar este empleado?")) {
      const { error } = await supabase
        .from('empleado')
        .delete()
        .eq('id', id);

      if (error) alert("Error al eliminar: " + error.message);
      else cargarEmpleados();
    }
  };

  const prepararEdicion = (emp) => {
    setEditandoId(emp.id);
    setNombre(emp.nombre);
    setDni(emp.dni);
    setGenero(emp.genero);
    setEdad(emp.edad);
    setEstadoCivil(emp.estado_civil);
    setFechaInicio(emp.fecha_inicio);
  };

  const limpiarFormulario = () => {
    setNombre(''); setDni(''); setEdad(''); setEditandoId(null);
    setGenero('M'); setEstadoCivil('S'); setFechaInicio(new Date().getFullYear());
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8 font-sans">
      <h1 className="text-2xl font-bold mb-8 text-cyan-400">Gestión de Personal - Ferretería IS</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* formulario registro */}
        <div className="bg-[#020617] border border-blue-900/30 p-6 rounded-xl shadow-2xl h-fit sticky top-8">
          <h2 className="text-cyan-500 mb-6 font-semibold underline">
            {editandoId ? 'Editando Registro' : 'Nuevo Registro'}
          </h2>
          <form onSubmit={guardarEmpleado} className="space-y-4">
            {/* ... (Tus inputs se mantienen iguales) ... */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Nombre Completo:</label>
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-[#1e293b] border border-cyan-900/20 p-2.5 rounded-lg outline-none focus:border-cyan-500" required />
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">DNI / Identidad:</label>
              <input type="text" value={dni} onChange={e => setDni(e.target.value)} className="w-full bg-[#1e293b] border border-cyan-900/20 p-2.5 rounded-lg outline-none focus:border-cyan-500" placeholder="0000-0000-00000" required />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Género:</label>
                <select value={genero} onChange={e => setGenero(e.target.value)} className="w-full bg-[#1e293b] border border-cyan-900/20 p-2.5 rounded-lg outline-none">
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Estado Civil:</label>
                <select value={estadoCivil} onChange={e => setEstadoCivil(e.target.value)} className="w-full bg-[#1e293b] border border-cyan-900/20 p-2.5 rounded-lg outline-none">
                  <option value="S">Soltero/a</option>
                  <option value="C">Casado/a</option>
                  <option value="D">Divorciado/a</option>
                  <option value="V">Viudo/a</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Edad:</label>
                <input type="number" value={edad} onChange={e => setEdad(e.target.value)} className="w-full bg-[#1e293b] border border-cyan-900/20 p-2.5 rounded-lg outline-none" required />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Año Inicio:</label>
                <input type="number" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className="w-full bg-[#1e293b] border border-cyan-900/20 p-2.5 rounded-lg outline-none" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button className={`w-full ${editandoId ? 'bg-amber-600 hover:bg-amber-500' : 'bg-cyan-600 hover:bg-cyan-500'} mt-4 py-3 rounded-lg font-bold transition-all shadow-lg shadow-cyan-900/20 uppercase`}>
                {editandoId ? 'Actualizar Datos' : 'Guardar Empleado'}
              </button>
              
              {editandoId && (
                <button type="button" onClick={limpiarFormulario} className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-xs transition-all">
                  CANCELAR EDICIÓN
                </button>
              )}
            </div>
          </form>
        </div>

        {/* mostrar tabla con ACCIONES */}
        <div className="lg:col-span-2 bg-[#020617] border border-blue-900/30 rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1e293b] text-cyan-400 text-sm">
                <th className="p-4">Nombre</th>
                <th className="p-4">DNI</th>
                <th className="p-4 text-center">Inicio</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-300 text-sm">
              {empleados.map((emp) => (
                <tr key={emp.id} className="border-b border-blue-900/10 hover:bg-[#0f172a] transition-colors">
                  <td className="p-4 font-medium text-white">{emp.nombre}</td>
                  <td className="p-4 text-gray-400">{emp.dni}</td>
                  <td className="p-4 text-center font-mono">{emp.fecha_inicio}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => prepararEdicion(emp)}
                        className="p-1.5 bg-amber-900/20 text-amber-500 rounded border border-amber-900/30 hover:bg-amber-500 hover:text-white transition-all"
                        title="Editar"
                      >
                        ✎
                      </button>
                      <button 
                        onClick={() => eliminarEmpleado(emp.id)}
                        className="p-1.5 bg-red-900/20 text-red-500 rounded border border-red-900/30 hover:bg-red-500 hover:text-white transition-all"
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {empleados.length === 0 && (
            <div className="p-20 text-center text-gray-600 italic">No hay empleados registrados.</div>
          )}
        </div>

      </div>
    </div>
  );
}