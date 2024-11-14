import { useContext } from 'react'
import './header.css'
import { AuthenticateContext } from '../../contexts/authenticate'
import avatar from  '../../assets/avatar.jpg'
import { FiHome, FiUser, FiUsers, FiSettings, FiCalendar } from "react-icons/fi";
import { TbCategoryPlus } from "react-icons/tb";

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
            <Link to='/calendar'>
                <FiCalendar color='#FFF' size={24} /> 
                Calendario
            </Link>
            {user && hasPermission(user, 'superAdmin') && (
                <Link to='/customers'>
                    <FiUser color='#FFF' size={24} /> 
                    Clientes
                </Link>
            )}
            {user && hasPermission(user, 'superAdmin') && (
            <Link to={'/users'}>
                <FiUsers color='#FFF' size={24}/>
                Usuarios
            </Link> 
            )}
            {user && hasPermission(user, 'superAdmin') && (
            <Link to='/category'>
                <TbCategoryPlus color='#FFF' size={24} /> 
                Categorias
            </Link>
            )}         
            <Link to='/profile'>
                <FiSettings color='#FFF' size={24} /> 
                Configurações
            </Link>


        </div>

        
    )
}