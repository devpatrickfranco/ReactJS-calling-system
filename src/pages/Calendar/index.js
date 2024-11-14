import React, { useState, useEffect, useContext } from 'react';
import { FiCalendar } from 'react-icons/fi';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Modal, Button, Form, Tab, Nav } from 'react-bootstrap';
import moment from 'moment';

import { dbFirebase } from '../../services/firebaseConnection';
import { AuthenticateContext } from '../../contexts/authenticate';
import { fetchEvents } from '../../useCase/firebaseServiceCalender';
import Header from '../../components/Header/';
import Title from '../../components/Title';
import avatar from '../../assets/avatar.jpg';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';
import 'moment/locale/pt-br';

// Configuração do Moment.js

moment.locale('pt-br');
const localizer = momentLocalizer(moment);
        
// Estilo para os eventos com base na prioridade
const eventStyleGetter = (event) => {
  let backgroundColor;
  switch (event.priority) {
    case 'urgent':
      backgroundColor = 'red';
      break;
    case 'regular':
      backgroundColor = 'orange';
      break;
    case 'low':
      backgroundColor = 'green';
      break;
    default:
      backgroundColor = 'blue';
  }
  return {
    style: { backgroundColor, color: 'white', borderRadius: '5px', padding: '5px' },
  };
};

export default function CalendarPage() {
  const { hasPermission, user } = useContext(AuthenticateContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState(null);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [eventData, setEventData] = useState({
    title: '',
    start: '',
    end: '',
    description: '',    
    priority: 'regular',
    assignedUsers: [],
  });
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Carregar usuários do Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await dbFirebase.firestore().collection('users').get();
        const fetchedUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const sortedUsers = fetchedUsers.sort((a, b) => {
          if ((a.role === 'superAdmin' || a.role === 'admin') && b.role === 'user') return -1;
          if ((b.role === 'superAdmin' || b.role === 'admin') && a.role === 'user') return 1;
          return 0;
        });

        setUsers(sortedUsers);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers();
  }, []);

  // Carregar eventos do Firestore
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventos = await fetchEvents();
        setEvents(eventos);
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      }
    };

    loadEvents();
  }, []);

  // Abrir o modal com os detalhes do evento
  const handleEventClick = (event) => {
    setEventDetails(event);
    setIsModalOpen(true);
  };

  // Fechar o modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEventDetails(null);
  };

  // Atualizar dados do evento no estado
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Alternar seleção de usuários
  const toggleUserSelection = (user) => {
    const exists = selectedUsers.some((u) => u.id === user.id);
    if (exists) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Criar evento
  const handleCreateEvent = async () => {
    try {
      const auth = dbFirebase.auth();
      const userLoaded = new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          unsubscribe();
          if (user) resolve(user);
          else reject('Usuário não autenticado');
        });
      });

      const currentUser = await userLoaded;
      const userAuthenticate = await dbFirebase.firestore().collection('users').doc(currentUser.uid).get();

      const eventWithUsers = {
        ...eventData,
        createdBy: {
          nome: userAuthenticate.data().nome,
          imgProfile: userAuthenticate.data().imgProfile,
        },
        assignedUsers: selectedUsers.map((user) => ({
          userId: user.id,
          nome: user.nome,
          imgProfile: user.imgProfile
        })),
      };

      

      await dbFirebase.firestore().collection('eventos').add(eventWithUsers);
      alert('Evento criado com sucesso!');
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
    }
  };

  
  return (
    <div>
      <Header />
      <div className="content">
        <Title name={'Calendário'}>
          <FiCalendar size={24} />
        </Title>

        {user && hasPermission(user, 'admin') && (
          <div className="btns" onClick={() => setShowModal(true)} style={{ display: 'flex', justifyContent: 'end', marginRight: '10px' }}>
            <Button variant="primary">Adicionar Evento</Button>
            <div className="btns" onClick={() => setShowModal(true)} style={{ display: 'flex', justifyContent: 'end' }}>
            <Button variant="danger">Cancelar Evento</Button>
          </div>    
          </div>
        )}



        {/* Modal para mostrar detalhes do evento */}
        <Modal size="lg" show={isModalOpen} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Detalhes do Evento</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {eventDetails && (
              <div>
                <h4>{eventDetails.title}</h4>
                <p><strong>Descrição:</strong> {eventDetails.description}</p>
                <p><strong>Início:</strong> {moment(eventDetails.start).format('DD/MM/YYYY HH:mm')}</p>
                <p><strong>Fim:</strong> {moment(eventDetails.end).format('DD/MM/YYYY HH:mm')}</p>
                <p><strong>Prioridade:</strong> {eventDetails.priority}</p>
                <p><strong>Craidor Por:</strong> {eventDetails.createdBy.nome}</p>
                <div>
                <img
                    src={eventDetails.createdBy.imgProfile}
                    style={{width: '80px', heigth: '80px', borderRadius: '50%', objectFit: 'cover'}}
                /> 
                </div>
                
                

                <h5>Usuários Atribuídos:</h5>
                {eventDetails.assignedUsers.length === 0 ? (
                  <p>Nenhum usuário atribuído.</p>
                ) : (
                    eventDetails.assignedUsers.map((user) => (
                    <div key={user.userId}>
                      <img
                        src={user.imgProfile || avatar}
                        alt="User"
                        style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                      />
                      <span>{user.nome}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para criar evento */}
        <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Criar Evento</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Container defaultActiveKey="form">
              <Nav variant="tabs">
                <Nav.Item>
                  <Nav.Link eventKey="form">Informações do Evento</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="users">Selecionar Usuários</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="confirm">Confirmação</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content>
                {/* Aba 1: Formulário */}
                <Tab.Pane eventKey="form">
                  <Form>
                    <Form.Group>
                      <Form.Label>Título</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={eventData.title}
                        onChange={handleInputChange}
                        placeholder="Título do Evento"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Início</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="start"
                        value={eventData.start}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Fim</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="end"
                        value={eventData.end}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Descrição</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={eventData.description}
                        onChange={handleInputChange}
                        placeholder="Descrição do Evento"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Prioridade</Form.Label>
                      <Form.Control
                        as="select"
                        name="priority"
                        value={eventData.priority}
                        onChange={handleInputChange}
                      >
                        <option value="urgent">Urgente</option>
                        <option value="regular">Regular</option>
                        <option value="low">Baixa</option>
                      </Form.Control>
                    </Form.Group>
                  </Form>
                </Tab.Pane>

                {/* Aba 2: Seleção de Usuários */}
                <Tab.Pane eventKey="users">
                  <div>
                    {users.map((user) => (
                      <div key={user.id} onClick={() => toggleUserSelection(user)} style={{ cursor: 'pointer' }}>
                        <div style={{ marginBottom: '10px' }}>
                          <img
                            src={user.imgProfile || avatar}
                            alt="User"
                            style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                          />
                          <span>{user.nome}</span>
                          {selectedUsers.some((u) => u.id === user.id) && <span> (Selecionado)</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </Tab.Pane>

                {/* Aba 3: Confirmação */}
                <Tab.Pane eventKey="confirm">
                  <Button variant="success" onClick={handleCreateEvent}>
                    Confirmar e Criar Evento
                  </Button>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Modal.Body>
        </Modal>

        {/* Calendário */}
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleEventClick} // Chama a função handleEventClick ao clicar em um evento
          messages={{
            today: 'Hoje',
            previous: 'Voltar',
            next: 'Próximo',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
          }}
        />
      </div>
    </div>
  );
}
