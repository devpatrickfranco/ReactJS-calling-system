import { useState, useContext } from 'react';

import { FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FaFacebookF } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { FaTiktok } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { FaKey } from "react-icons/fa6";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { AuthenticateContext } from '../../contexts/authenticate'

import logoSuporte from '../../assets/logo-suporte.png'
import loginSecurity from '../../assets/login-security.gif' 
import './signin.css'

function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);

  const { signIn, loadingAuthenticate } = useContext(AuthenticateContext)

    function handleSubmit(e){
      e.preventDefault()
      if(email !== '' && password !== '') {
        signIn(email, password)
      }
    } 

  return (
<>
  <header>
    <div className="helpers">
      <div className="contacts">
        <span>
          <FaPhoneAlt size={18} color='#754FFE'/>
          <p>+55 19995544809</p>
        </span>
        <span>
          <IoMail size={18} color='#754FFE'/>
          <p>contato@damaface.com.br</p>
        </span>
      </div>
      
      <div className="social-icons">
        <a href="/#" target="_blank">
          <FaFacebookF size={18} color='#1E293B'/>
        </a>
        <a href="/#" target="_blank">
          <AiFillInstagram size={18} color='#1E293B'/>
        </a>
        <a href="/#" target="_blank">
          <FaTiktok size={18} color='#1E293B'/>
        </a>
      </div>
    </div>

  </header>
  <div><img  src={logoSuporte} style={{width: '200px', heigth: '10px', margin: '0 120px'}}></img></div>
  <main style={{display: 'flex', marginTop: '30px'}}>
    <div>
      <img src={loginSecurity} style={{width: '400px', heigth: '400px', margin: '20px 120px'}}></img>
    </div>
    <div className='container-center'>
        <div className='login'>
          <div className='login-area' >
                <h3> 
                Conecte-se<span>!</span>
                </h3>
          
                <p>
                Explore, aprenda e cresça conosco. Desfrute de uma<br></br> jornada educacional enriquecedora e contínua. Vamos começar!
                </p>
          </div>


          <form onSubmit={handleSubmit} className="login">
          <h5>Seu email</h5>
          <div className="input-wrapper">
            <i className="icon"><FaUserAlt size={18} /></i>
            <input
              type="text"
              placeholder="seuemail@damaface.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <h5>Senha</h5>
          <div className="input-wrapper">
            <i className="icon"><FaKey size={18} /></i>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOffSharp size={18} /> : <IoEyeSharp size={18} />}
            </i>
          </div>

          <button type="submit">
            {loadingAuthenticate ? "Carregando..." : "Conecte-se"}
          </button>
        </form>

        </div>  
      </div>
  </main>
</>
    );
    
  }
  
  export default SignIn;
  