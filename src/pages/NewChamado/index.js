import { useState, useEffect, useContext } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { AuthenticateContext } from "../../contexts/authenticate";
import { dbFirebase } from "../../services/firebaseConnection";
import "./newchamado.css";

export default function NewChamado() {
  const [categories, setCategories] = useState([]);
  const [categorySelected, setCategorySelected] = useState(0);

  const [subcategories, setSubcategories] = useState([]);
  const [subcategorySelected, setSubcategorySelected] = useState(0);

  const [status, setStatus] = useState("aberto");
  const [prioridade, setPrioridade] = useState("baixa");
  const [complemento, setComplemento] = useState("");

  const [chamados, setChamados] = useState([]);
  const { user } = useContext(AuthenticateContext);

  // Carregar categorias
  useEffect(() => {
    async function loadCategories() {
      try {
        const snapshot = await dbFirebase.firestore().collection("category").get();
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          nome: doc.data().nome,
        }));
        setCategories(list);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        setCategories([]);
      }
    }
    loadCategories();
  }, []);

  // Carregar subcategorias
  useEffect(() => {
    async function loadSubcategories() {
      if (!categories.length) return;
      try {
        const categoryId = categories[categorySelected].id;
        const snapshot = await dbFirebase.firestore()
          .collection("category")
          .doc(categoryId)
          .collection("subcategories")
          .get();

        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          nome: doc.data().nome,
          users: doc.data().users || [],
        }));
        setSubcategories(list);
      } catch (error) {
        console.error("Erro ao carregar subcategorias:", error);
        setSubcategories([]);
      }
    }
    loadSubcategories();
  }, [categorySelected, categories]);

  // Carregar chamados
  useEffect(() => {
    async function loadChamados() {
      try {
        const snapshot = await dbFirebase.firestore().collection("chamados").get();
        const filteredChamados = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter(
            (chamado) =>
              chamado.criadoPor === user.uid || // Criado pelo usuário autenticado
              chamado.users?.some((u) => u.id === user.uid) // Usuário atribuído
          );
        setChamados(filteredChamados);
      } catch (error) {
        console.error("Erro ao carregar chamados:", error);
        setChamados([]);
      }
    }
    loadChamados();
  }, [user.uid]);

  // Criar novo chamado
  async function handleNewChamado(e) {
    e.preventDefault();
  
    try {
      // Obter o maior código atual
      const snapshot = await dbFirebase.firestore().collection("chamados").orderBy("codigo", "desc").limit(1).get();
      const lastChamado = snapshot.docs[0]?.data();
      const nextCodigo = lastChamado ? lastChamado.codigo + 1 : 1;
  
      const data = {
        created: new Date(),
        category: categories[categorySelected].nome,
        categoryId: categories[categorySelected].id,
        subcategory: subcategories[subcategorySelected]?.nome || "",
        subcategoryId: subcategories[subcategorySelected]?.id || "",
        status,
        prioridade,
        complemento,
        criadoPor: user.uid,
        users: subcategories[subcategorySelected]?.users || [],
        codigo: nextCodigo, // Adiciona o campo código
      };
  
      await dbFirebase.firestore().collection("chamados").add(data);
      toast.success("Chamado criado com sucesso!");
      setComplemento("");
    } catch (error) {
      console.error("Erro ao criar chamado:", error);
      toast.error("Erro ao criar chamado.");
    }
  }
  

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Novo Chamado">
          <FiPlusCircle size={24} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleNewChamado}>
            <label>Categoria</label>
            <select value={categorySelected} onChange={(e) => setCategorySelected(Number(e.target.value))}>
              {categories.length ? (
                categories.map((cat, index) => (
                  <option key={cat.id} value={index}>
                    {cat.nome}
                  </option>
                ))
              ) : (
                <option>Carregando...</option>
              )}
            </select>

            <label>Subcategoria</label>
            <select value={subcategorySelected} onChange={(e) => setSubcategorySelected(Number(e.target.value))}>
              {subcategories.length ? (
                subcategories.map((subcat, index) => (
                  <option key={subcat.id} value={index}>
                    {subcat.nome}
                  </option>
                ))
              ) : (
                <option>Nenhuma subcategoria encontrada</option>
              )}
            </select>

            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="aberto">Aberto</option>
              <option value="atendimento">Em Atendimento</option>
              <option value="finalizado">Finalizado</option>
            </select>

            <label>Prioridade</label>
            <div className="status">
              <input
                name="prioridade"
                type="radio"
                value="baixa"
                onChange={(e) => setPrioridade(e.target.value)}
                checked={prioridade === "baixa"}
              />
              <span>Baixa</span>
              <input
                name="prioridade"
                type="radio"
                value="media"
                onChange={(e) => setPrioridade(e.target.value)}
                checked={prioridade === "media"}
              />
              <span>Média</span>
              <input
                name="prioridade"
                type="radio"
                value="alta"
                onChange={(e) => setPrioridade(e.target.value)}
                checked={prioridade === "alta"}
              />
              <span>Alta</span>
            </div>

            <label>Complemento</label>
            <textarea
              placeholder="Descreva em detalhes a ajuda que precisa"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />

            <button type="submit">Criar Chamado</button>
          </form>

          <div className="chamados-list">
            <h3>Meus Chamados</h3>
            <ul>
              {chamados.length ? (
                chamados.map((chamado) => (
                  <li key={chamado.id}>
                    <strong>{chamado.category} - {chamado.subcategory}</strong>
                    <p>{chamado.complemento}</p>
                  </li>
                ))
              ) : (
                <li>Nenhum chamado encontrado.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
