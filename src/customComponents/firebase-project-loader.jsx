import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import firebase from 'firebase';
import classNames from 'classnames';
import Divider from '../components/divider/divider.jsx';
import startingData from './starting-data.js';

import {
    openLoadingProject,
    closeLoadingProject
} from '../reducers/modals';

import styles from './firebase-project-loader.css';

class FirebaseProjectLoader extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'loadProject',
            'showMenu',
            'hideMenu',
            'deleteProject',
            'saveProject',
            'createProject',
            'getProjectName',
            'resetData',
            'setProjectId',
            'setProjectName'
        ]);
        this.state = {
            loadingError: false,
            errorMessage: '',
            displayMenu: true,
            usersProjects: [],
            currentProjectName: '',
            currentProjectId: '',
            savingStatus: 'Save'
        };
    }

    componentWillMount (){
        const that = this;
        const user = firebase.auth().currentUser;
        const starCountRef = firebase.database().ref(`users/${user.uid}`);
        starCountRef.on('value', data => {
            const tempProjectsList = [];
            const dataObj = data.val();
            for (const i in dataObj){
                tempProjectsList.push({id: i, projectName: dataObj[i].name});
            }
            that.setState({usersProjects: tempProjectsList.reverse()});
        });
    }

    loadProject (id) {
        history.replaceState({}, document.title, '.');
        this.props.openLoadingState();
        const that = this;
        const user = firebase.auth().currentUser;
        const starCountRef = firebase.database().ref(`users/${user.uid}/${id}`);
        starCountRef.on('value', data => {
            const info = JSON.parse(data.val().code.vm);
            that.props.vm.loadProject(info)
                .then(() => {
                    that.setState({displayMenu: true});
                    that.setProjectName(`${data.val().name}`);
                    that.setProjectId(id);
                    that.props.closeLoadingState();
                });
        });
    }

    showMenu (){
        this.setState({displayMenu: false});
    }
    hideMenu (){
        this.setState({displayMenu: true});
    }

    deleteProject (deleteProjectId){
        const user = firebase.auth().currentUser;
        firebase.database().ref(`users/${user.uid}/${deleteProjectId}`)
            .remove();
        if (deleteProjectId === this.state.currentProjectId){
            this.resetData();
            this.setProjectId('');
            this.setProjectName('Untitled');
        }
    }

    saveProject (){
        if (this.state.currentProjectName === ''){
            alert('Not Saved - no project name given');
            return;
        }
        this.setState({savingStatus: ' . . . '});
        this.props.vm.saveProjectSb3().then(() => {
            const that = this;
            const user = firebase.auth().currentUser;
            const dataObject = {
                code: {vm: JSON.stringify(this.props.vm)},
                name: this.state.currentProjectName
            };
            if (this.state.currentProjectId === ''){
                const sentData = firebase.database().ref(`users/${user.uid}`)
                    .push(dataObject);
                that.setProjectId(sentData.key);
                setTimeout(() => {
                    that.setState({savingStatus: 'Save'});
                }, 100);
            } else {
                firebase.database().ref(`users/${user.uid}/${this.state.currentProjectId}`)
                    .update(dataObject);
                setTimeout(() => {
                    that.setState({savingStatus: 'Save'});
                }, 100);
                
            }
        });
    }

    getProjectName (event){
        this.setState({currentProjectName: event.target.value});
    }

    resetData () {
        this.props.vm.loadProject(startingData);
    }

    setProjectId (id){
        this.setState({currentProjectId: id});
    }

    setProjectName (name){
        this.setState({currentProjectName: name});
    }

    createProject () {
        if (this.state.usersProjects.length < 10){
            this.setState({displayMenu: false});
            this.setProjectName('Loading...');
            const count = this.state.usersProjects.length + 1;
            const that = this;
            this.props.vm.saveProjectSb3().then(() => {
                const user = firebase.auth().currentUser;
                const dataObject = {
                    code: {vm: JSON.stringify(this.props.vm)},
                    name: `Untitled-${count}`
                };
                const sentData = firebase.database().ref(`users/${user.uid}`)
                    .push(dataObject);
                setTimeout(() => {
                    that.setState({displayMenu: true});                    
                    that.setProjectName(`Untitled-${count}`);
                }, 100);
                that.resetData();
                
                that.setProjectId(sentData.key);
            });
        } else {
          alert('Maximum 10 free projects reached!!');
        }
    }

    render () {
        if (this.state.loadingError) throw new Error(`Failed to load project: ${this.state.errorMessage}`);
        const {
            /* eslint-disable no-unused-vars */
            children,
            closeLoadingState,
            openLoadingState,
            vm,
            /* eslint-enable no-unused-vars */
            ...props
        } = this.props;
        return (
            // this.props.children(this.loadProject);
            <div className={classNames(styles.menuBarItem)}>
                <div
                    onClick={this.showMenu} 
                    className={classNames(styles.projectHeader)}
                >
                My Projects
                    <div
                        className={classNames(styles.dropdown)}
                        hidden={this.state.displayMenu}
                        onMouseEnter={this.showMenu}
                        onMouseLeave={this.hideMenu}
                        
                    >
                        { this.state.usersProjects.map((item, index, array) => {
                            const id = item.id;
                            const name = item.projectName;
                            const dataLength = array.length
                            return (
                                <div

                                    className={classNames(styles.projectListItem)}
                                    key={`projects-${index}`}
                                >
                                    <div
                                        className={classNames(styles.projectListItemText)}
                                        key={index}
                                        onClick={()=> this.loadProject(id) }
                                    >
                                        {name} 
                                    </div>
                                    <div
                                        className={classNames(styles.projectListItemDelete)}
                                        onClick={()=> this.deleteProject(id) }
                                    >x</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <Divider className={classNames(styles.divider)} />
                <div>  
                    <input
                        className={classNames(styles.projectName)}       
                        type="text"
                        value={this.state.currentProjectName}
                        onChange={this.getProjectName}
                    />
                    <div 
                        className={classNames(styles.projectSave)}
                        onClick={this.saveProject}
                    >
                    {this.state.savingStatus}
                    </div>
                    <div 
                        className={classNames(styles.projectNew)}
                        onClick={this.createProject}
                    >
                    New
                    </div>
                </div>
                <Divider className={classNames(styles.divider)} />
            </div>
        );
    }
}

FirebaseProjectLoader.propTypes = {
    children: PropTypes.func,
    closeLoadingState: PropTypes.func,
    openLoadingState: PropTypes.func,
    vm: PropTypes.shape({
        loadProject: PropTypes.func
    })
};

const mapStateToProps = state => ({
    vm: state.vm
});

const mapDispatchToProps = dispatch => ({
    closeLoadingState: () => dispatch(closeLoadingProject()),
    openLoadingState: () => dispatch(openLoadingProject())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FirebaseProjectLoader);