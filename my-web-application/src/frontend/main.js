// import TikAPI from 'tikapi';

// const api = TikAPI("s64wichcgCk0fHDQbsKHlQXIxZv8kr4z02I39lgVf3uTT3Pj");

// api.set({
//     $sandbox: true
// });

// await api.public.check({
//     username: "lilyachty"
// })

const btns = document.querySelectorAll(".nav-btn");
const views = document.querySelectorAll(".view1");
const signInButton = document.getElementById("sign-in-button");
const signInView = document.getElementById("sign-in-view");
const homeView = document.getElementById("home-view");
const navigationItems = document.querySelector(".navigation-items");
const sliderNavigation = document.querySelector(".slider-navigation");


function displayProfile(user) {
    // Create the profile button in the header
    const profileBtn = document.createElement("span");
    profileBtn.id = "profile-view";
    profileBtn.textContent = "Profile";
    profileBtn.style.cursor = "pointer";
    profileBtn.addEventListener("click", () => {
        homeView.style.display = 'none';
        signInView.style.display = 'none';
        profileView.style.display = 'block';
        sliderNavigation.style.display = "none"
    });

    navigationItems.appendChild(profileBtn);

    // Create the profile view
    const profileView = document.createElement("div");
    profileView.id = "profile-view-content";
    profileView.className = "view1";
    profileView.innerHTML = `
        <div id="profile-card">
        <h1>Profile</h1>
        <p>First Name: ${user.firstName}</p>
        <p>Last Name: ${user.lastName}</p>
        <p>Username: ${user.username}</p>
        <img src="${user.picture}" alt="Profile Picture" style="width: 100px; height: 100px;">
        <button id="delete-profile">Delete Profile</button>
        </div>
    `;
    document.querySelector(".home").appendChild(profileView);

    // Add delete profile functionality
    document.getElementById("delete-profile").addEventListener("click", () => {
        localStorage.removeItem('user');
        alert("Profile deleted!");

        // Remove profile button and view
        profileBtn.remove();
        profileView.remove();

        // Redirect to home view
        homeView.style.display = 'block';
        sliderNavigation.style.display = 'block';
    });

    // Show profile view if already logged in
    homeView.style.display = 'none';
    signInView.style.display = 'none';
    profileView.style.display = 'block';
    sliderNavigation.style.display = 'none';
}

var sliderNav = function(manual) {
    btns.forEach((btn) => {
        btn.classList.remove("active");
    });

    views.forEach((view) => {
        view.style.display = 'none';
    });

    btns[manual].classList.add("active");
    document.getElementById(btns[manual].getAttribute('data-view')).style.display = 'block';
    sliderNavigation.style.display = 'block';
}

btns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        sliderNav(i);
    });
});

document.getElementById("user-view-btn").addEventListener("click", () => {
    homeView.style.display = 'none';
    signInView.style.display = 'none';
    document.getElementById("user-view").style.display = 'block';
    sliderNavigation.style.display = 'none';
});

document.getElementById("hashtag-view-btn").addEventListener("click", () => {
    homeView.style.display = 'none';
    signInView.style.display = 'none';
    document.getElementById("hashtag-view").style.display = 'block';
    sliderNavigation.style.display = 'none';
});

document.getElementById("music-view-btn").addEventListener("click", () => {
    homeView.style.display = 'none';
    signInView.style.display = 'none';
    document.getElementById("music-view").style.display = 'block';
    sliderNavigation.style.display = 'none';
});

signInButton.addEventListener("click", () => {
    homeView.style.display = 'none';
    signInView.style.display = 'block';
    sliderNavigation.style.display = 'none';
});

document.getElementById("sign-in-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const username = document.getElementById("username").value;
    const picture = document.getElementById("picture").files[0];

    const reader = new FileReader();
    reader.onloadend = function () {
        const user = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            picture: reader.result
        };

        localStorage.setItem('user', JSON.stringify(user));
        alert("User information saved!");

        displayProfile(user);
    };

    if (picture) {
        reader.readAsDataURL(picture);
    }
});

// Check for saved user on page load
document.addEventListener("DOMContentLoaded", () => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
        displayProfile(savedUser);
    }
});