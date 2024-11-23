import { useState, useEffect, useContext } from "react";
import { Table, Pagination } from "react-bootstrap"; // Componentes do Bootstrap
import { toast } from "react-toastify";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiPlusCircle } from "react-icons/fi"; // Botão existente
import { AuthenticateContext } from "../../contexts/authenticate";
import { dbFirebase } from "../../services/firebaseConnection";
import "./dashboard.css";

export default function Dashboard() {
  const [chamados, setChamados] = useState([]);
  const [filteredChamados, setFilteredChamados] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Quantidade de chamados por página
  const { user } = useContext(AuthenticateContext);

  // Carregar chamados com filtro e ordenar por data decrescente
  useEffect(() => {
    async function loadChamados() {
      try {
        const snapshot = await dbFirebase.firestore().collection("chamados").orderBy("created", "desc").get(); // Ordenação decrescente
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

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Chamados">
          <FiPlusCircle size={24} color="#754FFE" />
        </Title>

        <div className="btn-container">
          <button className="new-btn"> NOVO CHAMADO</button>
          <button className="close-btn"> CHAMADOS RESOLVIDOS</button>
        </div>

        <div className="container">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Código</th>
                <th>Categoria</th>
                <th>Subcategoria</th>
                <th>Status</th>
                <th>Prioridade</th>
                <th>Complemento</th>
              </tr>
            </thead>
            <tbody>
              {filteredChamados.length ? (
                filteredChamados.map((chamado) => (
                  <tr key={chamado.id}>
                    <td>{chamado.codigo}</td>
                    <td>{chamado.category}</td>
                    <td>{chamado.subcategory}</td>
                    <td>{chamado.status}</td>
                    <td>{chamado.prioridade}</td>
                    <td>{chamado.complemento}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">Nenhum chamado encontrado.</td>
                </tr>
              )}
            </tbody>
          </Table>

          <Pagination>
            {[...Array(Math.ceil(chamados.length / itemsPerPage)).keys()].map((number) => (
              <Pagination.Item
                key={number + 1}
                active={number + 1 === currentPage}
                onClick={() => handlePageChange(number + 1)}
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
