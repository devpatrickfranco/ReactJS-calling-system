import { useParams } from 'react-router-dom'
import { FiX } from 'react-icons/fi'
import { toast } from 'react-toastify';
import { dbFirebase } from '../../services/firebaseConnection';
import './modal.css'




export default function Modal({conteudo, close}){

    async function reabrirChamado() {
        try {
            await dbFirebase.firestore().collection('chamados')
                .doc(conteudo.id) // Usando conteudo.id diretamente
                .update({
                    status: 'reaberto'
                });
            
            toast.info('Chamado reaberto com sucesso!');
            close(); // Fecha o modal ao concluir a ação
        } catch (error) {
            console.error('Erro ao reabrir o chamado:', error);
            toast.error('Erro ao reabrir o chamado.');
        }
    }

    return (
        <div className='modal'>
            <div className='container'>
                <button className='close' onClick={close}>
                    <FiX size={24} color='#3583f6'/>
                    Voltar
                </button>

                <div>
                    <h2>Detalhes do Chamado</h2>
                    <div className='row'>
                        <span>   
                            Cliente: <a>{conteudo.cliente}</a>
                        </span>
                    </div>
                    <div className='row'>
                        <span>   
                            Assunto: <a>{conteudo.assunto}</a>
                        </span>
                        <span>   
                            Cadastrado Em: <a>{conteudo.createdFormated}</a>
                        </span>
                    </div>
                    <div className='row'>
                        <span>   
                            Status: <a style={{ color: '#FFF', borderRadius: 5, backgroundColor: conteudo.status === 'aberto' ? '#3583f6' : conteudo.status === 'atendimento' ? '#5cb85c' : '#d9534f'   }}>{conteudo.status}</a>
                        </span>
                    </div>

                {conteudo.complemento !== '' && (
                    <>
                    <h3>Complemento</h3>
                    
                    <p>
                        {conteudo.complemento}
                    </p>

                    </>
                )}

                <div className='btn-reabrir'>
                    {conteudo.status === 'finalizado' && (
                        <>

                    <button onClick={reabrirChamado}>
                        Reabrir
                    </button>

                        </>
                    )}
                    </div>
                
                </div>
            </div>
        </div>  
    )
}