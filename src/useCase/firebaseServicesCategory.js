import { dbFirebase } from '../services/firebaseConnection'
import { useState, useEffect } from 'react' 
// adicionar uma categoria 

export const addCategory = async (categoryName) => {
    try{
        await dbFirebase.firestore().collection('category').add({
            nome: categoryName,
            createdAt: new Date()
        })
        console.log('categoria adicionada com sucesso')
        alert('categoria adicionada com sucesso')
    } catch{
        console.error('algo deu errado', Error)
    
    }
}

// Função para adicionar subcategoria dentro de uma categoria específica
export const addSubcategory = async (categoryId, subcategoryName) => {
    try {
      // Obtém a referência do documento da categoria usando o ID
      const categoryRef = dbFirebase.firestore().collection("category").doc(categoryId);
  
      // Agora, adiciona a subcategoria na subcoleção 'subcategories' da categoria
      await categoryRef.collection("subcategories").add({
        nome: subcategoryName,
        createdAt: new Date()
      });
  
      console.log("Subcategoria adicionada com sucesso!");
      alert('Subcategoria adicionada com sucesso!')
    } catch (error) {
      console.error("Erro ao adicionar subcategoria: ", error);
      alert('Erro ao adicionar subcategoria!')
    }
  };
  
  export const assignUserToSubcategory = async (categoryId, subcategoryId, userId, userName) => {
    try {
      const categoryRef = dbFirebase.firestore().collection("category").doc(categoryId);
      const subcategoryRef = categoryRef.collection("subcategories").doc(subcategoryId);
      
      // Atualizando o campo 'users' para incluir o novo usuário, se não estiver já na lista
      await subcategoryRef.update({
        users: dbFirebase.firestore.FieldValue.arrayUnion({ id: userId, nome: userName }),
      });
      console.log("Usuário atribuído à subcategoria com sucesso!");
    } catch (error) {
      console.error("Erro ao atribuir usuário à subcategoria: ", error);
    }
  };
  
  // Função para buscar categorias, subcategorias e usuários atribuídos
  export const useCategoriesAndSubcategories = () => {
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          // Buscar as categorias
          const categoriesSnapshot = await dbFirebase.firestore().collection('category').get();
          const categoriesData = [];

          for (let categoryDoc of categoriesSnapshot.docs) {
            const categoryData = categoryDoc.data();
            const categoryId = categoryDoc.id;

            // Buscar subcategorias para essa categoria
            const subcategoriesSnapshot = await dbFirebase.firestore()
              .collection('category')
              .doc(categoryId)
              .collection('subcategories')
              .get();

            const subcategoriesData = [];
            for (let subcategoryDoc of subcategoriesSnapshot.docs) {
              const subcategoryData = subcategoryDoc.data();
              const subcategoryId = subcategoryDoc.id;

              // Buscar usuários atribuídos a essa subcategoria
              const subcategoryUsers = subcategoryData.users || [];  // Atribuindo valor default se não houver usuários

              subcategoriesData.push({
                id: subcategoryId,
                nome: subcategoryData.nome,
                users: subcategoryUsers
              });
            }

            categoriesData.push({
              id: categoryId,
              nome: categoryData.nome,
              subcategories: subcategoriesData
            });
          }

          // Buscar usuários com role === 'admin'
          const usersSnapshot = await dbFirebase.firestore().collection('users').where('role', '==', 'admin').get();
          const usersData = usersSnapshot.docs.map(doc => {
            return {
              id: doc.id,
              ...doc.data()
            };
          });

          setCategories(categoriesData);
          setUsers(usersData);
        } catch (error) {
          console.error('Erro ao buscar dados: ', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []);

  return { categories, users, loading };
  };
  
  // Função para editar nome da categoria
  export const editCategory = async (categoryId, newName) => {
    try {
      const categoryRef = dbFirebase.firestore().collection('category').doc(categoryId);
      await categoryRef.update({
        nome: newName
      });
      console.log('Categoria atualizada com sucesso!');
      alert('Categoria atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao editar categoria:', error);
      alert('Erro ao editar categoria');
    }
  };

  // Função para editar nome da subcategoria
  export const editSubcategory = async (categoryId, subcategoryId, newName) => {
    try {
      const categoryRef = dbFirebase.firestore().collection('category').doc(categoryId);
      const subcategoryRef = categoryRef.collection('subcategories').doc(subcategoryId);
      await subcategoryRef.update({
        nome: newName
      });
      console.log('Subcategoria atualizada com sucesso!');
      alert('Subcategoria atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao editar subcategoria:', error);
      alert('Erro ao editar subcategoria');
    }
  };

  // Função para excluir uma categoria
  export const deleteCategory = async (categoryId) => {
    try {
      const categoryRef = dbFirebase.firestore().collection('category').doc(categoryId);
      await categoryRef.delete();
      console.log('Categoria excluída com sucesso!');
      alert('Categoria excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      alert('Erro ao excluir categoria');
    }
  };

  // Função para excluir subcategoria
  export const deleteSubcategory = async (categoryId, subcategoryId) => {
    try {
      const categoryRef = dbFirebase.firestore().collection('category').doc(categoryId);
      const subcategoryRef = categoryRef.collection('subcategories').doc(subcategoryId);
      await subcategoryRef.delete();
      console.log('Subcategoria excluída com sucesso!');
      alert('Subcategoria excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir subcategoria:', error);
      alert('Erro ao excluir subcategoria');
    }
  };

// Função para remover um usuário de uma subcategoria
export const removeUserFromSubcategory = async (categoryId, subcategoryId, userId) => {
  try {
    const categoryRef = dbFirebase.firestore().collection('category').doc(categoryId);
    const subcategoryRef = categoryRef.collection('subcategories').doc(subcategoryId);

    // Buscando a subcategoria para encontrar o índice do usuário
    const subcategoryDoc = await subcategoryRef.get();
    const subcategoryData = subcategoryDoc.data();

    if (subcategoryData && subcategoryData.users) {
      const userIndex = subcategoryData.users.findIndex(user => user.id === userId);

      if (userIndex !== -1) {
        const userToRemove = subcategoryData.users[userIndex];

        // Removendo o objeto de usuário encontrado no array 'users' dentro da subcategoria
        await subcategoryRef.update({
          users: dbFirebase.firestore.FieldValue.arrayRemove(userToRemove)
        });

        console.log("Usuário removido da subcategoria com sucesso!");
      } else {
        console.error("Usuário não encontrado na subcategoria");
      }
    } else {
      console.error("Subcategoria não contém usuários");
    }
  } catch (error) {
    console.error("Erro ao remover usuário da subcategoria:", error);
  }
};

