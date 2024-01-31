
function logoutUser(){
    
fetch('/logoutUser', {
    method: 'GET', // Use the GET method as specified in your route
    credentials: 'same-origin', // Include cookies in the request
  })
  .then(response => {
    if (response.ok) {
      // Successful logout
      console.log('User logged out successfully');
      // Optionally, redirect the user to a different page
      window.location.href = '/';
    } else {
      // Error handling for failed logout
      console.error('Failed to log out user');
    }
  })
  .catch(error => {
    // Error handling for network errors or other issues
    console.error('Error logging out user:', error);
  });
  
}