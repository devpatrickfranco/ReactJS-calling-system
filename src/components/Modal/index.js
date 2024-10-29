import './modal.css'

import { FiX } from 'react-icons/fi'

export default function Modal({conteudo, close}){
    return (
        <div className='modal'>
            <div className='container'>
                <button className='close' onClick={close}>
                    <FiX size={24} color='#fff'/>
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


                </div>
            </div>
        </div>  
    )
}