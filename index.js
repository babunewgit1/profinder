const form = document.querySelector('#search');
const profilehtml = document.querySelector('.profile');
const repos = document.querySelector('.repos');
const notFound = document.querySelector('.notFound');
const userDit = document.querySelector('.user-details');
const loader = document.querySelector('.loader');

//! fetching api.
const clientId = '762ee486a836da8b6820';
const clientSerect = 'fab26f88225666845318e67f87c111cd68bfd1d5';

async function getData (name) {
   const apiUrl = await fetch(`https://api.github.com/users/${name}?client_id=${clientId}&client_secret=${clientSerect}`);
   const profile = await apiUrl.json();
   return profile;
}

//! dealing with search button.
form.addEventListener('submit', async(e)=> {
   e.preventDefault();
   let inpValue = document.querySelector('#findByUsername').value;
   
   if(inpValue) {
      loader.style.display = 'block';
      notFound.style.display = 'none';
      userDit.style.display = 'none';
      const dataStore = await getData (inpValue);
      loader.style.display = 'none';
      if (dataStore.message === 'Not Found') {
         notFound.style.display = 'block';
         userDit.style.display = 'none';
      } else {
         const repoStore = await repo(dataStore);
         showDataUi (dataStore);
         repolist(repoStore);
         notFound.style.display = 'none';
         userDit.style.display = 'flex';
      }      
   }
   resetFrom();
});

//! showing userdata in html.
function showDataUi (data) {
   profilehtml.innerHTML = `
   <div class="profileData">
      <img
      src="${data.avatar_url}"
      alt="letstrie" />
      <p class="name">${data.name}</p>
      <p class="username login">${data.login}</p>
      <p class="bio">
         ${data.bio}
      </p>

      <div class="followers-stars">
      <p>
         <ion-icon name="people-outline"></ion-icon>
         <span class="followers"> ${data.followers} </span> followers
      </p>
      <span class="dot">·</span>
      <p><span class="following"> ${data.following} </span> following</p>
      </div>

      <p class="company">
      <ion-icon name="business-outline"></ion-icon>
         ${data.company}
      </p>
      <p class="location">
         <ion-icon name="location-outline"></ion-icon> 
         ${data.location}
      </p>
   </div>
   `
}

//! fetch api for repositories.
async function repo(repoUser) {
   const repoApi = await fetch(`${repoUser.repos_url}?client_id=${clientId}&client_secret=${clientSerect}&per_page=10`);
   const repoLink = await repoApi.json();
   return repoLink;
}

//! show repolist in html.
function repolist (repoArray) {
   for (let repoSingle of repoArray) {
      repos.insertAdjacentHTML('afterbegin', `
      <div class="repo">
         <div class="repo_name">
         <a href="${repoSingle.html_url}">${repoSingle.name}</a>
         </div>
         <p>
         <span class="circle"></span> ${repoSingle.language}
         <ion-icon name="star-outline"></ion-icon> ${repoSingle.watchers}
         <ion-icon name="git-branch-outline"></ion-icon> ${repoSingle.forks_count}
         </p>
      </div>
      `);
   }
   
}

//! reset form after submitting.
function resetFrom() {
   document.querySelector('#findByUsername').value = ''
};