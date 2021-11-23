import styles from './styles.module.scss';
import { MdArrowBack } from 'react-icons/md'
import { FormEvent, useContext, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/auth';

const LoginBox: React.FC = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const { signed, Login } = useAuth();
  
    console.log(signed);

    async function signUp(event: FormEvent) {
        event.preventDefault();
        email.toLocaleLowerCase();

        if(pass.length<6){
            window.alert("Senha com menos de 6 caracteres, favor revisar")
        } else {
            await Login({
                'email': email,
                'pass': pass,
            });
        }
    }

    useEffect(()=>{
        if(signed===true){
            window.location.replace('http://localhost:3000/dashboard')
        }
    })

    return (
        <div className={styles.loginBoxWrapper}>
            <div className={styles.logo}>
                LuMinus.tech
            </div>
            <div className={styles.loginFormWrapper}>
                <div className={styles.formWrapper}>
                    <form onSubmit={signUp}>
                        <label htmlFor="">LOGIN</label>
                        <input
                            type="email"
                            onChange={(event) => setEmail(event.target.value)}
                            value={email}
                            required
                        />
                        <label htmlFor="">SENHA</label>
                        <input
                            type="password"
                            onChange={(event) => setPass(event.target.value)}
                            value={pass}
                            required
                            
                        />
                        <div>
                            <button type="submit">ACESSAR</button>
                            <a href="/signin" >CRIAR CONTA</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default LoginBox;