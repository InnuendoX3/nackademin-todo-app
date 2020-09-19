# nackademin-todo-app

### On Heroku
https://boiling-ocean-30990.herokuapp.com/

### First time
First time log in using this credentials:
- username: Admin
- password: Admin

### API Specifikation

| Resurs | Metod | Detaljer |
| ------ | ------ | ------ |
| /login/ | POST | Register with username & password.Returns JWT-token Authorization-header. |
| /gdpr/ | GET | Return Privacy Policy (HTML) |
| /gdpr/show-me-my-data | GET | Return user info, checklists and todos |
| /gdpr/forget-me-please | DELETE | Delete all the user info, checklists and todos |
| /users/ | GET | Return all users (Admin) |
| /users/ | GET | Return all users (Admin) |
| /users/:id | GET | Return a user (Admin all / User himself) |
| /users/ | POST | Create a user [username, password, role] (Admin) |
| /users/:id | DELETE | Delete user (Admin all / User himself) |
| /users/:id | PATCH | Update user (Admin all / User himself) |
| /checklists/ | GET | Return all checklists (Admin all / User his own) |
| /checklists/:id | GET | Return a checklist (Admin all / User his own) |
| /checklists/ | POST | Create a checklist [title] |
| /checklists/:id | DELETE | Delete checklist (Admin all / User his own) |
| /checklists/:id | PATCH | Update checklist (Admin all / User his own) |
| /todos/ | GET | Return all todos (Admin all / User his own) |
| /todos/:id | GET | Return a todo (Admin all / User his own) |
| /todos/ | POST | Create a todo [title, listedOn (Must be a checklistId) |
| /todos/:id | DELETE | Delete todo (Admin all / User his own) |
| /todos/:id | PATCH | Update todo (Admin all / User his own) |


### Auth End-Point Response
```js
{
  token: "SomEKiNdoFTokEn"
}
```

### Models

#### User

```javascript
 {
    _id: '29y7gbbZk1u4ABnv',
    username: 'Pepito Perez',
    hashedPass: 'ahAsHEdPasS',
    role: 'admin' / 'user'
} 
```

#### Checklist
```javascript
 {
    _id: '39y7gbbZk1u4ABnv',
    title: 'Some title',
    ownerId: 'B9y7gbbZk1u4ABnv'
} 
```

#### Todo
```javascript
 {
    _id: '49y7gbbZk1u4ABnv'
    title: 'Some title',
    isDone: true / false
    ownerId: 'B9y7gbbZk1u4ABnv',
    listedOn: '39y7gbbZk1u4ABnv'

} 
```