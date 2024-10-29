import { useState, useContext } from 'react';
import { AuthenticateContext } from '../../contexts/authenticate'
import { Link } from 'react-router-dom'
import suporte from '../../assets/suporte.png'


function SignUp() {
    const [nome, SetNome] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { signUp, loadingAuthenticate } = useContext(AuthenticateContext)

    function handleSubmit(e){
      e.preventDefault()
      if(nome !== '' && email!== '' && password !== '') {
        signUp(nome, email, password)
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
                Cadastrar uma conta
              </h1>
              <input type='text' placeholder='Seu Nome' value={nome} onChange={(e) => SetNome(e.target.value)} ></input>
              <input type='text' placeholder='seuemail@damaface.com' value={email} onChange={(e) => setEmail(e.target.value)} ></input>
              <input type='password' placeholder='********' value={password} onChange={(e) => setPassword(e.target.value)}></input>
              <button type='submit'>
              { loadingAuthenticate ? 'Carregando...' : 'Acessar'}
              </button>
            </form>

            <Link to='/'>
              Já tem uma conta: Entre
            </Link> 
        </div>  
      </div>
    );
  }
  
  export default SignUp;
  