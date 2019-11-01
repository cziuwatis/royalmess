async function loadMatches()
{
    let json_url = "json/matches.json";
    let url_parameters = "";
    try
    {
        const response = await fetch(json_url,
                {
                    method: "POST",
                    headers: {'Content-type': 'application/x-www-formurencoded; charset=UTF-8'},
                    body: url_parameters
                });
        let fetchedData = await response.json();
        updateMatches(fetchedData);
    } catch (error)
    {
        console.log("Fetch failed: ", error);
    }
    function updateMatches(jsonData)
    {
        let pool = document.getElementById("poolA");
        for (let i = 0; i < jsonData[0].A.length; i++)
        {
            pool.innerHTML += '<li class="match"> <div class="match-left"> <div class="country-flag-left"> <img src="images/countryFlags/' + jsonData[0].A[i].team1.toLowerCase().replace(/\s/g, "") + '.svg.webp"> </div> <div class="country-name-left"><a title="Team Information" target="blank_" href="https://en.wikipedia.org/wiki/' + jsonData[0].A[i].team1.replace(/\s/g, "_") + '_national_rugby_union_team">' + jsonData[0].A[i].team1 + '</a></div> </div> <div class="match-middle"> <div class="match-score"> ' + jsonData[0].A[i].team1score + ' - ' + jsonData[0].A[i].team2score + ' </div> <div class="match-date"> ' + jsonData[0].A[i].matchDate + ' </div> </div> <div class="match-right"> <div class="country-name-right"><a title="Team Information" target="blank_" href="https://en.wikipedia.org/wiki/' + jsonData[0].A[i].team2.replace(/\s/g, "_") + '_national_rugby_union_team">' + jsonData[0].A[i].team2 + '</a> </div> <div class="country-flag-right"> <img src="images/countryFlags/' + jsonData[0].A[i].team2.toLowerCase().replace(/\s/g, "") + '.svg.webp"></div></div><div class="stadium-name-right">' + jsonData[0].A[i].stadium + '</div></li>';
        }
        pool = document.getElementById("poolB");
        for (let i = 0; i < jsonData[0].B.length; i++)
        {
            pool.innerHTML += '<li class="match"> <div class="match-left"> <div class="country-flag-left"> <img src="images/countryFlags/' + jsonData[0].B[i].team1.toLowerCase().replace(/\s/g, "") + '.svg.webp"> </div> <div class="country-name-left"><a title="Team Information" target="blank_" href="https://en.wikipedia.org/wiki/' + jsonData[0].B[i].team1.replace(/\s/g, "_") + '_national_rugby_union_team">' + jsonData[0].B[i].team1 + '</a></div> </div> <div class="match-middle"> <div class="match-score"> ' + jsonData[0].B[i].team1score + ' - ' + jsonData[0].B[i].team2score + ' </div> <div class="match-date"> ' + jsonData[0].B[i].matchDate + ' </div> </div> <div class="match-right"> <div class="country-name-right"><a title="Team Information" target="blank_" href="https://en.wikipedia.org/wiki/' + jsonData[0].B[i].team2.replace(/\s/g, "_") + '_national_rugby_union_team">' + jsonData[0].B[i].team2 + '</a></div> <div class="country-flag-right"> <img src="images/countryFlags/' + jsonData[0].B[i].team2.toLowerCase().replace(/\s/g, "") + '.svg.webp"> </div> </div><div class="stadium-name-right">' + jsonData[0].B[i].stadium + '</div></li>';
        }
        pool = document.getElementById("poolC");
        for (let i = 0; i < jsonData[0].C.length; i++)
        {
            pool.innerHTML += '<li class="match"> <div class="match-left"> <div class="country-flag-left"> <img src="images/countryFlags/' + jsonData[0].C[i].team1.toLowerCase().replace(/\s/g, "") + '.svg.webp"> </div> <div class="country-name-left"><a title="Team Information" target="blank_" href="https://en.wikipedia.org/wiki/' + jsonData[0].C[i].team1.replace(/\s/g, "_") + '_national_rugby_union_team">' + jsonData[0].C[i].team1 + '</a></div> </div> <div class="match-middle"> <div class="match-score"> ' + jsonData[0].C[i].team1score + ' - ' + jsonData[0].C[i].team2score + ' </div> <div class="match-date"> ' + jsonData[0].C[i].matchDate + ' </div> </div> <div class="match-right"> <div class="country-name-right"><a title="Team Information" target="blank_" href="https://en.wikipedia.org/wiki/' + jsonData[0].C[i].team2.replace(/\s/g, "_") + '_national_rugby_union_team">' + jsonData[0].C[i].team2 + '</a></div> <div class="country-flag-right"> <img src="images/countryFlags/' + jsonData[0].C[i].team2.toLowerCase().replace(/\s/g, "") + '.svg.webp"> </div> </div><div class="stadium-name-right">' + jsonData[0].C[i].stadium + '</div></li>';
        }
        pool = document.getElementById("poolD");
        for (let i = 0; i < jsonData[0].D.length; i++)
        {
            pool.innerHTML += '<li class="match"> <div class="match-left"> <div class="country-flag-left"> <img src="images/countryFlags/' + jsonData[0].D[i].team1.toLowerCase().replace(/\s/g, "") + '.svg.webp"> </div> <div class="country-name-left"><a title="Team Information" target="blank_" href="https://en.wikipedia.org/wiki/' + jsonData[0].D[i].team1.replace(/\s/g, "_") + '_national_rugby_union_team">' + jsonData[0].D[i].team1 + '</a></div> </div> <div class="match-middle"> <div class="match-score"> ' + jsonData[0].D[i].team1score + ' - ' + jsonData[0].D[i].team2score + ' </div> <div class="match-date"> ' + jsonData[0].D[i].matchDate + ' </div> </div> <div class="match-right"> <div class="country-name-right"><a title="Team Information" target="blank_" href="https://en.wikipedia.org/wiki/' + jsonData[0].D[i].team2.replace(/\s/g, "_") + '_national_rugby_union_team">' + jsonData[0].D[i].team2 + '</a></div> <div class="country-flag-right"> <img src="images/countryFlags/' + jsonData[0].D[i].team2.toLowerCase().replace(/\s/g, "") + '.svg.webp"> </div> </div><div class="stadium-name-right">' + jsonData[0].D[i].stadium + '</div></li>';
        }
        pool = document.getElementById("poolK");
        for (let i = 0; i < jsonData[0].KNOCKOUT.length; i++)
        {
            pool.innerHTML += '<li class="match"> <div class="match-left"> <div class="country-flag-left"> <img src="images/countryFlags/' + jsonData[0].KNOCKOUT[i].team1.toLowerCase().replace(/\s/g, "") + '.svg.webp"> </div> <div class="country-name-left"><a title="Team Information" target="blank_" href="https://en.wikipedia.org/wiki/' + jsonData[0].KNOCKOUT[i].team1.replace(/\s/g, "_") + '_national_rugby_union_team">' + jsonData[0].KNOCKOUT[i].team1 + '</a></div> </div> <div class="match-middle"> <div class="match-score"> ' + jsonData[0].KNOCKOUT[i].team1score + ' - ' + jsonData[0].KNOCKOUT[i].team2score + ' </div> <div class="match-date"> ' + jsonData[0].KNOCKOUT[i].matchDate + ' </div> </div> <div class="match-right"> <div class="country-name-right"><a title="Team Information" target="blank_" href="https://en.wikipedia.org/wiki/' + jsonData[0].KNOCKOUT[i].team2.replace(/\s/g, "_") + '_national_rugby_union_team">' + jsonData[0].KNOCKOUT[i].team2 + '</a></div> <div class="country-flag-right"> <img src="images/countryFlags/' + jsonData[0].KNOCKOUT[i].team2.toLowerCase().replace(/\s/g, "") + '.svg.webp"> </div> </div><div class="stadium-name-right">' + jsonData[0].KNOCKOUT[i].stadium + '</div></li>';
        }
    }
}
