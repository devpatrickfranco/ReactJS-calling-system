import { useState, useEffect, useContext } from "react"
import { useParams } from 'react-router-dom'
import { FiPlusCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'

import Header from "../../components/Header"
import Title from "../../components/Title"
import Modal from '../../components/Modal'
import { AuthenticateContext } from "../../contexts/authenticate"
import { dbFirebase } from "../../services/firebaseConnection"
import './newchamado.css'

export default function NewChamado(){
    const { id } = useParams()

    const [loadCustomers, setLoadCustomers] = useState(true)
    const [customers, setCustomers] = useState([]) 
    const [customersSelected, setCustomersSelected] = useState(0)

    const [assunto, setAssunto] = useState('Trafego Pago')
    const [status, setStatus] = useState('aberto')
    const [prioridade, setPrioridade] = useState('baixa')  // Novo estado para prioridade
    const [complemento, setComplemento] = useState('')
    
    const [idCustomer, setIdCustomer] = useState(false)

    const { user } = useContext(AuthenticateContext)

    const { hasPermission } = useContext(AuthenticateContext);

    useEffect(() => {
        async function loadCustomers(){
            await dbFirebase.firestore().collection('customers')
            .get()
            .then((snapshot) => {
                const list = []
                snapshot.forEach((doc) => { 
                    list.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    })
                })

                if(list.length === 0){
                    console.log('Nenhuma Empresa encontrada')
                    setCustomers([{ id: '1', nomeFantasia: '' }])
                    setLoadCustomers(false)
                    return
                }

                setCustomers(list)
                setLoadCustomers(false)

                if(id){
                    loadId(list)
                }
                
            }).catch((error) => {
                console.log('Erro na busca de customers', error)
                setLoadCustomers(false)
                setCustomers([{ id: '1', nomeFantasia: '' }])
            })
        }   
        loadCustomers()
    }, [id]) 

    async function loadId(list){
        await dbFirebase.firestore().collection('chamados').doc(id)
        .get()
        .then((snapshot) => {
            setAssunto(snapshot.data().assunto)
            setStatus(snapshot.data().status)
            setPrioridade(snapshot.data().prioridade || 'baixa') // Carrega a prioridade, com padrão 'baixa'
            setComplemento(snapshot.data().complemento || '')

            const index = list.findIndex(item => item.id === snapshot.data().clienteId)
            setCustomersSelected(index >= 0 ? index : 0)
            setIdCustomer(true)
        
        })
        .catch((err) => {
            console.log('Erro ao encontrar o chamado', err)
            setCustomers([])
            setIdCustomer(false)
        })
    }

    async function handleNewChamado(e){
        e.preventDefault()

        if(idCustomer){
            await dbFirebase.firestore().collection('chamados')
            .doc(id)
            .update({
                cliente: customers[customersSelected].nomeFantasia,
                clienteId: customers[customersSelected].id,
                assunto: assunto,
                status: status,
                prioridade: prioridade,  // Salva a prioridade
                complemento: complemento,
                userId: user.uid
            })
            .then(() =>{
                toast.success('Chamado editado com sucesso!')
                setCustomersSelected(0)
                setComplemento('')
            })
            .catch((err) => {
                toast.error('Erro ao editar o chamado')
            })

            return
        }

        await dbFirebase.firestore().collection('chamados')
        .add({
            created: new Date(),
            cliente: customers[customersSelected].nomeFantasia,
            clienteId: customers[customersSelected].id,
            assunto: assunto,
            status: status,
            prioridade: prioridade,  // Adiciona a prioridade
            complemento: complemento,
            userId: user.uid
        }).then(() => {
            toast.success('Chamado Criado com Sucesso')
            setCustomersSelected(0)
            setComplemento('')
        })
        .catch((err) => {
            toast.error('Erro ao criar o chamado!')
            console.log(err)
        })
    }

    function handleSelect(e){
        setAssunto(e.target.value)
    }

    function handleOptionChange(e){
        setStatus(e.target.value)
    }

    function handlePriorityChange(e){
        setPrioridade(e.target.value)
    }

    function handleChangeCustomers(e){
        setCustomersSelected(e.target.value)
    }

    // Função para alterar o status do chamado para "atendimento"
    async function openCallButton() {
        try {
            // Atualiza o estado local para "atendimento"
            setStatus('atendimento');
            
            // Atualiza o Firestore para refletir o novo status
            await dbFirebase.firestore().collection('chamados')
                .doc(id)
                .update({
                    status: 'atendimento'
                });
            
            toast.info('Chamado Em Atendimento!');
        } catch (error) {
            console.error('Erro ao atualizar o status do chamado:', error);
            toast.error('Erro ao abrir o chamado.');
        }
    }
    
    async function finalizeCallButton() {
        try {
            setStatus('finalizado'); // Atualiza o estado local para "finalizado"
    
            await dbFirebase.firestore().collection('chamados')
                .doc(id)
                .update({
                    status: 'finalizado'
                });
    
            toast.info('Chamado finalizado com sucesso!');
        } catch (error) {
            console.error('Erro ao finalizar o chamado:', error);
            toast.error('Erro ao finalizar o chamado.');
        }
    }
    

    return (
        <div>
            <Header />
            <div className="content">
                <Title name={id ? 'Editar Chamado' : 'Novo Chamado'}>
                    <FiPlusCircle size={24}/>
                </Title>

                <div className="container">
            
                    <form className="form-profile" onSubmit={handleNewChamado}>
                        <label>Cliente</label>
                        {loadCustomers ? (
                            <input type="text" disabled={true} value={'Carregando itens...'} />
                        ) : (
                            <select value={customersSelected} onChange={handleChangeCustomers}>
                                {customers.map((item, index) => (
                                    <option key={item.id} value={index}>
                                        {item.nomeFantasia}
                                    </option> 
                                ))}
                            </select>
                        )}

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleSelect}>
                            <option value={'Trafego Pago'}>Trafego Pago</option>
                            <option value={'Midias Sociais'}>Midias Sociais</option>
                            <option value={'Site / Google'}>Site / Google</option>
                        </select>

                        <label>Prioridade</label>
                        <div className="status">
                            <input 
                                name="prioridade"
                                type="radio"
                                value={'baixa'}
                                onChange={handlePriorityChange}
                                checked={prioridade === 'baixa'}
                            />
                            <span>Baixa</span>

                            <input
                                name="prioridade"
                                type="radio"
                                value={'media'}
                                onChange={handlePriorityChange}
                                checked={prioridade === 'media'}
                            />
                            <span>Média</span>
                            
                            <input
                                name="prioridade"
                                type="radio"
                                value={'alta'}
                                onChange={handlePriorityChange}
                                checked={prioridade === 'alta'}
                            />
                            <span>Alta</span>
                        </div>

                        <label>Complemento</label>
                        <textarea
                            type="text"
                            placeholder="Descreva em detalhes a ajuda que precisa"
                            onChange={(e) => setComplemento(e.target.value)}
                            value={complemento}
                        />
                           
                                <button type="submit">
                                    {id ? 'Salvar Chamado' : 'Criar Chamado'}
                                </button>
                    </form>

                            {user && id && hasPermission(user, 'Admin') && (
                            <>
                                {status === 'aberto' && (
                                    <button onClick={openCallButton}>Abrir Chamado</button>
                                )}
                                {status === 'atendimento' && (
                                    <button onClick={finalizeCallButton}>Finalizar Chamado</button>
                                )}
                            </>
                        )}
                </div>
            </div>
        </div> 
    )
}
