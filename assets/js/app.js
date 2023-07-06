'use strict';

// import { fetchData, url } from './api.js';
// import * as module from './module.js';

/**
 * 
 * @param {NodeList} elements 
 * @param {string} eventType Event type e.g: 'click', 'mouseover'
 * @param {*} callback 
 */
const addEventOnElements = function(elements, eventType, callback){
    for (const element of elements) element.addEventListener(eventType, callback);
}

// Toggle search

const searchView = document.querySelector('[data-search-view]');
const searchToggles = document.querySelectorAll('[data-search-toggler]');

const toggleSearch = () => searchView.classList.toggle('active');
addEventOnElements(searchToggles, 'click', toggleSearch)

