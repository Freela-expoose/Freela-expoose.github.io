import React, {ChangeEvent, FormEvent, useState} from 'react';
import { useHistory } from 'react-router-dom';
import './styles.css';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const history = useHistory();

    async function handleSubmit(event: FormEvent){
        event.preventDefault();
        // TODO: Context API Logic
        history.push('/dashboard');
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
        console.log(event.target);
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
                        <input type="email" name="email" id="email" onChange={handleInputChange}/>
                    </div>

                    <div className="field">
                        <label htmlFor="password">Senha</label>
                        <input type="password" id="password" name="password" onChange={handleInputChange}/>
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
