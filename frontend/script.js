document.addEventListener('DOMContentLoaded', () => {
    const moodButtons = document.querySelectorAll('.mood-button');
    let selectedMood = '';

    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedMood = button.getAttribute('data-mood');
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    document.getElementById('submit-mood').addEventListener('click', async () => {
        if (!selectedMood) {
            alert('Please select a mood');
            return;
        }

        const date = new Date().toISOString().split('T')[0]; // Get today's date
        const responseSection = document.getElementById('response');
        responseSection.innerHTML = 'Sending...';

        try {
            const response = await fetch('http://localhost:5000/mood', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ date, mood: selectedMood })
            });

            const data = await response.json();
            responseSection.innerHTML = `<p>${data.response}</p>`;
            updateCalendar();
        } catch (error) {
            responseSection.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    });

    async function updateCalendar() {
        try {
            const response = await fetch('http://localhost:5000/moods');
            const data = await response.json();
            const calendar = document.getElementById('calendar');
            calendar.innerHTML = '';

            const daysInYear = 365;
            const startDate = new Date(new Date().getFullYear(), 0, 1);

            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            // Add month labels
            months.forEach((month, index) => {
                const monthLabel = document.createElement('div');
                monthLabel.className = 'month-label';
                monthLabel.textContent = month;
                calendar.appendChild(monthLabel);
            });

            for (let i = 0; i < daysInYear; i++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + i);
                const dateString = currentDate.toISOString().split('T')[0];
                const moodEntry = data.moods.find(entry => entry.date === dateString);
                const moodClass = moodEntry ? `mood-${moodEntry.mood}` : 'mood-none';

                const day = document.createElement('div');
                day.className = `calendar-day ${moodClass}`;
                day.title = dateString;
                day.setAttribute('data-info', `${dateString}: ${moodEntry ? moodEntry.mood : 'No mood recorded'}`);
                calendar.appendChild(day);
            }
        } catch (error) {
            console.error('Error fetching moods:', error);
        }
    }

    updateCalendar();
});