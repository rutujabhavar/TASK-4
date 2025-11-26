const ctx = document.getElementById("chart").getContext("2d");

firebase.database().ref("usage").once("value").then(snapshot => {
    const data = snapshot.val() || {};
    const siteTotals = {};

    for (let day in data) {
        for (let site in data[day]) {
            const entries = data[day][site];
            const totalSeconds = Object.values(entries)
                .reduce((a, b) => a + b.seconds, 0);

            siteTotals[site] = (siteTotals[site] || 0) + totalSeconds;
        }
    }

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(siteTotals),
            datasets: [{
                label: "Time Spent (seconds)",
                data: Object.values(siteTotals),
                backgroundColor: "rgba(75, 192, 192, 0.7)"
            }]
        }
    });
});
