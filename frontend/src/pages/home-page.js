import React from 'react';
import BasePage from './base-page';
import HomeComponent from '../components/HomeComponent/HomeComponent';

class HomePage extends React.Component {
    render() {
        return (
            <BasePage
                navigate={this.props.navigate}
                component={(props) => {
                    return (
                        <HomeComponent
                        {...props}
                    />
                    );
                }}
            />
        );
    }
}

export default HomePage;
