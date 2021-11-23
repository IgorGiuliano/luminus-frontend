import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/auth';
import { Bar } from 'react-chartjs-2';
import { api } from '../../services/api';
import { IoLogOutOutline } from 'react-icons/io5'

type Sensor = {
    sensor_name: string,
    user_cod: string
}

const Dashboard: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState("ESP12-001");

    const { signed, Logout } = useAuth();
    const [sensors, setSensors] = useState<Sensor[]>([]);

    const [status, setEstado] = useState(0);
    const [lastDayData, setLastDayData] = useState(0);
    const [lastMonthData, setLastMonthData] = useState(0);
    const [twoMonthData, setTwoMonthData] = useState(0);
    const [threeMonthData, setThreeMonthData] = useState(0);

    async function handleLogout() { // logout né porra
        Logout();
        window.location.replace('http://localhost:3000/')
    }
    
    async function findUserSensors() { // pega os sensores do usuário
        const result = await api.post('/find-user-sensors', { user_cod: sessionStorage.getItem('@App:cod') })
        setSensors(result.data)
    }

    async function communicate() { // ainda não mexe nessa porra
        const data = {
            sensor_name: selectedOption,
            state: "on"
        }

        api.post('/luminus-api-alterate-state', data);
    }

    async function getSensorData() {
        sessionStorage.setItem('@App:opt', selectedOption);
        const sensor_name = sessionStorage.getItem('@App:opt');
        if(sensor_name != null) {
            const result = await api.post('/find-sensor-data', { sensor_name: sensor_name });
            setLastMonthData(result.data.last_month[0].last_month);
            setTwoMonthData(result.data.two_month[0].two_month);
            setThreeMonthData(result.data.three_month[0].three_month);
            setLastDayData(result.data.last_day[0].last_day);
            setEstado(result.data.estado.estado);
            const button = window.document.getElementById("button")
            if(button!=null){
                if( result.data.estado.estado === 1 ) {
                    button.innerHTML = "Apagar"
                    button.style.backgroundColor = "rgba(248, 210, 85, 1)"
                    button.style.color = "#121214"
                } else if( result.data.estado.estado === 0 ) {
                    button.innerHTML = "Acender"
                    button.style.backgroundColor = "#121214"
                    button.style.color = "#fff"
                    button.style.border = "rgba(248, 210, 85, 1) solid 1px"
                }
            }
        }
    }

    async function alterateState() {
        const sensor_name = sessionStorage.getItem('@App:opt');
        console.log(status)
        if(status === 0) {
            const estado = await api.post('/luminus-api-alterate-state', { sensor_name: sensor_name, state:"on" });
        } else if(status === 1) {
            await api.post('/luminus-api-alterate-state', { sensor_name: sensor_name, state:"off" });
        }
    }

    useEffect(() => { //tira enxerido
        const storagedUser = sessionStorage.getItem('@App:cod');
        const storagedToken = sessionStorage.getItem('@App:token');

        if (!storagedToken && !storagedUser) {
            window.location.replace('http://localhost:3000/')
        }
    },[])

    useEffect(() => { //quando carrega a pag pega dados
        const interval = setInterval(()=>{
        },2000)
        return () => clearInterval(interval)
    },[])

    useEffect(() => {
        findUserSensors();
        const interval = setInterval(()=>{
            getSensorData();
        },2000)
        return ()=>clearInterval(interval)
    }, [])
    
    const data = {
        chartData: {
            labels: ['09/2021', '10/2021', '11/2021'],
            datasets: [{
                type: 'bar' as any,
                label: 'Kwh (quilowatt-hora)' as any,
                data: [((threeMonthData / -1000.0).toFixed(2)), ((twoMonthData / -1000.0).toFixed(2)), ((lastMonthData / -1000.0).toFixed(2)),] as any,
                backgroundColor: [
                    'rgba(248, 210, 85, .78)'
                ] as any,
                borderColor: [
                    'rgba(248, 210, 85, .0)'
                ] as any,
                borderWidth: 1 as any,
            }]
        }
    };

    return (
        <div className={styles.dashboardWrapper}>
            <header>
                <div>
                    <a href="/">LuMinus</a>
                </div>
                <div>
                    <a href="/profile">PERFIL</a>
                    <a onClick={handleLogout}><IoLogOutOutline size="20" /></a>
                </div>
            </header>
            <main>
                <div className={styles.controlPanel}>
                    <div className={styles.namePanel}>
                        <select name="sensors" id="sensor" onChange={e => { setSelectedOption(e.target.value);  }} value={selectedOption}>
                            <option value="" >ESP12-001</option>
                            {
                                sensors.map((sensor) => (
                                    <option value={sensor.sensor_name} key={sensor.sensor_name}>{sensor.sensor_name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className={styles.contentPanel}>
                        <div>
                            <p>ENERGIA CONSUMIDA EM 24 HORAS:<br /><span>{(lastDayData / -1000.0).toFixed(2)} KW</span></p>
                            <p>GASTO EM REAIS EM 24 HORAS:<br /><span>{((lastMonthData / -1000.0) * 0.32652).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></p>
                            <p>ENERGIA CONSUMIDA EM 30 DIAS:<br /><span> {(lastMonthData / -1000.0).toFixed(2)} KW</span></p>
                            <p>GASTO EM REAIS NO MES:<br /><span>{((lastMonthData / -1000.0) * 0.32652).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></p>
                        </div>

                    </div>
                    <div className={styles.buttonPanel}>
                        <button onClick={alterateState} id="button">
                        </button>
                    </div>
                </div>
                <div className={styles.barChart}>
                    <Bar
                        data = {data.chartData}
                        options={{
                            maintainAspectRatio: false,
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Gasto de Energia',
                                },
                                legend: {
                                    position: 'top'
                                }
                            },
                        }}

                    />
                </div>
            </main>
            <footer>

            </footer>
        </div>
    )
}

export default Dashboard;