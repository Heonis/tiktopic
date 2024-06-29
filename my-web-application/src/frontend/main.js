/*
    1. Element Selection:
        - Selects various HTML elements such as buttons, views, and navigation items using `document.querySelector` and `document.querySelectorAll`.

    2. Event Listeners:
        - Sets up event listeners for the home button, navigation buttons, and sign-in button to handle view transitions and user interactions.

    3. Function Definitions:
        - displayProfile(user): Dynamically creates and displays the user's profile view based on the provided user object.
        - sliderNav(manual): Manages the active state of navigation buttons and displays the corresponding view based on user selection.
        - displayUserStatsView(): Sets up and displays the User Stats view with a search input and button to fetch TikTok user data.
        - displayMusicStatsView(): Sets up and displays the Music Stats view with a search input and button to fetch TikTok music data.
        - displayHashtagStatsView(): Sets up and displays the Hashtag Stats view with a search input and button to fetch TikTok hashtag data.
        - searchTiktokerHandler(): Fetches and displays TikTok user data based on the search input.
        - searchMusicHandler(): Fetches and displays TikTok music data based on the search input.
        - searchHashtagHandler(): Fetches and displays TikTok hashtag data based on the search input.
        - displayTiktokerProfile(profile): Displays the fetched TikTok user profile data.
        - displayMusicProfile(musicInfo): Displays the fetched TikTok music data.
        - displayHashtagProfile(hashtagInfo): Displays the fetched TikTok hashtag data.

    4. Local Storage Management:
        - Saves and retrieves user, user stats, music stats, and hashtag stats from local storage to persist data across sessions.
        - Handles profile deletion and clears local storage.

    5. Initialization
        - Checks for saved user data, user stats, music stats, and hashtag stats in local storage on page load and displays them if available.
*/

// Selecting elements from the DOM
const btns = document.querySelectorAll(".nav-btn");
const views = document.querySelectorAll(".view1");
const signInButton = document.getElementById("sign-in-button");
const signInView = document.getElementById("sign-in-view");
const homeView = document.getElementById("home-view");
const userView = document.getElementById("user-view-btn");
const musicView = document.getElementById("music-view-btn");
const hashtagView = document.getElementById("hashtag-view-btn");
const navigationItems = document.querySelector(".navigation-items");
const sliderNavigation = document.querySelector(".slider-navigation");
const homebtn = document.querySelector("#homebtn");
const userStatsView = document.getElementById("user-stats-view");
const musicStatsView = document.getElementById("music-stats-view");
const hashtagStatsView = document.getElementById("hashtag-stats-view");

// Home button event listener
homebtn.addEventListener("click", () => {
    homeView.style.display = 'block';
    signInView.style.display = 'none';
    userStatsView.style.display = "none";
    musicStatsView.style.display = 'none';
    hashtagStatsView.style.display = 'none';
    const profileView = document.getElementById("profile-view-content");
    if (profileView) {
        profileView.style.display = 'none';
    }
    sliderNav(0); // Activate first navigation button
});

