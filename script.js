document.getElementById('moodForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const mood = document.getElementById('mood').value;
    const notes = document.getElementById('notes').value;
    if (mood) {
        addMoodToHistory(mood, notes);
        document.getElementById('mood').value = '';
        document.getElementById('notes').value = '';
    }
});

document.getElementById('clearAll').addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all moods?')) {
        clearAllMoods();
    }
});

function addMoodToHistory(mood, notes) {
    const moodHistory = document.getElementById('moodHistory');
    const listItem = document.createElement('li');

    const dateTime = new Date();
    const options = { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedDateTime = dateTime.toLocaleDateString('en-US', options).replace(',', '');

    listItem.className = getMoodClass(mood);
    listItem.innerHTML = `
        <div class="mood">
            <span>${mood}</span>
            <span class="notes">${notes}</span>
        </div>
        <span>${formattedDateTime}</span>
        <div class="actions">
            <button onclick="deleteMood(this)"><i class="fas fa-trash"></i></button>
        </div>
    `;
    moodHistory.appendChild(listItem);

    // Save to local storage
    saveMoodToLocalStorage({ mood, notes, formattedDateTime });
}

function getMoodClass(mood) {
    switch (mood) {
        case '😊 Happy': return 'mood-happy';
        case '😢 Sad': return 'mood-sad';
        case '😟 Anxious': return 'mood-anxious';
        case '😡 Angry': return 'mood-angry';
        case '😃 Excited': return 'mood-excited';
        default: return '';
    }
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
        listItem.className = getMoodClass(entry.mood);
        listItem.innerHTML = `
            <div class="mood">
                <span>${entry.mood}</span>
                <span class="notes">${entry.notes}</span>
            </div>
            <span>${entry.formattedDateTime}</span>
            <div class="actions">
                <button onclick="deleteMood(this)"><i class="fas fa-trash"></i></button>
            </div>
        `;
        moodHistory.appendChild(listItem);
    });
}

function deleteMood(button) {
    const listItem = button.parentElement.parentElement;
    listItem.remove();

    // Update local storage
    const moodText = listItem.querySelector('.mood span').textContent;
    const formattedDateTime = listItem.querySelector('span:last-child').textContent;
    let moods = JSON.parse(localStorage.getItem('moods')) || [];
    moods = moods.filter(mood => !(mood.mood === moodText && mood.formattedDateTime === formattedDateTime));
    localStorage.setItem('moods', JSON.stringify(moods));
}

function clearAllMoods() {
    localStorage.removeItem('moods');
    document.getElementById('moodHistory').innerHTML = '';
}

// Load mood history on page load
document.addEventListener('DOMContentLoaded', loadMoodHistory);