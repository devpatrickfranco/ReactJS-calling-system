import Spinner from 'react-bootstrap/Spinner';

export default function Spinners() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spinner
                animation="border"
                style={{
                    color: '#754FFE', // Cor personalizada
                    width: '3rem', // Tamanho opcional
                    height: '3rem',
                }}
            />
        </div>
    );
}
