import React, {ChangeEvent, FormEvent, useState} from 'react';
import { useHistory } from 'react-router-dom';


import './styles.css';
import api from '../../services/api';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const history = useHistory();

    async function handleSubmit(event: FormEvent){
        event.preventDefault();
        // TODO: Context API Logic
        // console.log(formData);
        api.post('profile/login', formData).then(res => {
            const { user, token } = res.data;
            localStorage.setItem('@Expose:user', JSON.stringify(user));
            localStorage.setItem('@Expose:token', token);

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            alert("Logado com sucesso!!!");
            history.push('/dashboard');
        }).catch(err => {
            window.alert(err.message);
        });
        
    }

    async function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        // O event do tipo ChangeEvent<Input> retorna todos os atributos possíveis de um input
        // Com isso eu pego o name e o value do Input
        const { name, value } = event.target;
        
        // O (...) conserva o que já tinha e altera ou cria um atributo novo no estado
        // O [name] estou usando o valor do name como nome do atributo(se já existe altera, senão cria um novo)
        setFormData({
            ...formData,
            [name]: value
        });
        // console.log(event.target);
    }

    return (
        <div id="page-login">

            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>
                        <h2>Login</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" onChange={handleInputChange} required/>
                    </div>

                    <div className="field">
                        <label htmlFor="password">Senha</label>
                        <input type="password" id="password" name="password" onChange={handleInputChange} required/>
                    </div>
                </fieldset>

                <button type="submit">
                    Logar
                </button>
            </form>
        </div>
    );
}

export default Login;
