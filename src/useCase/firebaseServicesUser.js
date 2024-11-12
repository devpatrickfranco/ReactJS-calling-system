import { useState, useEffect } from 'react';
import { toast } from 'react-toastify'
import { dbFirebase } from '../services/firebaseConnection'

// Hook para pegar os usuários
export const useUsers = () => {
    const [users, setUsers] = useState([]);  // Estado para armazenar os usuários
    const [loading, setLoading] = useState(true);  // Estado para controlar o carregamento
    const [error, setError] = useState(null);  // Estado para armazenar possíveis erros

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = dbFirebase.firestore().collection('users') // Referência à coleção 'users'
                const userSnapshot = await usersCollection.get() // Pega os documentos da coleção
                const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Mapeia os docs
                setUsers(userList);
            } catch (err) {
                setError(err);  // Se houver erro, atualiza o estado de erro
            } finally {
                setLoading(false);  // Indica que o carregamento terminou
            }
        };  
        
        fetchUsers();  // Chama a função para buscar os usuários

    }, []);  // O array vazio [] garante que a busca seja feita apenas uma vez (no montamento do componente)

    return { users, loading, error };  // Retorna os dados dos usuários, estado de carregamento e erro
};

export const deleteUser = async (userId) => {
    await dbFirebase.firestore().collection('users').doc(userId).delete()
    .then(
        toast.success('usuario removido com sucesso')
    )
}   
