import React, { useState } from 'react';
import { Button, Form, Row, Col, Accordion } from 'react-bootstrap';
import { TbCategoryPlus } from 'react-icons/tb';
import { addCategory, addSubcategory, assignUserToSubcategory, editCategory, editSubcategory, deleteCategory, deleteSubcategory, removeUserFromSubcategory, useCategoriesAndSubcategories } from '../../useCase/firebaseServicesCategory';

import Title from "../../components/Title";
import Spinner from '../../components/Spinner'

import Header from "../../components/Header";

import './category.css';

const CategoryAccordion = () => {
  // Estados para categorias, subcategorias e edição
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);

  const { categories, users, loading } = useCategoriesAndSubcategories(); // Hook que busca as categorias e subcategorias

  // Função para adicionar categoria
  const handleAddCategoryFireBase = async () => {
    if (newCategoryName.trim() === '') {
      alert('Por favor, insira o nome da categoria');
      return;
    }
    await addCategory(newCategoryName);
    setNewCategoryName('');
  };

  // Função para adicionar subcategoria
  const handleAddSubcategoryFireBase = async () => {
    if (newSubcategoryName.trim() === '' || selectedCategoryId === '') {
      alert('Por favor, selecione uma categoria e insira o nome da subcategoria');
      return;
    }
    await addSubcategory(selectedCategoryId, newSubcategoryName);
    setNewSubcategoryName('');
  };

  // Função para atribuir usuários à subcategoria
  const handleAssignUsersToSubcategoryFireBase = async () => {
    if (!selectedCategoryId || !selectedSubcategoryId || assignedUsers.length === 0) {
      alert('Por favor, selecione uma categoria, subcategoria e pelo menos um usuário');
      return;
    }

    const adminUsers = users.filter(user => user.role === 'admin');

    if (adminUsers.length === 0) {
      alert('Não há usuários com o role de admin disponíveis para atribuição.');
      return;
    }

    try {
      for (const userId of assignedUsers) {
        const user = adminUsers.find(u => u.id === userId);
        if (user) {
          await assignUserToSubcategory(selectedCategoryId, selectedSubcategoryId, user.id, user.nome);
        }
      }
      alert('Usuários atribuídos com sucesso!');
    } catch (error) {
      console.error('Erro ao atribuir usuários à subcategoria:', error);
      alert('Erro ao atribuir usuários à subcategoria');
    }
  };

  // Função para editar categoria
  const handleEditCategoryFireBase = async (categoryId) => {
    const newName = prompt('Digite o novo nome da categoria:');
    if (newName) {
      await editCategory(categoryId, newName);
    }
  };

  // Função para editar subcategoria
  const handleEditSubcategoryFireBase = async (categoryId, subcategoryId) => {
    const newName = prompt('Digite o novo nome da subcategoria:');
    if (newName) {
      await editSubcategory(categoryId, subcategoryId, newName);
    }
  };

  // Função para excluir categoria
  const handleDeleteCategoryFireBase = async (categoryId) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      await deleteCategory(categoryId);
    }
  };

  // Função para excluir subcategoria
  const handleDeleteSubcategoryFireBase = async (categoryId, subcategoryId) => {
    if (window.confirm('Tem certeza que deseja excluir esta subcategoria?')) {
      await deleteSubcategory(categoryId, subcategoryId);
    }
  };

  const handleRemoveUserFromSubcategoryFireBase = async (categoryId, subcategoryId, userId) => {
    try {
      await removeUserFromSubcategory(categoryId, subcategoryId, userId);
      alert('Usuário removido da subcategoria com sucesso!');
    } catch (error) {
      console.error('Erro ao remover usuário da subcategoria:', error);
      alert('Erro ao remover usuário da subcategoria');
    }
  };
  

  if (loading) {
    return <div><Spinner/></div>;
  }

  return (
    <div>
        <Header />

      <div className="content">
      <Title name="Categorias">
          <TbCategoryPlus size={24} />
        </Title>
        <Row className="mt-3">
          <Col md={4}>
            <Form.Group controlId="categoryName">
              <Form.Label>Nome da Nova Categoria</Form.Label>
              <Form.Control
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Digite o nome da categoria"
              />
            </Form.Group>
            <Button variant="success" onClick={handleAddCategoryFireBase}>Salvar Categoria</Button>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={4}>
            <Form.Group controlId="selectCategory">
              <Form.Label>Selecione uma Categoria</Form.Label>
              <Form.Select
                value={selectedCategoryId || ''}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
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
            <Button variant="success" onClick={handleAddSubcategoryFireBase}>Salvar Subcategoria</Button>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={4}>
            <Form.Group controlId="selectCategoryToAssign">
              <Form.Label>Selecione uma Categoria</Form.Label>
              <Form.Select
                value={selectedCategoryId || ''}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
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
                onChange={(e) => setSelectedSubcategoryId(e.target.value)}
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
              <Form.Select
                multiple
                value={assignedUsers}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
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

            <Button variant="success" onClick={handleAssignUsersToSubcategoryFireBase}>
              Atribuir Usuários
            </Button>
          </Col>
        </Row>

        <h1>Categorias e Subcategorias</h1>
        <Accordion className="mt-3">
          {categories.map((category) => (
            <Accordion.Item key={category.id} eventKey={category.id.toString()}>
              <Accordion.Header>{category.nome}</Accordion.Header>
              <Accordion.Body>
                <Button variant="warning" onClick={() => handleEditCategoryFireBase(category.id)}>Editar Categoria</Button>
                <Button variant="danger" onClick={() => handleDeleteCategoryFireBase(category.id)}>Excluir Categoria</Button>

                <ul>
                {category.subcategories && category.subcategories.length > 0 ? (
                  category.subcategories.map((sub) => (
                    <li key={sub.id}>
                      <strong>{sub.nome}</strong>
                       {/* Botões de Editar e Remover Subcategoria */}
                       <div className="mt-2">
                          <Button
                            variant="warning"
                            onClick={() => handleEditSubcategoryFireBase(category.id, sub.id)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="danger"
                            className="ml-2"
                            onClick={() => handleDeleteSubcategoryFireBase(category.id, sub.id)}
                          >
                            Excluir
                          </Button>
                        </div>
                      {sub.users && sub.users.length > 0 ? (
                        <ul>
                          {sub.users.map((user) => (
                            <li key={user.id}>
                              {user.nome}
                              <Button 
                                variant="danger" 
                                onClick={() => handleRemoveUserFromSubcategoryFireBase(category.id, sub.id, user.id)}
                              >
                                Remover Usuário
                              </Button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>Nenhum usuário atribuído</p>
                      )}
                    </li>
                  ))
                ) : (
                  <li>Nenhuma subcategoria encontrada.</li>
                )}

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
