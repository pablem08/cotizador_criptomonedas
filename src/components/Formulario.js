import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import Error from './Error';
import useMoneda from '../hooks/useMoneda';
import useCryptomoneda from '../hooks/useCryptomoneda';
import axios from 'axios';
const Boton = styled.input`
    margin-top: 20px;
    font-weight: bold;
    font-size: 20px;
    padding: 10px;
    background-color: #66a2fe;
    border: none;
    width: 100%;
    border-radius: 10px;
    color: #FFF;
    transition: background-color .3s ease;


    &:hover{
        background-color: #326AC0;
        cursor: pointer;
    }
`;
const Formulario = ({ guardarMoneda, guardarCryptomoneda }) => {

    // state del listado de cryptomonedas
    const [listacrypto, guardarCryptomonedas] = useState([]);
    const [error, guardarError] = useState(false);

    const MONEDAS = [
        { codigo: 'USD', nombre: 'Dolar de Estados Unidos' },
        { codigo: 'MXN', nombre: 'Peso Mexicano' },
        { codigo: 'EUR', nombre: 'Euro' },
        { codigo: 'GBP', nombre: 'Libra Esterlina' },
        { codigo: 'ARS', nombre: 'Peso Argentino' }
    ];

    // Utilizo useMoneda
    const [moneda, SelectMoneda] = useMoneda('Elige tu Moneda', '', MONEDAS);

    // Utilizo useCryptomoneda
    const [cryptomoneda, SelectCrypto] = useCryptomoneda('Elige tu Cryptomoneda', '', listacrypto);

    // Ejecuto el llamado a la API
    useEffect(() => {
        const consultarAPI = async () => {
            const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

            const resultado = await axios.get(url);

            guardarCryptomonedas(resultado.data.Data);
        }
        consultarAPI();
    }, []);

    // Cuando el usuario hace submit
    const cotizarMoneda = e => {
        e.preventDefault();

        // Valido si ambos campos estan llenos
        if (moneda === '' || cryptomoneda === '') {
            guardarError(true);
            return;
        }

        // Paso los datos al componente principal
        guardarError(false);
        guardarMoneda(moneda);
        guardarCryptomoneda(cryptomoneda);
    }
    return (
        <form
            onSubmit={cotizarMoneda}
        >
            {error ? <Error mensaje="Todos los campos son obligatorios" /> : null}

            <SelectMoneda />

            <SelectCrypto />

            <Boton
                type="submit"
                value="Calcular"
            />
        </form>
    );
}

export default Formulario;