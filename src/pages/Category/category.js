import React, { useState } from 'react';
import { Button, Form, Row, Col, Accordion } from 'react-bootstrap';
import { TbCategoryPlus } from 'react-icons/tb';
import './category.css';

const CategoryAccordion = () => {
  // Estados para categorias, subcategorias e edição
  const [categories, setCategories] = useState([
    { id: 1, nome: 'Categoria 1', subcategories: [] },
    { id: 2, nome: 'Categoria 2', subcategories: [] },
  ]);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);

  // Lista de usuários
  const [users, setUsers] = useState([
    { id: 1, nome: 'Usuário 1' },
    { id: 2, nome: 'Usuário 2' },
    { id: 3, nome: 'Usuário 3' },
    { id: 4, nome: 'Usuário 4' },
    { id: 5, nome: 'Usuário 5' },
  ]);

  // Função para adicionar categoria
  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') {
      alert('Por favor, insira o nome da categoria');
      return;
    }

    const newCategory = {
      id: categories.length + 1,
      nome: newCategoryName,
      subcategories: [],
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName('');
  };

  // Função para adicionar subcategoria
  const handleAddSubcategory = () => {
    if (newSubcategoryName.trim() === '' || selectedCategoryId === null) {
      alert('Por favor, selecione uma categoria e insira o nome da subcategoria');
      return;
    }

    const updatedCategories = categories.map(category => {
      if (category.id === selectedCategoryId) {
        category.subcategories.push({
          id: category.subcategories.length + 1,
          nome: newSubcategoryName,
          assignedUsers: [], // Lista de usuários atribuídos
        });
      }
      return category;
    });

    setCategories(updatedCategories);
    setNewSubcategoryName('');
  };

  // Função para atribuir usuários à subcategoria
  const handleAssignUsersToSubcategory = () => {
    if (selectedSubcategoryId && assignedUsers.length === 0) {
      alert('Por favor, selecione ao menos um usuário');
      return;
    }

    const updatedCategories = categories.map(category => {
      category.subcategories = category.subcategories.map(subcategory => {
        if (subcategory.id === selectedSubcategoryId) {
          // Adiciona os usuários à subcategoria
          subcategory.assignedUsers = [
            ...subcategory.assignedUsers,
            ...assignedUsers
          ];
        }
        return subcategory;
      });
      return category;
    });

    setCategories(updatedCategories);
    setAssignedUsers([]); // Limpa a lista de usuários selecionados
  };

  // Função para remover usuário da subcategoria
  const handleRemoveUserFromSubcategory = (userId) => {
    const updatedCategories = categories.map(category => {
      category.subcategories = category.subcategories.map(subcategory => {
        if (subcategory.id === selectedSubcategoryId) {
          // Remove o usuário da lista de atribuídos
          subcategory.assignedUsers = subcategory.assignedUsers.filter(id => id !== userId);
        }
        return subcategory;
      });
      return category;
    });

    setCategories(updatedCategories);
  };

  return (
    <div>
      <div className="content">
        <h1>Categorias</h1>
        <Button variant="primary" onClick={() => handleAddCategory()}>
          Adicionar Categoria <TbCategoryPlus size={24} />
        </Button>
        <Row className="mt-3">
          <Col md={4}>
            {/* Adicionar uma categoria */}
            <Form.Group controlId="categoryName">
              <Form.Label>Nome da Nova Categoria</Form.Label>
              <Form.Control
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Digite o nome da categoria"
              />
            </Form.Group>
            <Button variant="success" onClick={handleAddCategory}>Salvar Categoria</Button>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={4}>
            {/* Adicionar uma subcategoria */}
            <Form.Group controlId="selectCategory">
              <Form.Label>Selecione uma Categoria</Form.Label>
              <Form.Select
                value={selectedCategoryId || ''}
                onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
              >
                <option value="">Escolha uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nome}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="subcategoryName">
              <Form.Label>Nome da Subcategoria</Form.Label>
              <Form.Control
                type="text"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                placeholder="Digite o nome da subcategoria"
              />
            </Form.Group>
            <Button variant="success" onClick={handleAddSubcategory}>Salvar Subcategoria</Button>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={4}>
            {/* Atribuir um ou mais usuários */}
            <Form.Group controlId="selectCategoryToAssign">
              <Form.Label>Selecione uma Categoria</Form.Label>
              <Form.Select
                value={selectedCategoryId || ''}
                onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
              >
                <option value="">Escolha uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nome}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="selectSubcategoryToAssign">
              <Form.Label>Selecione a Subcategoria</Form.Label>
              <Form.Select
                value={selectedSubcategoryId || ''}
                onChange={(e) => setSelectedSubcategoryId(Number(e.target.value))}
                disabled={!selectedCategoryId}
              >
                <option value="">Escolha uma subcategoria</option>
                {selectedCategoryId &&
                  categories
                    .find(category => category.id === selectedCategoryId)
                    .subcategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.nome}
                      </option>
                    ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="selectUsersToAssign">
              <Form.Label>Selecione os Usuários</Form.Label>
              {/* Select com múltiplos usuários */}
              <Form.Select
                multiple
                value={assignedUsers}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
                  setAssignedUsers(selectedOptions);
                }}
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nome}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button variant="success" onClick={handleAssignUsersToSubcategory}>
              Atribuir Usuários
            </Button>
          </Col>
        </Row>

        {/* Listagem de categorias e suas subcategorias */}
        <Accordion className="mt-3">
          {categories.map((category) => (
            <Accordion.Item key={category.id} eventKey={category.id.toString()}>
              <Accordion.Header>{category.nome}</Accordion.Header>
              <Accordion.Body>
                <Button variant="warning" onClick={() => alert('Editar Categoria')}>
                  Editar Categoria
                </Button>
                <Button variant="danger" onClick={() => alert('Excluir Categoria')}>
                  Excluir Categoria
                </Button>
                <ul>
                  {category.subcategories.map((sub) => (
                    <li key={sub.id}>
                      {/* Exibição de subcategoria */}
                      {sub.nome}
                      {sub.assignedUsers.length > 0 ? (
                        <span> - Atribuídos: 
                          {sub.assignedUsers.map(userId => users.find(user => user.id === userId)?.nome).join(', ')}
                          <ul>
                            {sub.assignedUsers.map(userId => (
                              <li key={userId}>
                                {users.find(user => user.id === userId)?.nome} 
                                <Button 
                                  variant="danger" 
                                  size="sm" 
                                  onClick={() => handleRemoveUserFromSubcategory(userId)}
                                >
                                  Remover
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </span>
                      ) : (
                        <span> - Nenhum usuário atribuído</span>
                      )}
                    </li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default CategoryAccordion;
