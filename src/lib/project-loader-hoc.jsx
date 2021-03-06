import React from 'react';
import PropTypes from 'prop-types';
import analytics from './analytics';
import log from './log';
import storage from './storage';
import firebase from 'firebase';
import config from '../../config.js';

import Login from '../customComponents/login.jsx';

/* Higher Order Component to provide behavior for loading projects by id from
 * the window's hash (#this part in the url) or by projectId prop passed in from
 * the parent (i.e. scratch-www)
 * @param {React.Component} WrappedComponent component to receive projectData prop
 * @returns {React.Component} component with project loading behavior
 */
const ProjectLoaderHOC = function (WrappedComponent) {
    class ProjectLoaderComponent extends React.Component {
        constructor (props) {
            super(props);
            this.fetchProjectId = this.fetchProjectId.bind(this);
            this.updateProject = this.updateProject.bind(this);
            this.state = {
                projectId: null,
                projectData: null,
                fetchingProject: false,
                user: false
            };
        }
        componentWillMount (){
            if (firebase.apps.length === 0) firebase.initializeApp(config);
            const that = this;
            firebase.auth().onAuthStateChanged(user => user ? that.setState({user: true}) : '');
        }

        componentDidMount () {
    
            window.addEventListener('hashchange', this.updateProject);
            this.updateProject();
        }
        componentWillUpdate (nextProps, nextState) {
            if (this.state.projectId !== nextState.projectId) {
                this.setState({fetchingProject: true}, () => {
                    storage
                        .load(storage.AssetType.Project, this.state.projectId, storage.DataFormat.JSON)
                        .then(projectAsset => projectAsset && this.setState({
                            projectData: projectAsset.data,
                            fetchingProject: false
                        }))
                        .catch(err => log.error(err));
                });
            }
        }
        componentWillUnmount () {
            window.removeEventListener('hashchange', this.updateProject);
        }
        fetchProjectId () {
            return window.location.hash.substring(1);
        }
        updateProject () {
            let projectId = this.props.projectId || this.fetchProjectId();
            if (projectId !== this.state.projectId) {
                if (projectId.length < 1) projectId = 0;
                this.setState({projectId: projectId});

                if (projectId !== 0) {
                    analytics.event({
                        category: 'project',
                        action: 'Load Project',
                        value: projectId,
                        nonInteraction: true
                    });
                }
            }
        }

        render () {
            const {
                projectId, // eslint-disable-line no-unused-vars
                ...componentProps
            } = this.props;
            if (!this.state.projectData) return null;
            if (!(this.state.user)) return (<Login />)
            return (
                <WrappedComponent
                    fetchingProject={this.state.fetchingProject}
                    projectData={this.state.projectData}
                    {...componentProps}
                />
            );
        }
    }
    ProjectLoaderComponent.propTypes = {
        projectId: PropTypes.string
    };

    return ProjectLoaderComponent;
};

export {
    ProjectLoaderHOC as default
};
