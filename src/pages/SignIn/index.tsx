import styles from './styles.module.scss';
import { MdArrowBack } from 'react-icons/md'
import { FormEvent, useState } from 'react';
import { api } from '../../services/api';


const SignIn:React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    async function signIn(event: FormEvent) {
        event.preventDefault()
        const token = await api.post('/register', { 'name':name ,'email': email, 'pass': password, 'passConfirmation':passwordConfirmation })
        console.log(token.data.token)
        localStorage.setItem('token', JSON.stringify(token.data.token));
        api.defaults.headers.common.authorization = `Bearer ${token}`;
        window.location.replace("http://localhost:3000/login")
    }

    return (
        <div className={styles.signInBoxWrapper}>
            <a href="/">
                <MdArrowBack size='30px' />
            </a>
            <div className={styles.logo}>
                LuMinus.tech
            </div>
            <div className={styles.signInFormWrapper}>
                <div className={styles.formWrapper}>
                    <form onSubmit={signIn}>
                        <label htmlFor="">NOME</label>
                        <input
                            type="name"
                            onChange={(event) => setName(event.target.value)}
                            value={name}
                            required
                        />
                        <label htmlFor="">EMAIL</label>
                        <input
                            type="email"
                            onChange={(event) => setEmail(event.target.value)}
                            value={email}
                            required
                        />
                        <label htmlFor="">SENHA</label>
                        <input
                            type="password"
                            onChange={(event) => setPassword(event.target.value)}
                            value={password}
                            required
                        />
                        <label htmlFor="">CONFIRMAR SENHA</label>
                        <input
                            type="password"
                            onChange={(event) => setPasswordConfirmation(event.target.value)}
                            value={passwordConfirmation}
                            required
                        />
                        <div>
                            <button type="submit">CRIAR CONTA</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignIn