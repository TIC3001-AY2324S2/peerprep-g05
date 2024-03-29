import React from 'react';
import AdminDashboard from "../components/AdminDashboard/AdminDashboard";
import BasePage from './base-page';

export default function AdminPage(props) {

    console.log("userInfo", props.userInfo)
    if (props.userInfo && props.userInfo.isAdmin === false) {
        props.navigate('/home');
    }
    return (

        <BasePage
            navigate={props.navigate}
            isLoginPage={false}
            component={(props) => {
                return (
                    <AdminDashboard
                        {...props}
                    />
                );
            }}
        />
    );

}
