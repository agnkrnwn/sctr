function getPrayerTimes() {
    const latitude = -6.2088;
    const longitude = 106.8456;
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    fetch(`https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${latitude}&longitude=${longitude}&method=2`)
        .then(response => response.json())
        .then(data => {
            const timings = data.data.timings;
            const prayerTimesDiv = document.getElementById('prayerTimes');
            prayerTimesDiv.innerHTML = `
                <div style="display: flex; flex-direction: column; ">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <p>Imsak: ${timings.Imsak}</p>
                        <p>Fajr: ${timings.Fajr}</p>
                        <p>Dhuhr: ${timings.Dhuhr}</p>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <p>Asr: ${timings.Asr}</p>
                        <p>Maghrib: ${timings.Maghrib}</p>
                        <p>Isha: ${timings.Isha}</p>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error fetching prayer times:', error);
        });
}

document.getElementById('openModalButton').addEventListener('click', getPrayerTimes);