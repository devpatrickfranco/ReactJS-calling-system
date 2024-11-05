import { useState, useEffect } from 'react';
import { Accordion, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { TbCategoryPlus } from "react-icons/tb";
import { toast } from 'react-toastify'

import Spinners from '../../components/Spinner';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { dbFirebase } from '../../services/firebaseConnection';

import './category.css';

const CategoryAccordion = () => {
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [showAddSubcategory, setShowAddSubcategory] = useState(false);
    const [showEditCategory, setShowEditCategory] = useState(false);
    const [showAssignCategory, setShowAssignCategory] = useState(false);
    const [showDeleteResponsible, setShowDeleteResponsible] = useState(false)
    
    const [editType, setEditType] = useState(null); // 'category' ou 'subcategory'
    const [selectedItem, setSelectedItem] = useState('');
    const [itemName, setItemName] = useState('');
    
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    
    const [categoryName, setCategoryName] = useState('');
    const handleNameChange = (e) => setCategoryName(e.target.value);
    
    const [categoriesEdit, setCategoriesEdit] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    
    // Adicionando os estados faltantes
    const [subcategoriesArray, setSubcategoriesArray] = useState([]); // Array para armazenar subcategorias 
    const [subcategoryName, setSubcategoryName] = useState('');
    
    const [users, setUsers] = useState([]);
    const [usersModal, setUsersModal] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [subcategories, setSubcategories] = useState([]);

    const [responsibles, setResponsibles] = useState([]);
    const [selectedResponsible, setSelectedResponsible] = useState('');
// Função para buscar categorias e suas subcategorias do Firestore
const fetchCategories = async () => {
    try {
        const snapshot = await dbFirebase.firestore().collection('categorys').get();
        const fetchedCategories = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setCategories(fetchedCategories);
        setCategoriesEdit(fetchedCategories);
    } catch (error) {
        console.error("Erro ao buscar categorias: ", error);
    }
};

  // Função para carregar os dados de responsáveis
  const fetchSubcategoriesWithUsers = async () => {
    try {
        const updatedSubcategories = await Promise.all(
            categories.map(async (category) => {
                const subcategoryData = await Promise.all(
                    category.subcategories.map(async (sub) => {
                        const subcategoryDoc = await dbFirebase.firestore()
                            .collection('categorys')
                            .doc(category.id)
                            .collection('subcategories')
                            .doc(sub.id)
                            .get();
                        
                        if (subcategoryDoc.exists) {
                            const subcategory = subcategoryDoc.data();
                            return {
                                ...sub,
                                responsible: subcategory.responsible || []
                            };
                        } else {
                            return { ...sub, responsible: [] };
                        }
                    })
                );
                return { ...category, subcategories: subcategoryData };
            })
        );
        setSubcategories(updatedSubcategories);
    } catch (error) {
        console.error('Erro ao carregar subcategorias:', error);
    }
};

useEffect(() => {
    fetchSubcategoriesWithUsers();
}, [categories]);

  useEffect(() => {
    async function loadCategories() {
        try {
            const snapshot = await dbFirebase.firestore().collection('categorys').get();
            const categoriesList = [];

            for (const doc of snapshot.docs) {
                const categoryData = doc.data();
                const category = {
                    id: doc.id,
                    nome: categoryData.nome,
                    subcategories: []
                };

                // Obtenha as subcategorias
                const subcategoriesSnapshot = await doc.ref.collection('subcategories').get();
                subcategoriesSnapshot.forEach(subDoc => {
                    const subcategoryData = subDoc.data();
                    category.subcategories.push({ id: subDoc.id, nome: subcategoryData.nome });
                });

                categoriesList.push(category);
            }

            setCategories(categoriesList);
            setLoadingCategories(false);
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            setLoadingCategories(false);
        }
    }
    loadCategories();


    fetchCategories();

}, []);

  // Carrega as categorias e usuários (apenas admins) ao montar o componente
  useEffect(() => {
    async function loadCategoriesAndUsers() {
        try {
            // Carregar categorias
            const categorySnapshot = await dbFirebase.firestore().collection('categorys').get();
            const loadedCategories = categorySnapshot.docs.map(doc => ({
                id: doc.id,
                nome: doc.data().nome
            }));
            setCategories(loadedCategories);

            // Carregar usuários com role 'admin'
            const userSnapshot = await dbFirebase.firestore()
                .collection('users')
                .where('role', '==', 'admin')
                .get();

            const loadedUsers = userSnapshot.docs.map(doc => ({
                id: doc.id,
                nome: doc.data().nome
            }));
            setUsers(loadedUsers);

        } catch (error) {
            console.error('Erro ao carregar categorias e usuários:', error);
            toast.error('Erro ao carregar categorias e usuários');
        }
    }

    loadCategoriesAndUsers();
}, []);

// Carrega subcategorias quando uma categoria é selecionada
useEffect(() => {
    if (selectedCategory) {
        async function loadSubcategories() {
            const subcategorySnapshot = await dbFirebase.firestore()
                .collection('categorys')
                .doc(selectedCategory)
                .collection('subcategories')
                .get();

            const loadedSubcategories = subcategorySnapshot.docs.map(doc => ({
                id: doc.id,
                nome: doc.data().nome
            }));
            setSubcategories(loadedSubcategories);
            setSelectedSubcategory(''); // Limpar a subcategoria selecionada ao alterar a categoria
        }

        loadSubcategories();
    } else {
        setSubcategories([]); // Limpar subcategorias quando não há categoria selecionada
    }
}, [selectedCategory]);
  

     // Carrega os usuários com papel de 'admin' ou 'superAdmin'
     useEffect(() => {
        async function loadUsers() {
            try {
                const snapshot = await dbFirebase.firestore()
                    .collection('users')
                    .where('role', 'in', ['admin', 'superAdmin'])
                    .get();

                const userList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(userList);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
                toast.error('Erro ao carregar usuários');
            }
        }

        loadUsers();
    }, []);

    // Carrega os `responsibles` do usuário selecionado
    useEffect(() => {
        if (selectedUser) {
            async function loadResponsibles() {
                try {
                    const userDoc = await dbFirebase.firestore().collection('users').doc(selectedUser).get();
                    const userResponsibles = userDoc.data()?.responsible || [];
                    setResponsibles(userResponsibles);
                } catch (error) {
                    console.error('Erro ao buscar responsáveis:', error);
                    toast.error('Erro ao carregar responsáveis');
                }
            }

            loadResponsibles();
        } else {
            setResponsibles([]);
        }
    }, [selectedUser]);

    if (loadingCategories) {
    return  <div>
               <Spinners/>
            </div>; // Loader ou mensagem de carregamento
  }


// Fecha o modal e limpa os dados
const handleClose = () => {
    setShowAddCategory(false)
    setShowAddSubcategory(false)
    setShowEditCategory(false);
    setShowAssignCategory(false)
    setShowDeleteResponsible(false)
    setEditType(null);
    setSelectedItem('');
    setItemName('');
    setSubcategoriesArray([]);
    setSelectedCategory('');
};


    // Atualiza o nome ao selecionar um item
    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedItem(selectedValue);
        setItemName(selectedValue);
      };

      
    async function createNewCategory() {
        try {
            const categoryRef = dbFirebase.firestore().collection('categorys');
            await categoryRef.add({
                nome: categoryName,
                createdAt: new Date(),
            });
            console.log('Categoria criada com sucesso!');
            handleClose(); // Fecha o modal após criar a categoria
            setCategoryName(''); // Limpa o campo após salvar
            window.location.reload()
            toast.success('Categoria Criada Com Sucesso!')
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            toast.error('Erro Ao Criar Categoria!')
        }
    }

    async function createNewSubcategory() {
        if (!selectedCategory || !subcategoryName) return;

        try {
            const categoryRef = dbFirebase.firestore().collection('categorys').doc(selectedCategory);
            await categoryRef.collection('subcategories').add({
                nome: subcategoryName,
                createdAt: new Date(),
            });
            console.log('Subcategoria criada com sucesso!');
            window.location.reload()
            toast.success('Categoria Criada Com Sucesso!')
            handleClose(); // Fecha o modal após criar a subcategoria
            setSelectedCategory('');
            setSubcategoryName('');
        } catch (error) {
            console.error('Erro ao adicionar subcategoria:', error);
            toast.error('Erro Ao Criar Categoria!')
        }
    }

    // Manipula a seleção de categoria para carregar subcategorias
    const handleCategoryChange = async (e) => {
        const selectedCategoryId = e.target.value;
        setSelectedCategory(selectedCategoryId);

        if (selectedCategoryId) {
            try {
                const subcategoriesSnapshot = await dbFirebase.firestore()
                    .collection('categorys')
                    .doc(selectedCategoryId)
                    .collection('subcategories')
                    .get();

                const fetchedSubcategories = subcategoriesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSubcategoriesArray(fetchedSubcategories);
                setSelectedItem('');
            } catch (error) {
                console.error("Erro ao buscar subcategorias: ", error);
            }
        } else {
            setSubcategoriesArray([]);
        }
    };

    // Manipula a seleção da subcategoria
    const handleSubcategoryChange = (e) => {
        const selectedSubcategoryId = e.target.value;
        const selectedSubcategory = subcategoriesArray.find(sub => sub.id === selectedSubcategoryId);
        setSelectedItem(selectedSubcategory);
        setItemName(selectedSubcategory ? selectedSubcategory.nome : '');
    };

    // Manipula a mudança do tipo de edição
    const handleEditTypeChange = (type) => {
        setEditType(type);
        setSelectedItem('');
        setItemName('');
        setSubcategoriesArray([]);
        setSelectedCategory('');
    };
    
    // Exclui o item (categoria ou subcategoria)
    const deleteItem = async () => {
        if (editType === 'category' && selectedItem) {
            try {
                await dbFirebase.firestore().collection('categorys').doc(selectedItem.id).delete();
                fetchCategories(); // Atualiza a lista de categorias após exclusão
                handleClose();
                window.location.reload()
                toast.success('Categoria Criada Com Sucesso!')
            } catch (error) {
                console.error("Erro ao excluir categoria: ", error);
                window.location.reload()
                toast.error('Erro ao Criar Categoria!')
            }
        } else if (editType === 'subcategory' && selectedItem && selectedCategory) {
            try {
                await dbFirebase.firestore()
                    .collection('categorys')
                    .doc(selectedCategory)
                    .collection('subcategories')
                    .doc(selectedItem.id)
                    .delete();
                fetchCategories(); // Atualiza a lista de categorias e subcategorias após exclusão
                handleClose();
                window.location.reload()
                toast.success('Subcategoria Criada Com Sucesso!')
            } catch (error) {
                console.error("Erro ao excluir subcategoria: ", error);
                window.location.reload()
                toast.error('Erro ao Criar Subategoria!')
            }
        }
    };

// Atualiza o item (categoria ou subcategoria)
const updateItem = async () => {
    if (editType === 'category' && selectedItem) {
        try {
            await dbFirebase.firestore().collection('categorys').doc(selectedItem.id).update({
                nome: itemName
            });
            fetchCategories(); // Atualiza a lista de categorias após edição
            handleClose();
            window.location.reload()
            toast.success('Categoria Editada com Sucesso')
        } catch (error) {
            toast.error('Erro ao atualizar categoria')
            console.error("Erro ao atualizar categoria: ", error);
        }
    } else if (editType === 'subcategory' && selectedItem && selectedCategory) {
        try {
            await dbFirebase.firestore()
                .collection('categorys')
                .doc(selectedCategory)
                .collection('subcategories')
                .doc(selectedItem.id)
                .update({
                    nome: itemName
                });
            fetchCategories(); // Atualiza a lista de categorias e subcategorias após edição
            handleClose();
            window.location.reload()
            toast.success('Subcategoria Editada com Sucesso')
        } catch (error) {
            window.location.reload()
            toast.error('Erro ao atualizar subcategoria')
            console.error("Erro ao atualizar subcategoria: ", error);
        }
    }
};

const handleAssign = async () => {
    if (!selectedCategory || !selectedUser || !selectedSubcategory) {
        toast.error('Por favor, selecione a categoria, subcategoria e o usuário.');
        return;
    }

    try {
        // Referência do usuário
        const userRef = dbFirebase.firestore().collection('users').doc(selectedUser);

        // Referência da subcategoria
        const subcategoryRef = dbFirebase.firestore()
            .collection('categorys') // Ajuste para a coleção 'categorys'
            .doc(selectedCategory)
            .collection('subcategories')
            .doc(selectedSubcategory);

        // Obter nome da subcategoria
        const subcategoryDoc = await subcategoryRef.get();

        if (!subcategoryDoc.exists) {
            toast.error('Subcategoria não encontrada.');
            return;
        }

        const subcategoryName = subcategoryDoc.data().nome;

        // Atualizar o campo 'responsible' do usuário
        await userRef.update({
            responsible: dbFirebase.firestore.FieldValue.arrayUnion({
                categoryId: selectedCategory,
                subcategoryId: selectedSubcategory,
                subcategoryName: subcategoryName // Adiciona o nome da subcategoria
            })
        });

        // Atualizar a subcategoria com o usuário atribuído
        await subcategoryRef.update({
            responsible: dbFirebase.firestore.FieldValue.arrayUnion({
                userId: selectedUser,
                userName: users.find(user => user.id === selectedUser)?.nome // Armazenando o nome do usuário
            })
        });

        // Fechar o modal e resetar o estado
        handleClose();
        setSelectedCategory('');
        setSelectedSubcategory('');
        setSelectedUser('');

        toast.success('Categoria atribuída com sucesso!');
    } catch (error) {
        console.error('Erro ao atribuir categoria:', error);
        toast.error('Erro ao atribuir categoria');
    }
};

// Função para excluir a categoria/subcategoria selecionada
const handleDeleteResponsible = async () => {
    if (!selectedUser || !selectedResponsible) {
        toast.error('Selecione um usuário e um responsável para excluir.');
        return;
    }

    try {
        const userRef = dbFirebase.firestore().collection('users').doc(selectedUser);

        // Extrair o objeto `responsible` com os campos completos para remoção
        const responsibleObj = JSON.parse(selectedResponsible);
        
        await userRef.update({
            responsible: dbFirebase.firestore.FieldValue.arrayRemove({
                categoryId: responsibleObj.categoryId,
                subcategoryId: responsibleObj.subcategoryId,
                subcategoryName: responsibleObj.subcategoryName
            })
        });

        toast.success('Responsável removido com sucesso!');
        setSelectedResponsible('');
        setResponsibles(responsibles.filter(r => r.subcategoryId !== responsibleObj.subcategoryId)); // Remove o item da lista local
    } catch (error) {
        console.error('Erro ao excluir responsável:', error);
        toast.error('Erro ao excluir responsável');
    }
};

const getUsersForSubcategory = (subcategoryId, users) => {
    const assignedUsers = users.filter(user =>
        user.subcategoryIds.includes(subcategoryId)
    );
    console.log('Assigned Users for subcategory', subcategoryId, assignedUsers);  // Verifique aqui
    return assignedUsers;
};

  return (
    <div>
        <Header />
        <div className='content'>
            <Title name={'Categorias'}>
            <TbCategoryPlus size={24} />
            </Title>
            <div className='background'>
            <Row>
                    <Accordion>
                        {subcategories.map((category, index) => (
                            <Col key={category.id} xs={12} md={4} className="mb-3">
                                <Accordion.Item eventKey={index.toString()}>
                                    <Accordion.Header>{category.nome}</Accordion.Header>
                                    <Accordion.Body>
                                        {category.subcategories.map((sub, subIndex) => {
                                            const assignedUsers = sub.responsible || [];
                                            return (
                                                <Accordion.Item eventKey={`${subIndex}`} key={sub.id}>
                                                    <Accordion.Header>{sub.nome}</Accordion.Header>
                                                    <Accordion.Body>
                                                        {assignedUsers.length > 0 ? (
                                                            assignedUsers.map((user, index) => (
                                                                <p key={index}>{user.userName}</p>
                                                            ))
                                                        ) : (
                                                            <p>Nenhum usuário atribuído</p>
                                                        )}
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            );
                                        })}
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Col>
                        ))}
                </Accordion>
            </Row>



            {/* Botões para Modais */}
            <div className="fixed-buttons">
                <Button variant="primary" onClick={() => setShowAddCategory(true)}>Adicionar Categoria</Button>
                <Button variant="primary" onClick={() => setShowAddSubcategory(true)}>Adicionar Subcategoria</Button>
                <Button variant="primary" onClick={() => setShowEditCategory(true)}>Editar Categoria</Button>
                <Button variant="primary" onClick={() => setShowAssignCategory(true)}>Atribuir Categoria a Usuário</Button>
                <Button variant="primary" onClick={() => setShowDeleteResponsible(true)}>Remover Categoria do Usuário</Button>
            </div>

            {/* MODAL PARA ADICIONAR UMA CATEGORIA */}
            <Modal show={showAddCategory} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Categoria</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group controlId="categoryName">
                            <Form.Label>Nome da Categoria</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nome da categoria"
                                value={categoryName}
                                onChange={handleNameChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Fechar</Button>
                    <Button variant="primary" onClick={createNewCategory}>Salvar</Button>
                </Modal.Footer>
            </Modal>

             {/* MODAL PARA ADICIONAR UMA SUB*/}
             <Modal show={showAddSubcategory} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Adicionar Subcategoria</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form.Group controlId="selectCategory" className="mb-3">
                    <Form.Label>Selecione uma Categoria</Form.Label>
                    <Form.Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="">Escolha uma categoria</option>
                        {categoriesEdit.map((category) => (
                            <option key={category.id} value={category.id}>{category.nome}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="subcategoryName" className="mb-3">
                    <Form.Label>Nome da Subcategoria</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Digite o nome da subcategoria"
                        value={subcategoryName}
                        onChange={(e) => setSubcategoryName(e.target.value)}
                    />
                </Form.Group>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
                <Button variant="primary" onClick={createNewSubcategory}>Adicionar</Button>
            </Modal.Footer>
        </Modal>




{/* MODAL PARA EDITAR UMA CATEGORIA OU SUBCATEGORIA */}
 <Modal show={showEditCategory} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar {editType === 'category' ? 'Categoria' : 'Subcategoria'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-between mb-3">
                    <Button
                        variant={editType === 'category' ? 'primary' : 'outline-primary'}
                        onClick={() => handleEditTypeChange('category')}
                    >
                        Categoria
                    </Button>
                    <Button
                        variant={editType === 'subcategory' ? 'primary' : 'outline-primary'}
                        onClick={() => handleEditTypeChange('subcategory')}
                    >
                        Subcategoria
                    </Button>
                </div>

                {editType === 'category' && (
                    <Form.Group controlId="selectCategory" className="mb-3">
                        <Form.Label>Selecione a Categoria</Form.Label>
                        <Form.Select
                            value={selectedItem ? selectedItem.id : ''}
                            onChange={(e) => {
                                const category = categoriesEdit.find(cat => cat.id === e.target.value);
                                setSelectedItem(category);
                                setItemName(category ? category.nome : '');
                            }}
                        >
                            <option value="">Escolha uma categoria</option>
                            {categoriesEdit.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nome}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                )}

                {editType === 'subcategory' && (
                    <>
                        <Form.Group controlId="selectCategoryForSub" className="mb-3">
                            <Form.Label>Selecione a Categoria</Form.Label>
                            <Form.Select value={selectedCategory} onChange={handleCategoryChange}>
                                <option value="">Escolha uma categoria</option>
                                {categoriesEdit.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="selectSubcategory" className="mb-3">
                            <Form.Label>Selecione a Subcategoria</Form.Label>
                            <Form.Select value={selectedItem ? selectedItem.id : ''} onChange={handleSubcategoryChange}>
                                <option value="">Escolha uma subcategoria</option>
                                {subcategoriesArray.map(sub => (
                                    <option key={sub.id} value={sub.id}>{sub.nome}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </>
                )}

                <Form.Group controlId="editItemName" className="mb-3">
                    <Form.Label>Editar Nome</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Digite o novo nome"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                    />
                </Form.Group>

                <Button variant="danger" className="mt-3" onClick={deleteItem}>
                    Excluir {editType === 'category' ? 'Categoria' : 'Subcategoria'}
                </Button>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
                <Button variant="primary" onClick={updateItem}>Salvar Alterações</Button>
            </Modal.Footer>
        </Modal>

        {/* MODAL PARA ATRIBUIR SUBCATEGORIA A USUARIO*/}
        <Modal show={showAssignCategory} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Atribuir Categoria a Usuário</Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                <Form>
                    {/* Select para Categoria */}
                    <Form.Group className="mb-3" controlId="categorySelect">
                        <Form.Label>Selecione a Categoria</Form.Label>
                        <Form.Select 
                            value={selectedCategory} 
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">Escolha uma categoria</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.nome}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* Select para Subcategoria */}
                    <Form.Group className="mb-3" controlId="subcategorySelect">
                        <Form.Label>Selecione a Subcategoria</Form.Label>
                        <Form.Select 
                            value={selectedSubcategory} 
                            onChange={(e) => setSelectedSubcategory(e.target.value)}
                            disabled={!selectedCategory}
                        >
                            <option value="">Escolha uma subcategoria</option>
                            {subcategories.map(subcategory => (
                                <option key={subcategory.id} value={subcategory.id}>
                                    {subcategory.nome}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* Select para Usuário */}
                    <Form.Group className="mb-3" controlId="userSelect">
                        <Form.Label>Selecione o Usuário</Form.Label>
                        <Form.Select 
                            value={selectedUser} 
                            onChange={(e) => setSelectedUser(e.target.value)}
                        >
                            <option value="">Escolha um usuário</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.nome}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleAssign}>
                    Atribuir
                </Button>
            </Modal.Footer>
        </Modal>

        {/* MODAL PARA EXCLUIR UM RESPOSIBLE DO USUARIO*/}
        <Modal show={showDeleteResponsible} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Cargos do Usuário</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    {/* Select para selecionar o usuário */}
                    <Form.Group className="mb-3" controlId="userSelect">
                        <Form.Label>Selecione o Usuário</Form.Label>
                        <Form.Select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                        >
                            <option value="">Escolha um usuário</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.nome || user.email} {/* Nome ou email do usuário */}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* Select para selecionar o responsável (categoria/subcategoria) */}
                    <Form.Group className="mb-3" controlId="responsibleSelect">
                        <Form.Label>Selecione o Cargo</Form.Label>
                        <Form.Select
                            value={selectedResponsible}
                            onChange={(e) => setSelectedResponsible(e.target.value)}
                        >
                            <option value="">Escolha um responsável</option>
                            {responsibles.map((resp, index) => (
                                <option key={index} value={JSON.stringify(resp)}>
                                    {resp.subcategoryName ? `${resp.subcategoryName} (Subcategoria)` : `${resp.categoryId} (Categoria)`}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={handleDeleteResponsible}>
                    Excluir
                </Button>
            </Modal.Footer>
        </Modal>
            </div>
        </div>
      </div>


  );
};

export default CategoryAccordion;
