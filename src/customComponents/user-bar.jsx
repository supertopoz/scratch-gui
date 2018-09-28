import classNames from 'classnames';
import React from 'react';
import firebase from 'firebase';
import profileIcon from './icon--profile.png';
import styles from './user-bar.css';
import Divider from '../components/divider/divider.jsx';

class UserBar extends React.Component {
    constructor (props){
        super(props);
        this.state = {
            user: 'jason'
        };
        this.logout = this.logout.bind(this);
    }

    componentDidMount (){
        const that = this;
        firebase.auth().onAuthStateChanged(user => {
            that.setState({user: user.displayName});
        });
    }
    
    logout (){
        firebase.auth().signOut()
            .then(() => {
                window.location.reload(false);
            });
    }

    render (){
        return (

            <div className={styles.accountInfoWrapper} >
                <Divider className={classNames(styles.divider)} />
                <img
                    className={styles.profileIcon}
                    src={profileIcon}
                />
                <span>{this.state.user}</span>
                <Divider className={classNames(styles.divider)} />
                <div
                    className={styles.logout}
                    onClick={this.logout}
                >
                Logout</div>
            </div>
        );
    }

}

export default UserBar;
