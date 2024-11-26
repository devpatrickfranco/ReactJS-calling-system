import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { Table, Pagination, Modal, Button } from "react-bootstrap"; // Componentes do Bootstrap
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { FiPlusCircle } from "react-icons/fi"; // Botão existente

import Header from "../../components/Header";
import Title from "../../components/Title";
import { AuthenticateContext } from "../../contexts/authenticate";
import { dbFirebase } from "../../services/firebaseConnection";
import avatar from '../../assets/avatar.jpg';

import "./dashboard.css";

export default function Dashboard() {
  const [chamados, setChamados] = useState([]);
  const [filteredChamados, setFilteredChamados] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Quantidade de chamados por página
  const [showModalSearch, setShowModalSearch] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedChamado, setSelectedChamado] = useState(null); // Estado para armazenar o chamado selecionado
  const [userProfiles, setUserProfiles] = useState({}); // Estado para armazenar imagens de perfil
  const { hasPermission, user } = useContext(AuthenticateContext); // Dados do usuário autenticado

  const navigate = useNavigate();

  // Carregar a imagem de perfil do usuário
  useEffect(() => {
    async function loadUserProfile() {
      try {
        const userProfileDoc = await dbFirebase.firestore()
          .collection('users')
          .doc(user.uid)
          .get();

        if (userProfileDoc.exists) {
          const userData = userProfileDoc.data();
          setUserProfiles((prevProfiles) => ({
            ...prevProfiles,
            [user.uid]: userData.imgProfile || avatar, // Se imgProfile for null, usa o avatar
          }));
        }
      } catch (error) {
        console.error("Erro ao carregar o perfil do usuário:", error);
        toast.error("Erro ao carregar o perfil do usuário.");
      }
    }

    loadUserProfile();
  }, [user.uid]);

  // Carregar chamados com filtro e ordenar por data decrescente
  useEffect(() => {
    async function loadChamados() {
      try {
        const snapshot = await dbFirebase.firestore().collection("chamados").orderBy("created", "desc").get();
        const list = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter(
            (chamado) =>
              chamado.criadoPor === user.uid || // Criado pelo usuário autenticado
              chamado.users?.some((u) => u.id === user.uid) // Usuário autorizado
          );

        setChamados(list);
      } catch (error) {
        console.error("Erro ao carregar chamados:", error);
        toast.error("Erro ao carregar chamados.");
      }
    }
    loadChamados();
  }, [user.uid]);

  // Atualizar chamados filtrados para a página atual
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredChamados(chamados.slice(startIndex, endIndex));
  }, [currentPage, chamados]);

  // Mudar página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleOpenModalSearch = (chamado) => {
    setSelectedChamado(chamado); // Armazena o chamado selecionado
    setShowModalSearch(true); // Abre o modal de pesquisa
  };

  const handleEditChamado = (id) => {
    navigate(`/new/${id}`); // Redireciona para a página de edição com o ID
  };

  // Função para iniciar o atendimento
  const startAtendimento = async (chamadoId) => {
    try {
      // Atualiza o status para 'Atendimento' e adiciona o atendente
      await dbFirebase.firestore().collection('chamados').doc(chamadoId).update({
        status: 'Atendimento',
        atendidoPor: user.uid, // Adiciona o ID do usuário que iniciou o atendimento
      });

      // Atualiza o chamado na tabela local
      setChamados((prevChamados) =>
        prevChamados.map((chamado) =>
          chamado.id === chamadoId
            ? { ...chamado, status: 'Atendimento', atendidoPor: user.uid }
            : chamado
        )
      );

      // Exibe a imagem do atendente (a partir do userProfiles)
      setUserProfiles((prevProfiles) => ({
        ...prevProfiles,
        [user.uid]: user.imgProfile || avatar,
      }));

      toast.success("Atendimento iniciado com sucesso!");
    } catch (error) {
      console.error("Erro ao iniciar atendimento:", error);
      toast.error("Erro ao iniciar atendimento.");
    }
  };


  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Chamados">
          <FiPlusCircle size={24} color="#754FFE" />
        </Title>

        <div className="btn-container">
          <button className="new-btn" onClick={() => navigate('/new')}> NOVO CHAMADO</button>
          <button className="close-btn" onClick={() => navigate('/resolved')}> CHAMADOS RESOLVIDOS</button>
        </div>

        <div className="container table-container">
          <Table className="table" hover>
            <thead>
              <tr>
                <th>CÓDIGO</th>
                <th>CATEGORIA</th>
                <th>SUB</th>
                <th>SOLICITANTE</th>
                <th>PRIORIDADE</th>
                <th>STATUS</th>
                <th>ATENDENTE</th>
                <th>#</th>
              </tr>
            </thead>
            <tbody>
              {filteredChamados.length ? (
                filteredChamados.map((chamado) => (
                  <tr key={chamado.id}>
                    <td>{chamado.codigo}</td>
                    <td>{chamado.category}</td>
                    <td>{chamado.subcategory}</td>
                    <td>
                    <img 
                      src={userProfiles[chamado.criadoPor] || avatar} 
                      alt="Avatar" 
                      className="avatar" 
                    />
                    </td>
                    <td>
                      <span className={`prioridade-${chamado.prioridade.toLowerCase()}`}>
                        {chamado.prioridade}
                      </span>
                    </td>
                    <td>
                      <span className={`status-${chamado.status.toLowerCase()}`}>
                        {chamado.status}
                      </span>
                    </td>
                    <td>
                        {chamado.atendidoPor ? (
                          <img
                            src={userProfiles[chamado.atendidoPor] || avatar} // Exibe a imagem do atendente ou o avatar padrão
                            alt="Atendente"
                            className="avatar"
                            style={{ width: 40, height: 40, borderRadius: '50%' }}
                          />
                        ) : (
                          <span>Nenhum atendente</span> // Se não tiver atendente, exibe um texto informando
                        )}
                      </td>
                    <td>
                      <span
                        className="icon-wrapper"
                        onClick={() => handleOpenModalSearch(chamado)}
                      >
                        <FaSearch />
                      </span>
                      <span
                        className="icon-wrapper"
                        onClick={() => handleEditChamado(chamado.id)}
                      >
                        <CiEdit />
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">Nenhum chamado encontrado.</td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Modal de pesquisa */}
          <Modal size={'lg'} show={showModalSearch} onHide={() => setShowModalSearch(false)}>
            <Modal.Header closeButton>
              <Modal.Title>CHAMADO # {selectedChamado?.codigo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="modal-body-container">
                {/* Coluna 1 - Criado Por e Avatar */}
                <div className="modal-column column-1">
                  <div className="modal-item">
                    <h5 className="modal-title">Criado Por:</h5>
                  </div>
                  <div className="modal-item">
                    <img src={userProfiles[selectedChamado?.criadoPor] || avatar} alt="Avatar" className="avatar" />
                  </div>
                </div>

                {/* Coluna 2 - Categoria, Subcategoria e Aberto em */}
                <div className="modal-column column-2">
                  <div className="modal-item">
                    <h5 className="modal-title">Categoria:</h5>
                    <p className="modal-info">{selectedChamado?.category}</p>
                  </div>
                  <div className="modal-item">
                    <h5 className="modal-title">Sub:</h5>
                    <p className="modal-info">{selectedChamado?.subcategory}</p>
                  </div>
                  <div className="modal-item">
                    <h5 className="modal-title">Aberto em:</h5>
                    <p className="modal-info">
                      {new Date(selectedChamado?.created?.seconds * 1000).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Coluna 3 - Prioridade e Status */}
                <div className="modal-column column-3">
                  <div className="modal-item">
                    <span className={`priority-${selectedChamado?.prioridade.toLowerCase()}`}>
                      {selectedChamado?.prioridade}
                    </span>
                  </div>
                  <div className="modal-item">
                    <span className={`status-${selectedChamado?.status.toLowerCase()}`}>
                      {selectedChamado?.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-item">
                <h5 className="modal-title">Descrição:</h5>
                <p className="modal-info description" dangerouslySetInnerHTML={{ __html: selectedChamado?.complemento }} />
              </div>
            </Modal.Body>

            <Modal.Footer>

            {user && hasPermission(user, 'admin', 'superAdmin') && (
              <Button
                variant="primary"
                onClick={async () => {
                  await startAtendimento(selectedChamado.id);
                }}
              >
                Iniciar Atendimento
              </Button>
            )}

              <Button variant="secondary" onClick={() => setShowModalSearch(false)}>
                Fechar
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Paginação */}
          <Pagination>
            {[...Array(Math.ceil(chamados.length / itemsPerPage)).keys()].map((number) => (
              <Pagination.Item
                key={number + 1}
                active={number + 1 === currentPage}
                onClick={() => handlePageChange(number + 1)}
                style={{ color: '#754FFE' }}
              >
                {number + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      </div>
    </div>
  );
}
