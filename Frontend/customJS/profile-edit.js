 
const userEmail = sessionStorage.getItem("email");

const uname = document.getElementById('uname');
uname.style.backgroundColor = 'transparent';
uname.style.cursor = 'no-drop';

const fname = document.getElementById('fname');
const lname = document.getElementById('lname');

let fetchedData;
let data = {
   email: userEmail,
}

fetch('http://localhost:3020/api/user/FindOneUser', {
   method: 'POST',
   headers: {
      'Content-Type': 'application/json'
   },
   body: JSON.stringify(data)
})
   .then(response => {
      if (!response.ok) {
         throw new Error('Network response was not ok');
         console.log(JSON.stringify(data))
      }
      return response.json();
   })
   .then(data => {
      console.log('Success FindOneUser', data);
      fetchedData = data;
      fname.value = fetchedData.firstname;
      lname.value = fetchedData.lastname;
      uname.value = fetchedData.email;
   })
   .catch(error => {
      console.log(JSON.stringify(data));
      console.error('Error: ', error);
   })


 document.getElementById('changePassword').addEventListener('submit', function(event){
    event.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const verifyPassword = document.getElementById('verifyPassword').value;
    const changePassResult = document.getElementById('changePassResult');

    const userEmail = sessionStorage.getItem('email');

    if(newPassword!==verifyPassword)
    {
        changePassResult.innerHTML = "Your new password and verify password don't match.";
    }
    
    let data ={
        email:userEmail,
        currentPassword,
        newPassword,
        verifyPassword,
    }
    const jwtToken = sessionStorage.getItem('jwt');

    fetch('http://localhost:3020/api/user/changePassword',{
        method:'POST',
        headers:{
            'Authorization': 'Bearer ' + jwtToken,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data) 
    })
    .then(response=>{
        if (!response.ok) { 
            throw new Error('Network response was not ok');
        } 
        return response.json();
    })
    .then(data => {
        // Handle successful response
        console.log('Executing JavaScript...');
        changePassResult.innerHTML = data.message; 
        console.log('Success:', data);
    })
    .catch(error => {
        // Handle error  
        console.error('Error:', error);
        changePassResult.innerHTML = 'Current Password not correct';
    });

 })