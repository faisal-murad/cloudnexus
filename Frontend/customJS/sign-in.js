 
document.getElementById('signUpForm').addEventListener('submit', function (event) {
    event.preventDefault();

    console.log("Register API Called\n\n");
    // Get form data
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Create data object
    const data = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password
    };

    // Send POST request using Fetch API
    fetch('http://localhost:3020/api/user/register', {
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
            // Handle successful response
            console.log('Success:', data);
            sessionStorage.setItem('firstname', data.user.firstname);
            sessionStorage.setItem('user_id', data.user._id);
            console.log('First Name = ', data.firstname);
            sessionStorage.setItem('SID', data.SID);
            sessionStorage.setItem('email', email);
            
            sessionStorage.setItem('jwt', data.token); 
            

            console.log("Token\n\n\n", data.token);
            
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.log(JSON.stringify(data))
            // Handle error
            console.error('Error:', error);
        });
    }); 
    
    document.getElementById('signInForm').addEventListener('submit', function (event) {
        event.preventDefault();
        
        // Get form data 
        const errormsg = document.getElementById('errormsg');
        const email = document.getElementById('email1').value;
        const password = document.getElementById('password1').value;
        const loginData = {
            email,
            password
        };
        
        
        
        // Send POST request using Fetch API
        fetch('http://localhost:3020/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle successful response
            console.log('Executing JavaScript...');
            
            sessionStorage.setItem('firstname', data.firstname);
            console.log('First Name = ', data.firstname);
            sessionStorage.setItem('user_id', data.user_id);
            sessionStorage.setItem('email', email);
            sessionStorage.setItem('SID', data.SID);
            sessionStorage.setItem('jwt', data.token.replace(/\n/g, ''));  

 
            window.location.href = 'index.html';
            console.log('Success:', data);
        })
        .catch(error => {
            // Handle error 
            errormsg.innerHTML = "Email or password is wrong"
            console.error('Error:', error);
        });
}); 

function redirectToGoogleLogin() {
    // Redirect to the Google OAuth login page
    window.location.href = 'http://localhost:3020/auth/google';
}