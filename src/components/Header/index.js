import { useContext } from 'react'
import './header.css'
import { AuthenticateContext } from '../../contexts/authenticate'
import avatar from  '../../assets/avatar.jpg'
import { FiHome, FiUser, FiSettings } from "react-icons/fi";


import { Link } from 'react-router-dom'

export default function Header(){
    const { hasPermission, user } = useContext(AuthenticateContext)
    
    return(
        <div  className='sidebar'>
            <div>
                <img src={user.imgProfile === null ? avatar : user.imgProfile} alt='Foto de perfil' >
                </img>
            </div>

            <Link to='/dashboard'>
                <FiHome color='#FFF' size={24} /> 
                Chamados
            </Link>
            {user && hasPermission(user, 'Admin') && (
                <Link to='/customers'>
                    <FiUser color='#FFF' size={24} /> 
                    Clientes
                </Link>
            )}
            <Link to='/profile'>
                <FiSettings color='#FFF' size={24} /> 
                Configurações
            </Link>

        </div>
    )
}