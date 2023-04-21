import axios from 'axios';

const urlApp = `http://localhost:8888/xxx/API_Laravel/public`;

export const baseUrlApp = axios.create({
    baseURL: urlApp,
    withCredentials: true,
})

export const login = (mail, password, updateLogin, error) => {
    baseUrlApp.get('/sanctum/csrf-cookie')
        .then(response => {
            baseUrlApp.post('/login', {
                email: mail,
                password: password
            }).then(response => {
                if (response.status === 204) {
                    baseUrlApp.post('/login', {
                        email: mail,
                        password: password
                    }).then(response => {
                        if (response.status === 200) {
                            updateLogin(true, response.data.data);
                            const appState = {
                                loggedIn: true,
                                authUser: response.data.data
                            };
                            localStorage["appState"] = JSON.stringify(appState);
                        }
                    })
                } else if (response.status === 200) {
                    updateLogin(true, response.data.data);
                    const appState = {
                        loggedIn: true,
                        authUser: response.data.data
                    };
                    localStorage["appState"] = JSON.stringify(appState);
                }
            })
            .catch(response => error('Identifiant ou mot de passe erroné'));
        })
}

export const logout = (updateLogin) => {
    baseUrlApp.post('/logout')
        .then(response => {
            if (response.status === 204) {
                updateLogin(false, undefined);
                const appState = {
                    loggedIn: false,
                    authUser: undefined
                };
                localStorage["appState"] = JSON.stringify(appState);
            }
        });
}