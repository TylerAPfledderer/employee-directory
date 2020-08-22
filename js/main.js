/*
 * Implementing RandomUser API
 * Fetch an array of 12 "user" objects.
 * This data will be iterated to inject into the HTML.
 *
 * Data needed for the main cards:
 * - Name (First Last)
 * - Email
 * - Home Town
 *
 * Data Needed for the Modals:
 * - Content from the cards plus...
 * - phone number
 * - address
 * - birthday
 */

let directory = document.querySelector(".directory-wrapper");

// Retrieve data from RandomUser API
fetch("https://randomuser.me/api/?results=12&nat=us,au,br,ca,ch")
  // Convert data into JSON
  .then((response) => response.json())

  // Manipulate the data
  .then((data) => {
    const employees = data.results;

    for (let i = 0; i < employees.length; i++) {
        directory.innerHTML += `
            <section class="employee-card">
                <img src="${employees[i].picture.large}" alt="Picture of ${employees[i].name.first} ${employees[i].name.last}" class="employee-card__img">
                <div class="employee-card__text">
                    <h2 class="employee-card__name">${employees[i].name.first} ${employees[i].name.last}</h2>
                    <p class="employee-card__email">${employees[i].email}</p>
                    <p class="employee-card__city">${employees[i].location.city}</p>
                </div>
            </section>
        `;
      console.log(`${employees[i].phone}`);
      console.log(
        `${employees[i].location.street.number} ${employees[i].location.street.name}`
      );
      console.log(
        `Birthday: ${employees[i].dob.date.slice(5, 7)}/${employees[
          i
        ].dob.date.slice(8, 10)}/${employees[i].dob.date.slice(0, 4)}`
      );
      console.log(` `);
    }
  });
