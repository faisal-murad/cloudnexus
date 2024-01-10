const userName = sessionStorage.getItem('firstname');

const welcomeMsg = document.getElementById('welcomeUser');
const profileMsg = document.getElementById('profileMsg');

welcomeMsg.innerText = "Welcome Back " + userName + "!";
profileMsg.innerText = "Hello " + userName;

const signout = document.getElementById('signout');

signout.addEventListener('click', function (event) {
    event.preventDefault();
    sessionStorage.clear();

    window.location.href = "sign-in.html";

})
const printScreen = () => {
    window.print();
}


// document.addEventListener("DOMContentLoaded", function () {


//     const handleDelete = async (serverId) => {
//         try {
//             const response = await fetch(`http://localhost:3020/api/user/deleteServer/${serverId}`, {
//                 method: "DELETE",
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//             });

//             if (response.ok) {
//                 console.log('Server deleted successfully');
//             } else {
//                 console.error('Failed to delete server:', response.status, response.statusText);
//             }
//         } catch (error) {
//             console.error('Error during delete request:', error);
//         }
//     };



//     let servers;
//     const toSend = {
//         _id: sessionStorage.getItem('user_id')
//     };

//     console.log("dfadfadsfa\n\n" + sessionStorage.getItem('user_id') + '\n\n\n\n');

//     fetch('http://localhost:3020/api/user/getServers', {
//         method: "POST",
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(toSend)
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             servers = data;
//             console.log('Success:', servers);

//             const tableBody = document.querySelector('#serverTable');
//             let html = "";

//             servers.forEach(server => {


//                 const createdAt = new Date(server.createdAt).toLocaleDateString();
//                 // const createdAt = new Date(server.createdAt);
//                 // const currentDateTime = new Date();

//                 // const timeDifference = currentDateTime - createdAt;

//                 // // Convert milliseconds to seconds
//                 // const seconds = Math.floor(timeDifference / 1000);

//                 // // Define the thresholds for different time units
//                 // const thresholds = {
//                 //    year: 31536000,
//                 //    month: 2592000,
//                 //    day: 86400,
//                 //    hour: 3600,
//                 //    minute: 60,
//                 // };

//                 // // Determine the appropriate human-readable format based on the duration
//                 // let durationText;

//                 // for (const [unit, threshold] of Object.entries(thresholds)) {
//                 //    const value = Math.floor(seconds / threshold);
//                 //    if (value >= 1) {
//                 //       durationText = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-value, unit);
//                 //       break;
//                 //    }
//                 // }

//                 html += `<tr id="serverTemplate" data-id="${server.id}">
//                           <td>
//                               <div class="avatar-40 text-center rounded-circle iq-bg-danger position-relative">
//                                   <span class="font-size-20 align-item-center"><i class="fa fa-user"
//                                           aria-hidden="true"></i><span class="bg-success dots"></span></span>
//                               </div>
//                           </td>
//                           <td>
//                               <h6 id="serverName">${server.serverName}</h6>
//                               <span id="serverDetails" class="text-body font-weight-400">
//                                   ${server.cpuUsage}</span>
//                           </td>
//                           <td id="serverIP">${server.ipAddress}</td>
//                           <td id="serverTime">${createdAt}</td>
//                           <td>
//                               <div id="serverTag" class="text-danger">${server.tag}</div>
//                           </td>
//                           <td></td>
//                           <td>
//                               <span class="text-black font-size-24" id="dropdownMenuButton3"
//                                   style="cursor: pointer;" data-toggle="dropdown">
//                                   <i class="ri-more-fill"></i>
//                               </span>
//                               <div class="dropdown-menu dropdown-menu-right shadow-none"
//                                   aria-labelledby="dropdownMenuButton3">
//                                   <a class="dropdown-item" href="#"><i class="ri-eye-fill mr-2"></i>View</a>
//                                   <a class="dropdown-item" href="#" id="deleteButton" onClick="handleDelete('${server._id}')"><i
//                                           class="ri-delete-bin-6-fill mr-2"></i>Delete</a>
//                                   <a class="dropdown-item" href="#"><i class="ri-pencil-fill mr-2"></i>Edit</a>
//                                   <a class="dropdown-item" href="#"><i
//                                           class="ri-printer-fill mr-2"></i>Print</a>
//                                   <a class="dropdown-item" href="#"><i
//                                           class="ri-file-download-fill mr-2"></i>Download</a>
//                               </div>
//                           </td>
//                       </tr>`;
//             });

//             tableBody.innerHTML = html;


//             const deleteButton = document.getElementById("deleteButton");
//             deleteButton.addEventListener("click", handleDelete);
//         })
//         .catch(error => {
//             // Handle error  
//             console.error('Error:', error);
//         });
// });


