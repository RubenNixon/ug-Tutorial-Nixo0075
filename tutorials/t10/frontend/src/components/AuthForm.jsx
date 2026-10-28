import { useState } from 'react';

function AuthForm({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (response.ok) {
                onLogin(data.token);
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error("Auth error", error);
        }
    };

    return (
        <div className="form-card">
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
            </form>
            <p style={{ cursor: 'pointer', color: '#0fbcf9', marginTop: '10px' }} onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Need an account? Register" : "Have an account? Login"}
            </p>
        </div>
    );
}

export default AuthForm;
