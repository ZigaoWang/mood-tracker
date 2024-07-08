document.getElementById('moodForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const mood = document.getElementById('mood').value;
    if (mood) {
        addMoodToHistory(mood);
        document.getElementById('mood').value = '';
    }
});

function addMoodToHistory(mood) {
    const moodHistory = document.getElementById('moodHistory');
    const listItem = document.createElement('li');

    const dateTime = new Date();
    const options = { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedDateTime = dateTime.toLocaleDateString('en-US', options).replace(',', '');

    listItem.innerHTML = `<span>${mood}</span><span>${formattedDateTime}</span>`;
    moodHistory.appendChild(listItem);

    // Save to local storage
    saveMoodToLocalStorage({ mood, formattedDateTime });
}

function saveMoodToLocalStorage(moodEntry) {
    let moods = JSON.parse(localStorage.getItem('moods')) || [];
    moods.push(moodEntry);
    localStorage.setItem('moods', JSON.stringify(moods));
}

function loadMoodHistory() {
    const moods = JSON.parse(localStorage.getItem('moods')) || [];
    const moodHistory = document.getElementById('moodHistory');
    moods.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span>${entry.mood}</span><span>${entry.formattedDateTime}</span>`;
        moodHistory.appendChild(listItem);
    });
}

// Load mood history on page load
document.addEventListener('DOMContentLoaded', loadMoodHistory);