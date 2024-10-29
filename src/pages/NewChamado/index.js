import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import { FiPlusCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'

import Header from "../../components/Header"
import Title from "../../components/Title"
import { AuthenticateContext } from "../../contexts/authenticate"
import { dbFirebase } from "../../services/firebaseConnection"
import './newchamado.css'

export default function NewChamado(){
  
    const { id } = useParams()
    const navigate = useNavigate()

    const [loadCustomers, setLoadCustomers] = useState(true)
    const [customers, setCustomers] = useState([]) 
    const [customersSelected, setCustomersSelected] = useState(0)

    const [assunto, setAssunto] = useState('Trafego Pago')
    const [status, setStatus] = useState('aberto')
    const [complemento, setComplemento] = useState('')
    
    const [idCustomer, setIdCustomer] = useState(false)

    const { user } = useContext(AuthenticateContext)

    useEffect(() => {
        async function loadCustomers(){
            await dbFirebase.firestore().collection('customers')
            .get()
            .then((snapshot) =>{

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
            setComplemento(snapshot.data().complemento || '') // Corrige para carregar complemento corretamente

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
            complemento: complemento,
            userId: user.uid
        }).then(() => {
            toast.success('Chamado Criado com Sucesso')
            setCustomersSelected(0)
            setComplemento('') // Limpa o campo complemento
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

    function handleChangeCustomers(e){
        setCustomersSelected(e.target.value)
    }

    return(
       <div>
            <Header/>
            <div className="content">
                <Title name={'Novo Chamado'}>
                <FiPlusCircle size={24}/>
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleNewChamado}>
                        <label>Cliente</label>
                        {loadCustomers ? (
                            <input type="text" disabled={true} value={'Carregando itens...'} />
                        ): (
                            <select value={customersSelected} onChange={handleChangeCustomers}>
                                {customers.map((item, index) => {
                                    return (
                                        <option key={item.id} value={index}>
                                            {item.nomeFantasia}
                                        </option> 
                                    )
                                })}
                            </select>
                        )}

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleSelect}>
                            <option value={'Trafego Pago'}>Trafego Pago</option>
                            <option value={'Midias Sociais'}>Midias Sociais</option>
                            <option value={'Site / Google'}>Site / Google</option>
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input 
                                name="radio"
                                type="radio"
                                value={'aberto'}
                                onChange={handleOptionChange}
                                checked={status === 'aberto'}
                            />
                            <span> Aberto</span>

                            <input
                                name="radio"
                                type="radio"
                                value={'atendimento'}
                                onChange={handleOptionChange}
                                checked={status === 'atendimento'}
                            />
                            <span>Em atendimento</span>
                            
                            <input
                                name="radio"
                                type="radio"
                                value={'finalizado'}
                                onChange={handleOptionChange}
                                checked={status === 'finalizado'}
                            />
                            <span> Finalizado </span>
                        </div>

                        <label>Complemento</label>
                        <textarea
                            type="text"
                            placeholder="Descreva em detalhes a ajuda que precisa"
                            onChange={(e) => setComplemento(e.target.value)}
                            value={complemento} // Adiciona o valor para o textarea
                        />

                        <button type="submit">
                            Criar Chamado
                        </button>
                    </form>
                </div>
            </div>
       </div> 
    )
}
