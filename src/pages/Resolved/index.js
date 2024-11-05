import React, { useState, useEffect } from 'react'
import Header from "../../components/Header"
import Title from "../../components/Title"
import Modal from '../../components/Modal'
import { dbFirebase } from "../../services/firebaseConnection"
import { FiClipboard, FiSearch } from 'react-icons/fi'
import './resolved.css'

export default function Resolved() {
    const [resolvedChamados, setResolvedChamados] = useState([])
    const [showPostModal, setShowPostModal] = useState(false)
    const [detail, setDetail] = useState()

    useEffect(() => {
        async function loadResolvedChamados() {
            await dbFirebase.firestore().collection('chamados')
                .where('status', '==', 'finalizado')
                .get()
                .then((snapshot) => {
                    // Cria a lista e ordena manualmente pela data de criação
                    const resolvedList = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    })).sort((a, b) => b.created.seconds - a.created.seconds);

                    setResolvedChamados(resolvedList);
                })
                .catch((error) => {
                    console.log("Erro ao carregar chamados finalizados: ", error)
                })
        }

        loadResolvedChamados()
    }, [])

    function toglePostModal(item){
        setShowPostModal(!showPostModal)
        setDetail(item)
    }

    return (
        <div>
            <Header />
            <div className="content">
                <Title name="Chamados Finalizados">
                    <FiClipboard size={24} />
                </Title>
                <div className="container">
                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Cliente</th>
                                <th>Assunto</th>
                                <th>Status</th>
                                <th>Data de Criação</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resolvedChamados.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{resolvedChamados.length - index}</td>
                                    <td>{item.cliente}</td>
                                    <td>{item.assunto}</td>
                                    <td>
                                        <span className='badge' style={{
                                            backgroundColor: item.status === 'aberto' ? '#3583f6' : 
                                                             item.status === 'atendimento' ? '#5cb85c' : '#d9534f'
                                        }}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>{new Date(item.created?.toDate()).toLocaleDateString()}</td>
                                    <td>    
                                        <button className='svg' style={{ backgroundColor: '#3583f6' }} onClick={() => toglePostModal(item)}>
                                            <FiSearch color='#FFF' size={17}/>
                                        </button>
                                    </td>   
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {showPostModal && (
                    <Modal
                        conteudo={detail}
                        close={toglePostModal}
                    />
                )}
            </div>
        </div>
    )
}
