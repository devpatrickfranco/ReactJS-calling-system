import { useState, useContext } from 'react'
import './profile.css'
import Header from '../../components/Header'
import Title from '../../components/Title'
import avatar from '../../assets/avatar.jpg'

import { dbFirebase } from '../../services/firebaseConnection'
import { AuthenticateContext } from '../../contexts/authenticate'

import { FiSettings, FiUpload } from 'react-icons/fi' 
import { GiConsoleController } from 'react-icons/gi'


export default function Profile(){
    const { user, signOut, loadingAuthenticate, setUser, storageUser } = useContext(AuthenticateContext)

    const [ nome, setNome] = useState(user && user.nome)
    const [ email, setEmail] = useState(user && user.email)

    const [imgProfile, setImgProfile] = useState(user && user.imgProfile)
    const [imgAvatar, setImgAvatar] = useState(null)

    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0]

            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setImgAvatar(image)
                setImgProfile(URL.createObjectURL(e.target.files[0]))
        } else {
            alert('envie uma image do tipo PNG ou JPEG')
            setImgAvatar(null)
            return null
        }
    }
}

    async function handleUpload() {
        const currentUid = user.uid;

        try {
            // Upload da imagem no caminho correto
            const uploadTask = await dbFirebase.storage()
                .ref(`images/${currentUid}/${imgAvatar.name}`)
                .put(imgAvatar);

            // Obtenção do URL de download com o caminho atualizado
            const urlImgProfile = await dbFirebase.storage()
                .ref(`images/${currentUid}`)
                .child(imgAvatar.name)
                .getDownloadURL();

            // Atualização dos dados do usuário no Firestore
            await dbFirebase.firestore().collection('users')
                .doc(user.uid)
                .update({
                    imgProfile: urlImgProfile,
                    nome: nome
                });

            // Atualizando o estado local e armazenamento do usuário
            const data = {
                ...user,
                imgProfile: urlImgProfile,
                nome: nome
            };
            setUser(data);
            storageUser(data);
            
        } catch (error) {
            console.error("Erro no upload da imagem: ", error);
            alert("Erro ao fazer upload da imagem. Tente novamente.");
        }
    }



    async function handleSave(e){
        e.preventDefault()  
        if(imgAvatar === null && nome !== ''){
            await dbFirebase.firestore().collection('users')
            .doc(user.uid)
            .update({
                nome: nome
            })
            .then(() => {
                const data = {
                    ...user,
                    nome: nome
                }
                setUser(data)
                storageUser(data)
            })
            
        } else if (nome !== ''&& imgAvatar !== null) {
            handleUpload()
        }

    }

    return(

        <div>
            <Header/>
            <div className='content'>
                <Title name='Meu Perfil'>
                    <FiSettings size={24} /> 
                </Title>        

                <div className='container'>
                     <form className='form-profile' onSubmit={handleSave}>
                        <label className='label-imgProfile'>
                            <span>
                                <FiUpload color='#fff' size={24}/>
                            </span>

                            <input type='file' accept='image/*' onChange={handleFile}></input><br></br>
                            {imgProfile === null ? 
                            <img src={avatar} width={250} height={250} alt='Photo user profile'></img>
                             : 
                            <img src={imgProfile} width={250} height={250} alt='Photo user profile'></img>
                            }  
                        </label>
                    
                        <label>Nome</label>
                        <input type='text' value={nome} onChange={ (e) => setNome(e.target.value )} ></input> 

                        <label>Email</label>
                        <input type='text' value={email} disabled ></input>    

                        <button type='submit' >
                            Salvar
                        </button>
                     </form>
                </div>
            
                <div className='container'>
                    <button className='logout-btn' onClick={() => signOut()}>
                    { loadingAuthenticate ? 'Carregando...' : 'Sair'}
                    </button>

                </div>

            </div>
        </div>
    )
}