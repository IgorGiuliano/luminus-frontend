import React, { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/auth';
import styles from './styles.module.scss';
import { IoLogOutOutline } from 'react-icons/io5';
import { api } from '../../services/api';

const Profile: React.FC = () => {
    const [ user_cod, setUserCod ] = useState("");
    const [ nome, setName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ pass, setPass ] = useState("");
    const [ newPass, setNewPass ] = useState("");
    const [ newPassConfirmation, setNewPassConfirmation ] = useState("");
    const [ new_nome, setNewName ] = useState("");
    const [ new_email, setNewEmail ] = useState("");
    const { signed, Logout } = useAuth();

    async function handleLogout() { // logout né porra
        Logout();
        window.location.replace('http://localhost:3000/')
    }

    function showUser() {
        document.getElementById("u").style.display = "flex";
        document.getElementById("p").style.display = "none";
    }

    async function getUserData(user_cod:string|null) {
        if(user_cod != null){
            const result = await api.post('/find-user-data', {user_cod: user_cod});
            setUserCod(result.data.cod_user);
            setEmail(result.data.email);
            setName(result.data.nome);
            setNewEmail(result.data.email);
            setNewName(result.data.nome);
        }
    }

    async function updateUserData(event: FormEvent) {
        event.preventDefault();

        const result = await api.post('/update-user-data', {user_cod:user_cod, nome:new_nome, email:new_email});
        if(result.status === 200) {
            window.location.reload()
        }
        
    }

    function showPass() {
        document.getElementById("u").style.display = "none";
        document.getElementById("p").style.display = "flex";
    }

    async function updatePass(event: FormEvent) {
        event.preventDefault();
        if(newPass.length<6){
            window.alert("Senha com menos de 6 caracteres, favor revisar")
        } 
        
        if(newPass === newPassConfirmation) {
            const result = await api.post("/update-user-pass", {user_cod: user_cod, pass: pass, newPass: newPass, newPassConfirmation: newPassConfirmation});
            if(result.status === 200) {
                handleLogout();
            }
        }
    }

    useEffect(() => {
        const user_cod = sessionStorage.getItem('@App:cod');
        getUserData(user_cod);

    }, [])

    return (
        <div className={styles.profileWrapper}>
            <header>
                <div>
                    <a href="/">Luminus</a>
                </div>
                <div>
                    <a href="/dashboard">DASHBOARD</a>
                    <a onClick={handleLogout}><IoLogOutOutline size="30" /></a>
                </div>
            </header>
            <main>
                <div className={styles.formProfile}>
                    <div className={styles.profilePanel}>
                        <div>
                            <label htmlFor="" className={styles.config}> CONFIGURAÇÕES</label>
                            <div>
                                <button onClick={showUser} >Usuário</button>
                                <button onClick={showPass} >Senha</button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.form}>
                        <form onSubmit={updateUserData} className={styles.user} id="u">
                            <label htmlFor="">NOME</label>
                            <input 
                                type="text"  
                                placeholder={nome} 
                                onChange={(event) => setPass(event.target.value)}
                                value={nome}
                                required
                            />
                            <label htmlFor="">EMAIL</label>
                            <input 
                                type="text" 
                                placeholder={email} 
                                onChange={(event) => setNewEmail(event.target.value)}
                                value={new_email}
                                required
                            />
                            <div>
                                <button type="submit">ATUALIZAR DADOS</button>
                            </div>
                        </form>
                        <form onSubmit={updatePass} className={styles.password} id="p">
                            <label htmlFor="">SENHA ATUAL</label>
                            <input 
                                type="password" 
                                placeholder="Senha atual"
                                onChange={(event) => setPass(event.target.value)}
                                value={pass}
                                required
                            />
                            <label htmlFor="">NOVA SENHA</label>
                            <input 
                                type="password" 
                                placeholder="Nova senha"
                                onChange={(event) => setNewPass(event.target.value)}
                                value={newPass}
                                required
                            />
                            <label htmlFor="">CONFIRMAR SENHA</label>
                            <input 
                                type="password"
                                placeholder="Confirmar nova senha"
                                onChange={(event) => setNewPassConfirmation(event.target.value)}
                                value={newPassConfirmation}
                                required 
                            />
                            <div>
                                <button type="submit">ATUALIZAR DADOS</button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <footer>

            </footer>
        </div>
    )
}

export default Profile;