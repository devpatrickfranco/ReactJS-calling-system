import { dbFirebase } from '../services/firebaseConnection'

export const fetchEvents = async () => {
  try {
    // Busca todos os documentos da coleção 'eventos'
    const getEventos = await dbFirebase.firestore().collection('eventos').get();

    // Mapeia os documentos para um array de objetos contendo os dados
    const eventos = getEventos.docs.map(doc => {
      const data = doc.data();

      // Garantir que assignedUsers seja sempre um array (caso contrário, definir como array vazio)
      const assignedUsers = Array.isArray(data.assignedUsers) ? data.assignedUsers : [];

      // Se start ou end forem timestamps, convertemos para objetos Date
      const start = data.start instanceof dbFirebase.firestore.Timestamp ? data.start.toDate() : new Date(data.start);
      const end = data.end instanceof dbFirebase.firestore.Timestamp ? data.end.toDate() : new Date(data.end);

      return {
        id: doc.id, // Inclui o ID do documento como referência
        title: data.title,
        description: data.description,
        priority: data.priority,
        start, // Converte para Date
        end, // Converte para Date
        createdBy: data.createdBy,
        assignedUsers, // Inclui os usuários atribuídos
      };
    });

    // Retorna os eventos mapeados
    return eventos;
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    throw new Error('Erro ao buscar eventos');
  }
};

  export const getUserDetails = async () => {
    try {
      // Obter o usuário autenticado
      const currentUser = dbFirebase.auth().currentUser;
  
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }
  
      const userId = currentUser.uid;
  
      // Buscar informações do Firestore usando o `uid`
      const userDoc = await dbFirebase.firestore().collection('users').doc(userId).get();
  
      if (!userDoc.exists) {
        throw new Error('Usuário não encontrado no Firestore');
      }
  
      const userData = userDoc.data();
      return userData; // Retorna os dados do usuário (incluindo o nome)
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      throw new Error('Erro ao obter dados do usuário');
    }
  };