// Function to display profile
async function displayProfile(user) {
    const profileBtn = document.createElement("span");
    profileBtn.id = "profile-view";
    profileBtn.textContent = "Profile";
    profileBtn.style.cursor = "pointer";
    profileBtn.addEventListener("click", () => {
        homeView.style.display = 'none';
        signInView.style.display = 'none';
        const profileView = document.getElementById("profile-view-content");
        profileView.style.display = 'block';
        sliderNavigation.style.display = 'none';
        userStatsView.style.display = "none";
        musicStatsView.style.display = 'none';
        hashtagStatsView.style.display = 'none';
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

    document.getElementById("delete-profile").addEventListener("click", async () => {
        try {
            const response = await fetch(`/tiktok-users/${user._id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            localStorage.clear();
            alert("Profile deleted!");
            profileBtn.remove();
            profileView.remove();
            homeView.style.display = 'block';
            sliderNavigation.style.display = 'flex';
        } catch (error) {
            alert('Error deleting profile!');
            console.error(error);
        }
    });

    homeView.style.display = 'none';
    signInView.style.display = 'none';
    profileView.style.display = 'block';
    sliderNavigation.style.display = 'none';
    userStatsView.style.display = "none";
    musicStatsView.style.display = 'none';
    hashtagStatsView.style.display = 'none';
}

// Function for slider navigation
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
    userStatsView.style.display = "none";
    musicStatsView.style.display = 'none';
    hashtagStatsView.style.display = 'none';
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
    userStatsView.style.display = "none";
    musicStatsView.style.display = 'none';
    hashtagStatsView.style.display = 'none';
});

document.getElementById("sign-in-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const username = document.getElementById("username").value;
    const picture = document.getElementById("picture").files[0];

    const reader = new FileReader();
    reader.onloadend = async function () {
        const user = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            picture: reader.result
        };

        try {
            const response = await fetch('/tiktok-users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            user._id = result.response.id;
            user._rev = result.response.rev;
            localStorage.setItem('user', JSON.stringify(user));
            alert("User information saved!");
            displayProfile(user);
        } catch (error) {
            alert('Error saving user information!');
            console.error(error);
        }
    };

    if (picture) {
        reader.readAsDataURL(picture);
    }
});

userView.addEventListener("click", () => {
    homeView.style.display = "none";
    signInView.style.display = "none";
    sliderNavigation.style.display = "none";
    musicStatsView.style.display = "none";
    hashtagStatsView.style.display = 'none';
    const profileView = document.getElementById("profile-view-content");
    if (profileView) {
        profileView.style.display = 'none';
    }
    displayUserStatsView();
});

musicView.addEventListener("click", () => {
    homeView.style.display = "none";
    signInView.style.display = "none";
    sliderNavigation.style.display = "none";
    hashtagStatsView.style.display = 'none';
    userStatsView.style.display = "none";
    const profileView = document.getElementById("profile-view-content");
    if (profileView) {
        profileView.style.display = 'none';
    }
    displayMusicStatsView();
});

hashtagView.addEventListener("click", () => {
    homeView.style.display = "none";
    signInView.style.display = "none";
    sliderNavigation.style.display = "none";
    const profileView = document.getElementById("profile-view-content");
    if (profileView) {
        profileView.style.display = 'none';
    }
    displayHashtagStatsView();
});

function displayUserStatsView() {
    userStatsView.innerHTML = `
        <h1>User Stats</h1>
        <input type="text" id="tiktoker-search" class="search" placeholder="Search for a TikToker" />
        <button id="tiktoker-search-button" class="search-button">Search</button>
        <div id="tiktoker-profile"></div>
    `;
    views.forEach((view) => {
        view.style.display = 'none';
    });
    userStatsView.style.display = 'block';

    document.getElementById("tiktoker-search-button").addEventListener("click", () => searchTiktokerHandler());

    const lastUserStats = JSON.parse(localStorage.getItem('lastUserStats'));
    if (lastUserStats) {
        displayTiktokerProfile(lastUserStats);
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
            localStorage.setItem('lastUserStats', JSON.stringify(profile));
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
                <p>Unique ID: ${profile.user.nickname}</p>
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

function displayMusicStatsView() {
    musicStatsView.innerHTML = `
        <h1>Music Stats</h1>
        <input type="text" id="music-search" class="search" placeholder="Search for Music" />
        <button id="music-search-button" class="search-button">Search</button>
        <div id="music-profile"></div>
    `;
    views.forEach((view) => {
        view.style.display = 'none';
    });
    musicStatsView.style.display = 'block';

    document.getElementById("music-search-button").addEventListener("click", () => searchMusicHandler());

    const lastMusicStats = JSON.parse(localStorage.getItem('lastMusicStats'));
    if (lastMusicStats) {
        displayMusicProfile(lastMusicStats);
    }
}

async function searchMusicHandler() {
    const musicId = document.getElementById("music-search").value;
    if (musicId) {
        try {
            const response = await fetch(`/search-music?musicId=${musicId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const musicInfo = await response.json();
            displayMusicProfile(musicInfo);
            localStorage.setItem('lastMusicStats', JSON.stringify(musicInfo));
        } catch (error) {
            console.error(error);
            document.getElementById("music-profile").innerHTML = `<p>Error fetching music data: ${error.message}</p>`;
        }
    }
}

function displayMusicProfile(musicInfo) {
    const musicDiv = document.getElementById("music-profile");
    if (musicInfo) {
        musicDiv.innerHTML = `
            <div id="music-profile-card">
                <div id="music-profile-card-upper">
                    <img src="${musicInfo.music.coverThumb}" alt="Cover Picture">
                </div>
                <h1>${musicInfo.music.title}</h1>
                <p>Author: ${musicInfo.music.authorName}</p>
                <p>Duration: ${musicInfo.music.duration} seconds</p>
                <p>Music ID: ${musicInfo.music.id}</p>
                <p>Video Count: ${musicInfo.stats.videoCount} videos</p>
                <audio controls>
                    <source src="${musicInfo.music.playUrl}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
            </div>
        `;
    } else {
        musicDiv.innerHTML = `<p>Music not found or missing profile information</p>`;
    }
}

function displayHashtagStatsView() {
    hashtagStatsView.innerHTML = `
        <h1>Hashtag Stats</h1>
        <input type="text" id="hashtag-search" class="search" placeholder="Search for a Hashtag" />
        <button id="hashtag-search-button" class="search-button">Search</button>
        <div id="hashtag-profile"></div>
    `;
    views.forEach((view) => {
        view.style.display = 'none';
    });
    hashtagStatsView.style.display = 'block';

    document.getElementById("hashtag-search-button").addEventListener("click", () => searchHashtagHandler());

    const lastHashtagStats = JSON.parse(localStorage.getItem('lastHashtagStats'));
    if (lastHashtagStats) {
        displayHashtagProfile(lastHashtagStats);
    }
}

async function searchHashtagHandler() {
    const hashtag = document.getElementById("hashtag-search").value;
    if (hashtag) {
        try {
            const response = await fetch(`/search-hashtag?hashtag=${hashtag}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const hashtagInfo = await response.json();
            displayHashtagProfile(hashtagInfo);
            localStorage.setItem('lastHashtagStats', JSON.stringify(hashtagInfo));
        } catch (error) {
            console.error(error);
            document.getElementById("hashtag-profile").innerHTML = `<p>Error fetching hashtag data: ${error.message}</p>`;
        }
    }
}

function displayHashtagProfile(hashtagInfo) {
    const hashtagDiv = document.getElementById("hashtag-profile");
    if (hashtagInfo) {
        hashtagDiv.innerHTML = `
            <div id="hashtag-profile-card">
                <div id="hashtag-profile-card-upper">
                    <img src="${hashtagInfo.challengeInfo.challenge.coverThumb}" alt="Cover Picture">
                </div>
                <h1>#${hashtagInfo.challengeInfo.challenge.title} on Tiktok</h1>
                <p>Video Count: ${hashtagInfo.challengeInfo.statsV2.videoCount} videos</p>
                <p>Views Count: ${hashtagInfo.challengeInfo.statsV2.viewCount} views</p>
            </div>
        `;
    } else {
        hashtagDiv.innerHTML = `<p>Hashtag not found or missing information</p>`;
    }
}

// Check for saved user, stats on page load
document.addEventListener("DOMContentLoaded", async () => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
        displayProfile(savedUser);
    }

    const lastUserStats = JSON.parse(localStorage.getItem('lastUserStats'));
    if (lastUserStats) {
        displayTiktokerProfile(lastUserStats);
    }

    const lastMusicStats = JSON.parse(localStorage.getItem('lastMusicStats'));
    if (lastMusicStats) {
        displayMusicProfile(lastMusicStats);
    }

    const lastHashtagStats = JSON.parse(localStorage.getItem('lastHashtagStats'));
    if (lastHashtagStats) {
        displayHashtagProfile(lastHashtagStats);
    }
});
