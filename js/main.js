"use strict";

const search = document.getElementById("search");
const searchResults = document.getElementById("search-results--content");
const selectionType = document.getElementById("selection-type");
let calendar;

//Search ships.json and filter it.
const searchForShips = async searchText => {
  const res = await fetch("data/ships.json");
  const ships = await res.json();

  //Get matches to current text input
  let matches = ships.filter(ship => {
    const regex = new RegExp(`^${searchText}`, "gi");
    return ship.name.match(regex) || ship.date.match(regex);
  });

  if (searchText.length === 0) {
    matches = [];
    searchResults.innerHTML = "";
  }

  // Debug
  // console.log(searchText, '<-- searchtext');
  outputTimeline(matches);
};

// Show results in HTML
/*const outputHTML = matches => {
  if (matches.length > 0) {
    const html = matches
      .map(
        match => `
            <div class="box ship-card">
               <i class="fas fa-ship"></i>
               <h4>${match.name} (${match.date}) <span class="has-text-primary">${match.day}</span></h4> 
               <small>Max passengers: ${match.max_pax} / nationality: ${match.nationality}</small>
            </div>
         `
      )
      .join("");

    // console.log(html);
    searchResults.innerHTML = html;
  }
};*/

const outputTimeline = matches => {
  if (matches.length > 0) {
    const html = matches
      .map(
        match =>
          `
            <div class="timeline">
                <header class="timeline-header">
                    <span class="tag is-medium is-info">${match.date}</span>
                </header>
                <div class="timeline-item">
                    <div class="timeline-marker is-info is-icon"><i class="fas fa-ship is-white"></i></div>
                    <div class="timeline-content">
                         <div class="box ship-card">  
                             <h4 class="heading"><span class="has-text-primary">${match.day}</span></h4> 
                             <small>${match.name} Max passengers: ${match.max_pax} / nationality: ${match.nationality}</small>
                         </div>
                    </div>
                </div>
            </div>
        `
      )
      .join("");

    searchResults.innerHTML = html;
  }
};

const changeInputType = () => {
  let selection = document.getElementById("selection-type");
  search.setAttribute("type", selection.type);
  if (selection.value === "date") {
    search.setAttribute("placeholder", "Velg dato");
    calendar = initCalendar();
  } else {
    search.setAttribute("placeholder", "Søk etter skipsnavn");
    if (calendar !== undefined) {
      calendar.destroy();
    }
  }
};

const initCalendar = () => {
  return flatpickr("#search", {
    enableTime: false,
    altInput: true,
    altFormat: "j F, Y",
    dateFormat: "d.m.Y"
  });
};

const setTodaysShip = () => {
  const now = new Date();
  const searchDate = dateFormat(now, "dd.mm.yyyy");
  searchForShips(searchDate);
};

const formatDateFromJSON = str => {
  const date = new Date(formatAndReverseString(str));
  return dateFormat(new Date(date), "mmmm");
};

const formatAndReverseString = str => {
  return str
    .split(".")
    .reverse()
    .join("-");
};

setTodaysShip();
selectionType.addEventListener("change", () => changeInputType);
search.addEventListener("input", () => {
  searchForShips(search.value);
});
