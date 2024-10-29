import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi'
import { format } from 'date-fns'

import Header from '../../components/Header/'
import Title from '../../components/Title'
import Modal from '../../components/Modal'
import { dbFirebase } from '../../services/firebaseConnection'
import './dashboard.css'

const listRef = dbFirebase.firestore().collection('chamados').orderBy('created', 'desc')


export default function Dashboard(){
    const [chamados, setChamados] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false)
    const [lastdocs, setLastDocs] = useState()
    const [showPostModal, setShowPostModal] = useState(false)
    const [detail, setDetail] = useState()


    useEffect(() =>{
        setChamados([])

        async function loadingChamados() {
            await listRef.limit(5)
            .get()
            .then((snapshot)=>{
                updateState(snapshot)
            })
            .catch( (err) =>{
                console.log('Erro ao buscar chamados ', err)
                toast.error('Não foi possivel buscar chamados!')
                setLoadingMore(false)
            })
        
                setLoading(false)
        }       
        loadingChamados()

        return () => {
           
        }

    }, [])
    


    async function updateState(snapshot) {
        const isCollectionEmpty = snapshot.size === 0;
    
        if (!isCollectionEmpty) {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                assunto: doc.data().assunto,
                cliente: doc.data().cliente,
                clienteId: doc.data().clienteId,
                created: doc.data().created,
                createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                status: doc.data().status,
                complemento: doc.data().complemento,
            }));
    
            const lastDocs = snapshot.docs[snapshot.docs.length - 1];
            setChamados(list);  // Apenas atualiza com os dados do snapshot atual
            setLastDocs(lastDocs);
        } else {
            setIsEmpty(true);
        }
    
        setLoadingMore(false);
    }
    
    async function handleMore(){
        setLoadingMore(true)
        await listRef.startAfter(lastdocs).limit(5)
        .get()
        .then((snapshot) => {
            updateState(snapshot)
        })
    }

    function toglePostModal(item){
        setShowPostModal(!showPostModal)
        setDetail(item)
    }

    if(loading) {
        return(
        <div>
            <Header/>
            <div className='content'>
                <Title name={'Chamados'}>
                    <FiMessageSquare size={24}/>
                </Title>
            </div>

            <div className='container dashboard'>
                <span> Buscando Chamados...</span>
            </div>
        </div>
        )
    }


    
    return(
        <div>
            <Header/>            
            <div className='content'>
                <Title name={'Chamados'}>
                    <FiMessageSquare size={24}/>
                </Title>

                {chamados.length === 0 ? (
                    <div className='container dashboard'>
                        <span>Nenhum chamado registrado...</span>
                    
                        <Link to='/new' className='new'>
                            <FiPlus size={24} color='#FFF'/>
                            Novo Chamado
                        </Link>
                    </div>
                ) : (
                    <>
                         <Link to='/new' className='new'>
                            <FiPlus size={24} color='#FFF'/>
                            Novo Chamado
                        </Link>
                        <table>
                            <thead>
                                <tr>
                                    <th scope='col'> Cliente </th>
                                    <th scope='col'> Assunto </th>
                                    <th scope='col'> Status </th>
                                    <th scope='col'> Cadastrado em  </th>
                                    <th scope='col'> # </th>
                                </tr>
                            </thead>
                            <tbody>
                                {chamados.map((item, index) => {
                                    return (
                                        <tr key={index}>    
                                        <td data-label='cliente'>{item.cliente}</td>
                                        <td data-label='Assunto'>{item.assunto}</td>
                                        <td data-label='Status'>
                                            <span className='badge' style={{backgroundColor: item.status === 'aberto' ? '#5cb85c' : '#3583f6'}}>{item.status}</span>
                                        </td>
                                        <td data-label='Cadastrado'> {item.createdFormated} </td>
                                        <td data-label='#'> 
                                            <button className='action'  style={{ backgroundColor: '#3583f6' }} onClick={ () => toglePostModal(item) }>
                                                <FiSearch color='#FFF' size={17}/>
                                            </button>
                                            <Link className='action'  style={{ backgroundColor: '#f6a935' }} to={`/new/${item.id}`}>
                                                <FiEdit2 color='#FFF' size={17}/>
                                            </Link>
                                        </td>
                                    </tr>
                                    )
                                })}
                            </tbody>
                        </table>

                        {loadingMore && <h3 style={{ textAlign: 'center', marginTop: 15 }}>Buscando dados...</h3>}
                        { !loadingMore && !isEmpty && <button className='btn-more' onClick={handleMore}> Buscar Mais </button> }
                    </>
                )}
            </div>

            {showPostModal && (
                <Modal
                conteudo={detail}
                close={toglePostModal}
                />
            )}
        </div>
    )
}