import React from 'react';
import BasePage from './base-page';
import CollabComponent from '../components/CollabComponent/CollabComponent';

class CollabPage extends React.Component {
    render() {
        return (
            <BasePage
                navigate={this.props.navigate}
                component={(props) => {
                    return (
                        <CollabComponent
                        {...props}
                    />
                    );
                }}
            />
        );
    }
}

export default CollabPage;