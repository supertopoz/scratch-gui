import React from 'react';
import firebase from 'firebase';
import firebaseui from 'firebaseui';


class Login extends React.Component {
    constructor (props) {
        super(props);
    }
    componentWillMount (){
        const location = window.location.href;
        let redirect = '/';
        if (location !== 'http://localhost:8601/') {
            redirect = 'https://supertopoz.github.io/ila-code-tool-1.1/index.html';
        }
        const ui = new firebaseui.auth.AuthUI(firebase.auth());
        const uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: function () {
                    // User successfully signed in.
                    // Return type determines whether we continue the redirect automatically
                    // or whether we leave that to developer to handle.
                    return true;
                },
                uiShown: function () {
                    // The widget is rendered.
                    // Hide the loader.
                //
                }
            },
            // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
            signInFlow: 'redirect',
            // signInSuccessUrl: redirect,
            signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                // firebase.auth.GithubAuthProvider.PROVIDER_ID,
                // firebase.auth.EmailAuthProvider.PROVIDER_ID,
                // firebase.auth.PhoneAuthProvider.PROVIDER_ID
            ],
            // Terms of service url.
            tosUrl: '<your-tos-url>'
        };
        firebase.auth().onAuthStateChanged(user => {
            if (!user){
                ui.start('#firebaseui-auth-container', uiConfig);
                document.getElementById('loader').style.display = 'none';
            }
        });
    }
    
    render () {

        const mainStyle = {
            display: 'grid',
            background: '#f15d4f',
            marginTop: '-20px',
            gridTemplateRows: '2fr 1fr 1fr',
            gridTemplateColumns: '1fr',
            margin: '0 auto'
        };

        const picStyle = {
          display: 'grid',
          alignSelf: 'center',
          justifySelf: 'center'
        }    

        return (
            <div style={mainStyle}>
            <picture style={picStyle}>
                <source media="(min-width: 800px)" srcSet="https://lh3.googleusercontent.com/D4swSEpfTeg4izFq8zcr0wgrUb69envx2rfxDNnxRZBW-ITbGlEFCEQRl5NtGY7ZjJPTPR3ZndDYKwRQUP-cmlOqv70j5F_-oIckmuGMXI1PdcZMW_COoi0T-hiA2AOfPbl5nGzo" />
                <source media="(min-width: 450px)" srcSet="https://lh3.googleusercontent.com/WTbG4na_NRnwlaiBsYQFXEhIrknrLWxF2ProP2KfWuySCHdohUp_RcMsK6NB6W_hB-klQxAeLbZ4Ab7wme41cZoDJ6O9cbg8DcrTYDZuC0EwmDcQy_AbCAhS0W7Ze-ksm7__RwVU" />
                <img src="head-fb.jpg" srcSet="https://lh3.googleusercontent.com/OEoKhgbssvNDeRqJW9suQr4l3ZH6FKfdQH--Z_a5Dfr_Fd5YSztw3PvGiA1T2nWZeCQeLM2TbV8tBvAsT80FxKGkP30lumRgzPsJg6QeEshNrjTY9NNWbrk352F8PAkxVvCTR0Zz" alt="Amazing code logo" />
            </picture>
            <div style={{margin:'0 auto'}}>
            <div id="firebaseui-auth-container" />
            <div id="loader">Loading...</div>
            </div>
            </div>
            )
    }
}

export default Login;
