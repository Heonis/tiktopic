const btns = document.querySelectorAll(".nav-btn");
const views = document.querySelectorAll(".view1");
const signInButton = document.getElementById("sign-in-button");
const signInView = document.getElementById("sign-in-view");
const homeView = document.getElementById("home-view");
const userView = document.getElementById("user-view-btn");
const navigationItems = document.querySelector(".navigation-items");
const sliderNavigation = document.querySelector(".slider-navigation");
const homebtn = document.querySelector("#homebtn");
const userStatsView = document.getElementById("user-stats-view")


homebtn.addEventListener("click", () => {
    homeView.style.display = 'block';
    signInView.style.display = 'none';
    userStatsView.style.display = "none"
    document.getElementById("profile-view-content").style.display = 'none';
    sliderNav(0);
});

function displayProfile(user) {
    const profileBtn = document.createElement("span");
    profileBtn.id = "profile-view";
    profileBtn.textContent = "Profile";
    profileBtn.style.cursor = "pointer";
    profileBtn.addEventListener("click", () => {
        homeView.style.display = 'none';
        signInView.style.display = 'none';
        profileView.style.display = 'block';
        sliderNavigation.style.display = 'none';
        userStatsView.style.display = "none"
    });

    navigationItems.appendChild(profileBtn);

    const profileView = document.createElement("div");
    profileView.id = "profile-view-content";
    profileView.className = "view1";
    profileView.innerHTML = `
        <div id="profile-card">
            <div id="profile-card-upper">
                <img src="${user.picture}" alt="Profile Picture">
            </div>
            <h1>${user.firstName} ${user.lastName}</h1>
            <h2>Username: ${user.username}</h2>
            <p>WELCOME BACK!</p>
            <button id="delete-profile">Delete Profile</button>
        </div>
    `;
    document.querySelector(".home").appendChild(profileView);

    document.getElementById("delete-profile").addEventListener("click", () => {
        localStorage.removeItem('user');
        alert("Profile deleted!");
        profileBtn.remove();
        profileView.remove();
        homeView.style.display = 'block';
        sliderNavigation.style.display = 'flex';
    });

    homeView.style.display = 'none';
    signInView.style.display = 'none';
    profileView.style.display = 'block';
    sliderNavigation.style.display = 'none';
    userStatsView.style.display = "none"
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
    sliderNavigation.style.display = 'flex';
    userStatsView.style.display = "none"
}

btns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        sliderNav(i);
    });
});

signInButton.addEventListener("click", () => {
    homeView.style.display = 'none';
    signInView.style.display = 'block';
    sliderNavigation.style.display = 'none';
    userStatsView.style.display = "none"
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

userView.addEventListener("click", () => {
    homeView.style.display = "none";
    signInView.style.display = "none";
    sliderNavigation.style.display = "none";
    displayUserStatsView();
});

function displayUserStatsView() {
    userStatsView.innerHTML = `
        <h1>User Stats</h1>
        <input type="text" id="tiktoker-search" placeholder="Search for a TikToker" />
        <button id="search-button">Search</button>
        <div id="tiktoker-profile"></div>
    `;
    views.forEach((view) => {
        view.style.display = 'none';
    });
    userStatsView.style.display = 'block';

    document.getElementById("search-button").addEventListener("click", searchTiktokerHandler);

    const lastUserStats = JSON.parse(localStorage.getItem('lastUserStats'));
    if (lastUserStats) {
        displayTiktokerProfile(lastUserStats); // Display last user stats if available
    }
}

async function searchTiktokerHandler() {
    const username = document.getElementById("tiktoker-search").value;
    if (username) {
        try {
            const response = await fetch(`/search-tiktoker?username=${username}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const profile = await response.json();
            displayTiktokerProfile(profile);
            localStorage.setItem('lastUserStats', JSON.stringify(profile)); // Save last user stats
        } catch (error) {
            console.error(error);
            document.getElementById("tiktoker-profile").innerHTML = `<p>Error fetching TikToker data: ${error.message}</p>`;
        }
    }
}

function displayTiktokerProfile(profile) {
    const profileDiv = document.getElementById("tiktoker-profile");
    if (profile) {
        profileDiv.innerHTML = `
            <div id="tiktoker-profile-card">
                <div id="tiktoker-profile-card-upper">
                    <img src="${profile.user.avatarThumb}" alt="Profile Picture">
                </div>
                <h1>${profile.user.nickname}</h1>
                <p>Unique ID: ${profile.user.nickname}</>
                <p>Signature: ${profile.user.signature}</p>
                <p>isUnderAge18: ${profile.user.isUnderAge18}</p>
                <p>followerCount: ${profile.stats.followerCount}</p>
                <p>followingCount: ${profile.stats.followingCount}</p>
                <p>friendCount: ${profile.stats.friendCount}</p>
                <p>hearts: ${profile.stats.heart}</p>
                <p>videoCount: ${profile.stats.videoCount}</p>
            </div>
        `;
    } else {
        profileDiv.innerHTML = `<p>User not found or missing profile information</p>`;
    }
}

function hideUserStatsView() {
    const userStatsView = document.getElementById("user-stats-view");
    if (userStatsView) {
        userStatsView.style.display = 'none';
    }
}

// Check for saved user on page load
document.addEventListener("DOMContentLoaded", () => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
        displayProfile(savedUser);
    }
});
