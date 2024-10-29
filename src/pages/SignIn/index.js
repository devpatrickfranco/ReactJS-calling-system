import { useState, useContext } from 'react';
import { Link } from 'react-router-dom'

import { AuthenticateContext } from '../../contexts/authenticate'
import './signin.css'
import suporte from '../../assets/suporte.png'


function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

  const { signIn, loadingAuthenticate } = useContext(AuthenticateContext)

    function handleSubmit(e){
      e.preventDefault()
      if(email !== '' && password !== '') {
        signIn(email, password)
      }
    } 

  return (
      <div className='container-center'>
        <div className='login'>
          <div className='login-area' >
                <img src={suporte} alt='Logo de suporte'></img>
          </div>

            <form onSubmit={handleSubmit}>
              <h1>
                Entrar
              </h1>
              <input type='text' placeholder='seuemail@damaface.com' value={email} onChange={(e) => setEmail(e.target.value)} ></input>
              <input type='password' placeholder='********' value={password} onChange={(e) => setPassword(e.target.value)}></input>
              <button type='submit'>
              { loadingAuthenticate ? 'Carregando...' : 'Acessar'}
              </button>
            </form>

            <Link to='/register'>
              Criar uma conta
            </Link> 
        </div>  
      </div>
    );
  }
  
  export default SignIn;
  