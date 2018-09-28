import classNames from 'classnames';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import firebase from 'firebase';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import Menu from '../../containers/menu.jsx';
import FirebaseProjectLoader from '../../customComponents/firebase-project-loader.jsx';
import UserBar from '../../customComponents/user-bar.jsx';
import logo from './logo.png';

import {
    openFileMenu,
    closeFileMenu,
    fileMenuOpen,
    openEditMenu,
    closeEditMenu,
    editMenuOpen
} from '../../reducers/menus';

import styles from './menu-bar.css';

// import mystuffIcon from './icon--mystuff.png';
import profileIcon from './icon--profile.png';
// import communityIcon from './icon--see-community.svg';
// import dropdownCaret from '../language-selector/dropdown-caret.svg';

const MenuBarItemTooltip = ({
    children,
    className,
    id,
    place = 'bottom'
}) => (
    <ComingSoonTooltip
        className={classNames(styles.comingSoon, className)}
        place={place}
        tooltipClassName={styles.comingSoonTooltip}
        tooltipId={id}
    >
        {children}
    </ComingSoonTooltip>
);

MenuBarItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    id: PropTypes.string,
    place: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
};

const MenuItemTooltip = ({id, children, className}) => (
    <ComingSoonTooltip
        className={classNames(styles.comingSoon, className)}
        place="right"
        tooltipClassName={styles.comingSoonTooltip}
        tooltipId={id}
    >
        {children}
    </ComingSoonTooltip>
);

MenuItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    id: PropTypes.string
};

const MenuBarMenu = ({
    children,
    onRequestClose,
    open,
    place = 'right'
}) => (
    <Menu
        className={styles.menu}
        open={open}
        place={place}
        onRequestClose={onRequestClose}
    >
        {children}
    </Menu>
);

MenuBarMenu.propTypes = {
    children: PropTypes.node,
    onRequestClose: PropTypes.func,
    open: PropTypes.bool,
    place: PropTypes.oneOf(['left', 'right'])
};


class MenuBar extends React.Component {
    constructor (props){
        
        super(props);
        
    }
    render (){
        return (
            <Box className={styles.menuBar}>
                <div className={styles.mainMenu}>
                        <div className={classNames(styles.menuBarItem)}>
                            <img
                                alt="Scratch"
                                className={styles.scratchLogo}
                                draggable={false}
                                src={logo}
                            />
                        </div>
                <FirebaseProjectLoader />
                
                </div>                
                <UserBar/>
            </Box>

        );
    }
}

MenuBar.propTypes = {
    editMenuOpen: PropTypes.bool,
    fileMenuOpen: PropTypes.bool,
    onClickEdit: PropTypes.func,
    onClickFile: PropTypes.func,
    onRequestCloseEdit: PropTypes.func,
    onRequestCloseFile: PropTypes.func
};

const mapStateToProps = state => ({
    fileMenuOpen: fileMenuOpen(state),
    editMenuOpen: editMenuOpen(state)
});

const mapDispatchToProps = dispatch => ({
    onClickFile: () => dispatch(openFileMenu()),
    onRequestCloseFile: () => dispatch(closeFileMenu()),
    onClickEdit: () => dispatch(openEditMenu()),
    onRequestCloseEdit: () => dispatch(closeEditMenu())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuBar);
