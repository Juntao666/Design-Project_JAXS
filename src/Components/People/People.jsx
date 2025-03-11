import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
 
import { BACKEND_URL } from '../../constants';
import './People.css';

const PEOPLE_READ_ENDPOINT = `${BACKEND_URL}/people`;
const PEOPLE_CREATE_ENDPOINT = `${BACKEND_URL}/people/create`;
const PEOPLE_UPDATE_ENDPOINT = `${BACKEND_URL}/people/update`;
const ROLES_ENDPOINT = `${BACKEND_URL}/roles`

function AddPersonForm({
  visible,
  cancel,
  fetchPeople,
  setError,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRoles] = useState('');
  const [roleOptions, setRoleOptions] = useState({});

  const changeName = (event) => { setName(event.target.value); };
  const changeEmail = (event) => { setEmail(event.target.value); };
  const changeRole = (event) => { setRoles(event.target.value); };

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: name,
      email: email,
      roles: role,
      affiliation: '',
    }
    axios.put(PEOPLE_CREATE_ENDPOINT, newPerson)
      .then(fetchPeople)
      .catch((error) => { setError(`There was a problem adding the person. ${error}`); });
  };

  const getRoles = () => {
    axios.get(ROLES_ENDPOINT)
      .then(({ data }) => setRoleOptions(data))
      .catch((error) => { setError(`There was a problem gettingroles. ${error}`); });
  };

  useEffect(getRoles, []);

  if (!visible) return null;
  return (
    <form>
      <label htmlFor="name">
        Name
      </label>
      <input required type="text" id="name" value={name} onChange={changeName} />
      <label htmlFor="email">
        Email
      </label>
      <input required type="text" id="email" onChange={changeEmail} />
      <select required name='role' onChange={changeRole}>
        {
          Object.keys(roleOptions).map((code) => (
            <option key={code} value={code}>
              {roleOptions[code]}
            </option>
          ))
        }
      </select>
      <button type="button" onClick={cancel}>Cancel</button>
      <button type="submit" onClick={addPerson}>Submit</button>
    </form>
  );
}
AddPersonForm.propTypes = {
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  fetchPeople: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};

function UpdatePersonForm({
  person,
  visible,
  cancel,
  fetchPeople,
  setError,
}) {
  const [name, setName] = useState(person.name);
  const [email, setEmail] = useState(person.email);

  const changeName = (event) => { setName(event.target.value); };
  const changeEmail = (event) => { setEmail(event.target.value); };

  const updatePerson = (event) => {
    event.preventDefault();
    const updatedPerson = {
      name: name,
      email: email,
      roles: person.roles,
      affiliation: person.affiliation,
    };
    axios.post(PEOPLE_UPDATE_ENDPOINT, updatedPerson)
      .then(() => {
        fetchPeople();
        cancel();
      })
      .catch((error) => { setError(`There was a problem updating the person. ${error}`); });
  };

  if (!visible) return null;
  return (
    <form>
      <label htmlFor="name">
        Name
      </label>
      <input required type="text" id="name" value={name} onChange={changeName} />
      <label htmlFor="email">
        Email
      </label>
      <input required type="text" id="email" value={email} onChange={changeEmail} />
      <button type="button" onClick={cancel}>Cancel</button>
      <button type="submit" onClick={updatePerson}>Update</button>
    </form>
  );
}
UpdatePersonForm.propTypes = {
  person: propTypes.shape({
    name: propTypes.string.isRequired,
    email: propTypes.string.isRequired,
    roles: propTypes.string.isRequired,
    affiliation: propTypes.string.isRequired,
  }).isRequired,
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  fetchPeople: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};

function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      {message}
    </div>
  );
}
ErrorMessage.propTypes = {
  message: propTypes.string.isRequired,
};

function Person({ person, fetchPeople, setError}) {
  const [updatingPerson, setUpdatingPerson] = useState(false);

  const deletePerson = () => {
    axios.delete(`${PEOPLE_READ_ENDPOINT}/${person.email}`)
      .then(fetchPeople)
      .catch((error) => { setError(`There was a problem deleting the person. ${error}`); });
  };

  const showUpdatePersonForm = () => { setUpdatingPerson(true); };
  const hideUpdatePersonForm = () => { setUpdatingPerson(false); };

  const { name, email, roles } = person;
  return (
    <div>
      <Link to={name}>
        <div className="person-container">
          <h2>{name}</h2>
          <p>
            Email: {email}
          </p>
          <p>
            Role: {roles}
          </p>
        </div>
      </Link>
      <button onClick={deletePerson}>Delete person</button>
      <button onClick={showUpdatePersonForm}>Update</button>
      <UpdatePersonForm
        person={person}
        visible={updatingPerson}
        cancel={hideUpdatePersonForm}
        fetchPeople={fetchPeople}
        setError={setError}
      />
    </div>
  );
}
Person.propTypes = {
  person: propTypes.shape({
    name: propTypes.string.isRequired,
    email: propTypes.string.isRequired,
    roles: propTypes.string.isRequired,
    affiliation: propTypes.string.isRequired,
  }).isRequired,
  fetchPeople: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};

function peopleObjectToArray(Data) {
  const keys = Object.keys(Data);
  const people = keys.map((key) => Data[key]);
  return people;
}

function People() {
  const [error, setError] = useState('');
  const [people, setPeople] = useState([]);
  const [addingPerson, setAddingPerson] = useState(false);

  const fetchPeople = () => {
    axios.get(PEOPLE_READ_ENDPOINT)
      .then(({ data }) => { setPeople(peopleObjectToArray(data)); })
      .catch((error) => setError(`There was a problem retrieving the list of people. ${error}`));
  };

  const showAddPersonForm = () => { setAddingPerson(true); };
  const hideAddPersonForm = () => { setAddingPerson(false); };

  useEffect(fetchPeople, []);

  return (
    <div className="wrapper">
      <header>
        <h1>
          View All People
        </h1>
        <button type="button" onClick={showAddPersonForm}>
          Add a Person
        </button>
      </header>
      <AddPersonForm
        visible={addingPerson}
        cancel={hideAddPersonForm}
        fetchPeople={fetchPeople}
        setError={setError}
      />
      {error && <ErrorMessage message={error} />}
      {people.map((person) => (
        <Person
          key={person.email}
          person={person}
          fetchPeople={fetchPeople}
          setError={setError}
        />
      ))}
    </div>
  );
}

export default People;
