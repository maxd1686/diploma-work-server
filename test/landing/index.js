const state = document.getElementById('req_state');
const fieldName = document.getElementById('field_name');
const fieldSurname = document.getElementById('field_surname');
const fieldEmail = document.getElementById('field_email');
const fieldPassword = document.getElementById('field_password');
const fieldDataPost = document.getElementById('data_post');
const button = document.getElementById('button_login');
const buttonSignIn = document.getElementById('button_sign_in');
const buttonPost = document.getElementById('button_send');
const buttonGet = document.getElementById('button_get') 
const title = document.getElementById('status');
const fields = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
}
let dataField = '';
const dataList = [];
const host = 'http://localhost:3001';
let token = '';

function changeField(type, e) {
  fields[type] = e.target.value;
}

function sendAuthData() {
  fetch(`${host}/sign_up`, 
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Accept": 'application/json',
    },
    body: JSON.stringify(fields),
  })
    .then(res => res.json())
    .then(res => showStateResponse(res))
    .catch(err => console.log(err));
}

function signIn() {
  fetch(`${host}/sign_in`, 
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Accept": 'application/json',
    },
    body: JSON.stringify({ email: fields.email, password: fields.password }),
  })
    .then(res => res.json())
    .then(res => showStateResponse(res))
    .catch(err => console.log(err));
}

function postData() {
  fetch(`${host}/post_data`, 
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Accept": 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify({ data: dataField }),
  })
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.log(err));
}

function getData() {
  fetch(`${host}/get_data`, 
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Accept": 'application/json',
      'Authorization': 'Bearer ' + token,
    },
  })
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.log(err));
}

function showStateResponse(res) {
  token = res.token;
  title.innerHTML = res.status;
}

buttonGet.addEventListener('click', () => getData());
buttonPost.addEventListener('click', () => postData());
fieldDataPost.addEventListener('change', (e) => dataField = e.target.value)
button.addEventListener('click', () => sendAuthData());
fieldName.addEventListener('change', (e) => changeField('firstName', e));
fieldSurname.addEventListener('change', (e) => changeField('lastName', e));
fieldEmail.addEventListener('change', (e) => changeField('email', e));
fieldPassword.addEventListener('change', (e) => changeField('password', e));
buttonSignIn.addEventListener('click', (e) => signIn());