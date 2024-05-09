import React, { useState } from 'react';

const Login = () => {
    // State untuk menyimpan data login (misalnya: username dan password)
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    // Handle perubahan input
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle submit form
    const handleSubmit = (event) => {
        event.preventDefault();
        // Lakukan validasi atau kirim data login ke server di sini
        console.log('Data login:', formData);
        // Reset form setelah submit
        setFormData({ username: '', password: '' });
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
