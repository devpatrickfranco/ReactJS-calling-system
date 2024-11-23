import { useContext, useState } from 'react';
import './header.css';
import { AuthenticateContext } from '../../contexts/authenticate';
import avatar from '../../assets/avatar.jpg';
import { FiHome, FiUser, FiUsers, FiSettings, FiCalendar } from 'react-icons/fi';
import { TbCategoryPlus } from 'react-icons/tb';

import { Link } from 'react-router-dom';

export default function Header() {
    const { hasPermission, user } = useContext(AuthenticateContext);

    // Estado para gerenciar as cores dos ícones
    const [iconColors, setIconColors] = useState({
        home: '#754FFE',
        calendar: '#754FFE',
        customers: '#754FFE',
        users: '#754FFE',
        category: '#754FFE',
        settings: '#754FFE',
    });

    // Funções para mudar as cores
    const handleMouseEnter = (icon) => {
        setIconColors((prevColors) => ({
            ...prevColors,
            [icon]: '#fff',
        }));
    };

    const handleMouseLeave = (icon) => {
        setIconColors((prevColors) => ({
            ...prevColors,
            [icon]: '#754FFE',
        }));
    };

    return (
        <div className="sidebar">
            <div>
                <img
                    src={user.imgProfile === null ? avatar : user.imgProfile}
                    alt="Foto de perfil"
                />
                <p>{user.nome}</p>
            </div>

            <Link
                to="/dashboard"
                onMouseEnter={() => handleMouseEnter('home')}
                onMouseLeave={() => handleMouseLeave('home')}
                style={{ color: iconColors.home, display: 'flex', alignItems: 'center' }}
            >
                <FiHome color={iconColors.home} size={24} />
                Chamados
            </Link>

            <Link
                to="/calendar"
                onMouseEnter={() => handleMouseEnter('calendar')}
                onMouseLeave={() => handleMouseLeave('calendar')}
                style={{ color: iconColors.calendar, display: 'flex', alignItems: 'center' }}
            >
                <FiCalendar color={iconColors.calendar} size={24} />
                Calendário
            </Link>

            {user && hasPermission(user, 'superAdmin') && (
                <Link
                    to="/customers"
                    onMouseEnter={() => handleMouseEnter('customers')}
                    onMouseLeave={() => handleMouseLeave('customers')}
                    style={{ color: iconColors.customers, display: 'flex', alignItems: 'center' }}
                >
                    <FiUser color={iconColors.customers} size={24} />
                    Clientes
                </Link>
            )}

            {user && hasPermission(user, 'superAdmin') && (
                <Link
                    to="/users"
                    onMouseEnter={() => handleMouseEnter('users')}
                    onMouseLeave={() => handleMouseLeave('users')}
                    style={{ color: iconColors.users, display: 'flex', alignItems: 'center' }}
                >
                    <FiUsers color={iconColors.users} size={24} />
                    Usuários
                </Link>
            )}

            {user && hasPermission(user, 'superAdmin') && (
                <Link
                    to="/category"
                    onMouseEnter={() => handleMouseEnter('category')}
                    onMouseLeave={() => handleMouseLeave('category')}
                    style={{ color: iconColors.category, display: 'flex', alignItems: 'center' }}
                >
                    <TbCategoryPlus color={iconColors.category} size={24} />
                    Categorias
                </Link>
            )}

            <Link
                to="/profile"
                onMouseEnter={() => handleMouseEnter('settings')}
                onMouseLeave={() => handleMouseLeave('settings')}
                style={{ color: iconColors.settings, display: 'flex', alignItems: 'center' }}
            >
                <FiSettings color={iconColors.settings} size={24} />
                Configurações
            </Link>
        </div>
    );
}
