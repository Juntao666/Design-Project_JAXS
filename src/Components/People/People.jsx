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
  roleOptions,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [success, setSuccess] = useState(false);
//   const [roleOptions, setRoleOptions] = useState({});

  const changeName = (event) => { setName(event.target.value); };
  const changeEmail = (event) => { setEmail(event.target.value); };
  const changeRole = (event) => { setRole(event.target.value); };

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: name,
      email: email,
      roles: role,
      affiliation: '',
    }
    axios.put(PEOPLE_CREATE_ENDPOINT, newPerson)
      .then(() => {
        fetchPeople();
        setSuccess(true);
        setName('');
        setEmail('');
        setRole('');
        setTimeout(() => setSuccess(false), 3000);
      })
      .catch((error) => { setError(`There was a problem adding the person. ${error}`); });
  };

//   const getRoles = () => {
//     axios.get(ROLES_ENDPOINT)
//       .then(({ data }) => setRoleOptions(data))
//       .catch((error) => { setError(`There was a problem getting roles. ${error}`); });
//   };
//
//   useEffect(getRoles, []);

  if (!visible) return null;
  return (
    <form>
      {success && <div className="success-message">Person added successfully!</div>}
      <label htmlFor="name">
        Name
      </label>
      <input required type="text" id="name" value={name} onChange={changeName} />
      <label htmlFor="email">
        Email
      </label>
      <input required type="text" id="email" value={email} onChange={changeEmail} />
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
  roleOptions: propTypes.object.isRequired,
  setError: propTypes.func.isRequired,
};

function UpdatePersonForm({
  person,
  visible,
  cancel,
  fetchPeople,
  setError,
  roleOptions,
}) {
  const [name, setName] = useState(person.name);
  const [selectedRoles, setSelectedRoles] = useState(person.roles);

  const changeName = (event) => setName(event.target.value);
  const changeRoles = (event) => {
    const values = Array.from(event.target.selectedOptions, o => o.value);
    setSelectedRoles(values);
  };

  const updatePerson = (event) => {
    event.preventDefault();
    const updatedPerson = {
      name: name,
      email: person.email,
      roles: selectedRoles,
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
    <form onSubmit={updatePerson}>
      <label htmlFor="name">Name</label>
      <input required type="text" id="name" value={name} onChange={changeName} />

      <label htmlFor="roles">Roles</label><br/>
      <select
        multiple
        required
        id="roles"
        value={selectedRoles}
        onChange={changeRoles}
      >
        {Object.entries(roleOptions).map(([code, label]) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>

      <button type="button" onClick={cancel}>
        Cancel
      </button>
      <button type="submit">Update</button>
    </form>
  );
}

UpdatePersonForm.propTypes = {
  person: propTypes.shape({
    name: propTypes.string.isRequired,
    email: propTypes.string.isRequired,
    roles: propTypes.arrayOf(propTypes.string).isRequired,
    affiliation: propTypes.string.isRequired,
  }).isRequired,
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  fetchPeople: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
  roleOptions: propTypes.object.isRequired,
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

function Person({ person, fetchPeople, setError, roleMap, }) {
  const [updatingPerson, setUpdatingPerson] = useState(false);

  const deletePerson = () => {
    const userId = localStorage.getItem('username');
    const encodedEmail = encodeURIComponent(person.email);

    axios
      .delete(
        `${PEOPLE_READ_ENDPOINT}/${encodedEmail}/${userId}`
      )
      .then(fetchPeople)
      .catch((error) => {
        setError(`There was a problem deleting the person. ${error}`);
      });
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
            Role: {roles.length > 0 ? roles.map((role) => roleMap[role]).join(', ') : 'none'}
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
        roleOptions={roleMap}
      />
    </div>
  );
}
Person.propTypes = {
  person: propTypes.shape({
    name: propTypes.string.isRequired,
    email: propTypes.string.isRequired,
    affiliation: propTypes.string.isRequired,
    roles: propTypes.arrayOf(propTypes.string).isRequired,
  }).isRequired,
  fetchPeople: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
  roleMap: propTypes.object.isRequired,
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
  const [roleMap, setRoleMap] = useState({});

  const fetchPeople = () => {
    axios.get(PEOPLE_READ_ENDPOINT)
      .then(({ data }) => { setPeople(peopleObjectToArray(data)); })
      .catch((error) => setError(`There was a problem retrieving the list of people. ${error}`));
  };

  const getRoles = () => {
    axios.get(ROLES_ENDPOINT)
      .then(({ data }) => setRoleMap(data))
      .catch((error) => { setError(`There was a problem getting roles. ${error}`); });
  }

  const showAddPersonForm = () => { setAddingPerson(true); };
  const hideAddPersonForm = () => { setAddingPerson(false); };

  useEffect(fetchPeople, []);
  useEffect(getRoles, []);

  return (
    <>
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
          roleOptions={roleMap}
        />
        {error && <ErrorMessage message={error} />}
        {people.map((person) => (
          <Person
            key={person.email}
            person={person}
            fetchPeople={fetchPeople}
            setError={setError}
            roleMap={roleMap}
          />
        ))}
      </div>
      <div className="white-space"></div>
    </>
  );
}

export default People;
