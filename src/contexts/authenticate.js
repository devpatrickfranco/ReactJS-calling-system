import { createContext, useState, useEffect } from "react";
import { dbFirebase } from "../services/firebaseConnection";
import { toast } from 'react-toastify'

export const AuthenticateContext = createContext({})

function AuthenticateProvider({ children }) {
    const [user, setUser] = useState()
    const [loadingAuthenticate, setLoadingAuthenticate] = useState(false)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
       
    function loadStorage(){

        const storageUser = localStorage.getItem('SystemUser')
    
        if(storageUser){
            setUser(JSON.parse(storageUser))
            setLoading(false)
        }   

        setLoading(false)
    }


    loadStorage()
    },[] )
    
    // user login
    async function signIn(email, password) {
        setLoadingAuthenticate(true)

        await dbFirebase.auth().signInWithEmailAndPassword(email, password)
        .then( async (value) => {
            const uid = value.user.uid

            const userProfile = await dbFirebase.firestore().collection('users')
            .doc(uid)
            .get()

            const data = {
                uid: uid,
                nome: userProfile.data().nome,
                imgProfile: userProfile.data().imgProfile,
                email: value.user.email,
                role: userProfile.data().role
}
            setUser(data)
            storageUser(data)
            setLoadingAuthenticate(false)
            toast.success('Bem vindo de volta!')
})
        .catch((error)=>{
            setLoadingAuthenticate(false)
            console.log(error)
            setLoadingAuthenticate(false)
            toast.error('Ops! Algo deu errado.')
        })  
    }

    // registering new user
    async function signUp(nome, email, password, role){
        setLoadingAuthenticate(true)
        await dbFirebase.auth().createUserWithEmailAndPassword(email, password)
        .then( async (value) => {
            const uid = value.user.uid

            await dbFirebase
            .firestore()
            .collection("users")
            .doc(uid)
            .set({
              nome: nome,
              role: role,
              imgProfile: null,
            })
            .then( ()=> {
                const data = {
                    uid: uid,
                    nome: nome,
                    email: value.user.email,
                    imgProfile: null,
                    role: role
                }

                setUser(data)
                storageUser(data)
                setLoadingAuthenticate(false)
                toast.success('Bem vindo a Plataforma')
            })
       }).catch((error) => {
            console.log(error)
            toast.error('Ops! Algo deu errado')
            setLoadingAuthenticate(false)
       })
    }

    function hasPermission(user, requiredRole) {
        const roleHierarchy = ['user', 'admin', 'superAdmin'];
        return roleHierarchy.indexOf(user.role) >= roleHierarchy.indexOf(requiredRole);
    }

    function storageUser(data){
        localStorage.setItem('SystemUser', JSON.stringify(data))
    }

    // user logout
    async function signOut(){
        await dbFirebase.auth().signOut()
        localStorage.removeItem('SystemUser')
        setUser(null)
    }

    return(
        <AuthenticateContext.Provider value={{
            signed: !! user,
             user,
              loading,
               signIn,
               signUp,
               signOut,
               loadingAuthenticate,
               setUser, 
               storageUser,
               hasPermission
            }}>
            {children}
        </AuthenticateContext.Provider>
    )
}

export default AuthenticateProvider