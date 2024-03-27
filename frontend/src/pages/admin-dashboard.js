import React from 'react';
import AdminDashboard from "../components/AdminDashboard/AdminDashboard";
import BasePage from './base-page';

class AdminPage extends React.Component {
    render() {
        return (
            <BasePage
                navigate={this.props.navigate}
                isLoginPage = {false}
                component={(props) => {
                    return  (
                        <AdminDashboard
                            {...props}
                        />
                    );
                }}
            />
        );
    }
}

export default AdminPage;
