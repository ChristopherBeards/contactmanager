import React, { Component } from 'react';
import axios from 'axios';

const Context = React.createContext();

/* 
The reducer takes in action types and returns the updated state.
*/
const reducer = (state, action) => {
  switch (action.type) {
    case 'DELETE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.filter(
          contact => contact.id !== action.payload,
        ),
      };
    case 'ADD_CONTACT':
      return {
        ...state,
        contacts: [action.payload, ...state.contacts],
      };
    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map(
          contact =>
            contact.id === action.payload.id
              ? (contact = action.payload)
              : contact,
        ),
      };
    default:
      return state;
  }
};

/*
The Provider wraps around every other component
and is where the global state is stored.
*/
export class Provider extends Component {
  // Dispatch here becomes a part of state and can be called anywhere.
  state = {
    contacts: [],
    dispatch: action => this.setState(state => reducer(state, action)),
  };

  async componentDidMount() {
    const res = await axios.get('http://jsonplaceholder.typicode.com/users');

    this.setState({
      contacts: res.data,
    });
  }

  render() {
    return (
      // Anything we want available throughout the app we place into a property called value
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

// We use the Consumer in any component we want to access the state or actions
export const Consumer = Context.Consumer;
