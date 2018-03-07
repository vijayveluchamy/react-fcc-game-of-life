import React, { Component } from 'react';
import AddRecipeButton from '../components/AddRecipeButton';
import RecipeList from '../components/RecipeList';
import store from '../redux/store';

export default class RecipeBox extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div id='main-container'>
                <div id="app-header-container">
                    <header id='app-header'>Recipe Box</header>
                </div>
                <AddRecipeButton store={store} />
                <RecipeList store={store} />
            </div>

        );
    }
}