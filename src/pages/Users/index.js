import React, { useState, useContext } from 'react';
import { Button, Form, Modal, Accordion } from 'react-bootstrap';
import { FiUsers } from 'react-icons/fi';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { useUsers, deleteUser } from '../../useCase/firebaseServicesUser'; // Supondo que você tenha esse hook para pegar os usuários
import { AuthenticateContext } from '../../contexts/authenticate';

import './users.css';

export default function Users() {
    const { users, loading, error } = useUsers();
    const [showModal, setShowModal] = useState(false); // Controle do modal
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('superAdmin');
    
    const { signUp } = useContext(AuthenticateContext);
    
    const handleAddUser = () => {
        if (nome !== '' && email !== '' && password !== '' && role !== '') {
            signUp(nome, email, password, role);
            setShowModal(false); // Fecha o modal após adicionar o usuário
        }
    };

    const handleRemoveUser = (userId) => {
        if (window.confirm('Tem certeza que deseja remover este usuário?')) {
            deleteUser(userId)
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>Erro ao carregar usuários.</div>;
    }

    const superAdmins = users.filter(user => user.role === 'superAdmin');
    const admins = users.filter(user => user.role === 'admin');
    const regularUsers = users.filter(user => user.role === 'user');

    return (
        <div>
            <Header />
            <div className="content">
                <Title name={'Usuarios'}>
                    <FiUsers size={24} />
                </Title>

                <div className="container">
                    <h1>Lista de Usuários</h1>
                    <Accordion className="mt-4">
                        {/* Accordion para SuperAdmins */}
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>SuperAdmins</Accordion.Header>
                            <Accordion.Body>
                                <ul>
                                    {superAdmins.length > 0 ? (
                                        superAdmins.map((user) => (
                                            <li key={user.id}>
                                                <strong>{user.nome}</strong> - {user.email}
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="ml-2"
                                                    onClick={() => handleRemoveUser(user.id)}
                                                >
                                                    Remover
                                                </Button>
                                            </li>
                                        ))
                                    ) : (
                                        <li>Nenhum SuperAdmin encontrado.</li>
                                    )}
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* Accordion para Admins */}
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Admins</Accordion.Header>
                            <Accordion.Body>
                                <ul>
                                    {admins.length > 0 ? (
                                        admins.map((user) => (
                                            <li key={user.id}>
                                                <strong>{user.nome}</strong> - {user.email}
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="ml-2"
                                                    onClick={() => handleRemoveUser(user.id)}
                                                >
                                                    Remover
                                                </Button>
                                            </li>
                                        ))
                                    ) : (
                                        <li>Nenhum Admin encontrado.</li>
                                    )}
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* Accordion para Usuários */}
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Usuários</Accordion.Header>
                            <Accordion.Body>
                                <ul>
                                    {regularUsers.length > 0 ? (
                                        regularUsers.map((user) => (
                                            <li key={user.id}>
                                                <strong>{user.nome}</strong> - {user.email}
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="ml-2"
                                                    onClick={() => handleRemoveUser(user.id)}
                                                >
                                                    Remover
                                                </Button>
                                            </li>
                                        ))
                                    ) : (
                                        <li>Nenhum usuário encontrado.</li>
                                    )}
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    {/* Botão para abrir o Modal */}
                    <div className="mt-4">
                        <Button variant="primary" onClick={() => setShowModal(true)}>
                            Adicionar Usuário
                        </Button>
                    </div>

                    {/* Modal para Adicionar Usuário */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Adicionar Usuário</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formNome">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        placeholder="Digite o nome"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Digite o email"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formPassword">
                                    <Form.Label>Senha</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Digite a senha"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formRole">
                                    <Form.Label>Cargo</Form.Label>
                                    <Form.Select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="superAdmin">SuperAdmin</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">Usuário</option>
                                    </Form.Select>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={handleAddUser}>
                                Adicionar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
}
