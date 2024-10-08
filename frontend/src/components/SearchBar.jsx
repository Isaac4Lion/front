'use client'

import { useState } from 'react';

const SearchBar = ({ lotes, setLotes, type }) => {
    const [searchOption, setSearchOption] = useState('Nombre');
    const [filter, setFilter] = useState(false)
    const [form, setForm] = useState({
        Nombre: "",
        Vendedor: "",
        Lote: {
            etapa: "",
            manzana: "",
            lote: ""
        },
        Estado: "",
        Condicion: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const listarLotes = async (query) => {
        setLoading(true);
        setError(null);
        try {
            const queryString = Object.keys(query)
                .filter(key => query[key])
                .map(key => `${key.toLowerCase()}=${query[key]}`)
                .join('&');
            const token = localStorage.getItem('token')
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/lotes${type === 'desistidos' ? '-desistidos':''}?${queryString}`, {headers:{Authorization: `Bearer ${token}`}});
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setLotes(data);
            queryString ? setFilter(true) : setFilter(false)
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const cleanQuery = () => {
        setForm({
            Nombre: "",
            Vendedor: "",
            Lote: {
                etapa: "",
                manzana: "",
                lote: ""
            },
            Estado: "",
            Condicion: "",
        })
        setFilter(false)
        setSearchOption('Nombre')
        listarLotes('')
    }

    const handleChange = (e) => {
        setSearchOption(e.target.value);
    };

    const handleValue = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => {
            if (searchOption === 'Lote') {
                return {
                    ...prevForm,
                    Lote: {
                        ...prevForm.Lote,
                        [name]: value
                    }
                };
            } else {
                return {
                    ...prevForm,
                    [searchOption]: value
                };
            }
        });
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        const query = searchOption === 'Lote' ? form.Lote : { [searchOption]: form[searchOption] };
        listarLotes(query);
    };

    return (
    <>
        <div className="flex justify-center m-2">
            <form className="flex flex-col-reverse md:flex-row gap-3" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row">
                    {filter && 
                    <button type="button" onClick={() => cleanQuery()} className="font-bold text-slate-500 px-2 md:px-3 py-2 md:py-1">X</button>
                    }
                    <input type="number" name="etapa" min="1" max="4" placeholder="Etapa"
                        className={`w-full md:w-28 px-3 h-10 rounded-l border-2 border-sky-500 focus:outline-none ${searchOption === 'Lote' ? '' : 'hidden'}`}
                        onChange={handleValue}
                        value={form.Lote?.etapa}
                     />
                    <input type="text" name="manzana" maxLength="2" placeholder="Manzana"
                        className={`w-full md:w-28 px-3 h-10 rounded-l border-2 border-sky-500 focus:outline-none ${searchOption === 'Lote' ? '' : 'hidden'}`}
                        onChange={handleValue}
                        value={form.Lote?.manzana} 
                        />
                    <input type="number" name="lote" min="1" max="50" placeholder="Lote"
                        className={`w-full md:w-28 px-3 h-10 rounded-l border-2 border-sky-500 focus:outline-none ${searchOption === 'Lote' ? '' : 'hidden'}`}
                        onChange={handleValue} 
                        value={form.Lote?.lote}
                        />
                    <input 
                    name={searchOption} 
                    type="text" 
                    placeholder={`Busca por ${searchOption.toLowerCase()} / 'Enter' para refrescar`} 
                    onChange={handleValue}
                    value={form[searchOption]}
                        className={`w-full md:w-80 px-3 h-10 rounded-l border-2 border-sky-500 focus:outline-none ${searchOption === 'Lote' ? 'hidden' : ''}`}
                    />
                    <button type="submit" className="bg-sky-500 text-white rounded-b md:rounded-none md:rounded-r px-2 md:px-3 py-2 md:py-1">Buscar</button>
                </div>
                <select id="queryType" name="queryType" value={searchOption} onChange={handleChange}
                    className="w-full h-10 border-2 border-sky-500 focus:outline-none text-sky-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider">
                    <option value="Nombre">Cliente</option>
                    <option value="Vendedor">Vendedor</option>
                    <option value="Lote">Lote</option>
                    <option value="Estado">Estado Comisión</option>
                    <option value="Condicion">Tipo de Condición</option>
                </select>
            </form>
        </div>
        {lotes.length === 0 && 
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-2 rounded relative" role="alert">
                <span className="block sm:inline">No existe el lote que buscas.</span>
            </div>
            }
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
    </>
    );
};

export default SearchBar;
