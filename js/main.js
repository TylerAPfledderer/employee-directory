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
 * - cell phone number
 * - address
 * - birthday
 */

const directory = document.querySelector(".directory-wrapper");
let employees = [];

// ==== Retrieve data from RandomUser API ==== //

fetch(
	"https://randomuser.me/api/?results=12&inc=name,location,email,dob,cell,picture,nat&nat=us,au,br,ca,ch&noinfo"
)
	// Convert data into JSON
	.then(response => response.json())

	// Manipulate the data.
	.then(data => {
		employees = data.results;

		// Loop through data array of employee information.
		// Use 'for' loop instead of 'forEach' for better performance.
		for (let i = 0; i < employees.length; i++) {
			// Simplify the interpolation names
			const employeePicture = employees[i].picture.medium;
			const employeeFirstName = employees[i].name.first;
			const employeeLastName = employees[i].name.last;
			const employeeEmail = employees[i].email;
			const employeeCity = employees[i].location.city;

			// Inject data into the directory-wrap container
			directory.innerHTML += `
            <section class="employee-card" data-index="${i}">
                <img src="${employeePicture}" alt="Picture of ${employeeFirstName} ${employeeLastName}" class="employee-card__img">
                <div class="employee-card__text">
                    <h2 class="employee-card__name">${employeeFirstName} ${employeeLastName}</h2>
                    <p class="employee-card__email" aria-label="${employeeEmail}">${employeeEmail}</p>
                    <p class="employee-card__city" aria-label="${employeeCity}">${employeeCity}</p>
                </div>
            </section>
        `;
		}
	})
	.catch(err => console.error("There was a problem: ", err));


// ==== Modal Overlay ==== //

// Grab the overlay element for the Single Employee Data
const modalOverlay = document.querySelector(".modal-overlay");

// Create block to display employee data on the modal overlay
function employeeModal(index) {

	let currentIndex = index;

	// Simplify the interpolation names
	const employeePicture = employees[currentIndex].picture.large;
	const employeeName = 
		`${employees[currentIndex].name.first} ${employees[currentIndex].name.last}`;
	const employeeEmail = employees[currentIndex].email;
	const employeeCity = employees[currentIndex].location.city;
	const employeePhone = employees[currentIndex].cell;
	const employeeAddress = 
		`${employees[currentIndex].location.street.number} ${employees[currentIndex].location.street.name}`;
	const employeeDOB = 
		`${employees[currentIndex].dob.date.slice(5, 7)}/${employees[currentIndex].dob.date.slice(8, 10)}/${employees[currentIndex].dob.date.slice(0, 4)}`;

	// Inject data into the overlay div
	// NOTE: Use '=' instead of '+=' so the injected HTML can be replaced (not added) with the same elements and new data when "toggling" between employees in the overlay (see lines 95-130).
	modalOverlay.innerHTML = `
		<section class="employee-modal employee-card">
			<div class="modal-overlay__arrow modal-overlay__arrow--left" id="js-toggle-left">&#60;</div>
			<div class="employee-modal__close" id="js-modal-close">X</div>
			<div class="employee-modal__upper">
					<img src="${employeePicture}" alt="Large Picture of ${employeeName}" class="employee-card__img employee-modal__img">
					<h2 class="employee-modal__name">${employeeName}</h2>
					<p class="employee-modal__email">${employeeEmail}</p>
					<p class="employee-modal__city">${employeeCity}</p>
			</div>
			<div class="employee-modal__lower">
					<p class="employee-modal__phone">${employeePhone}</p>
					<address class="employee-modal__address">${employeeAddress}</address>
					<p class="employee-modal__birthday">Birthday: ${employeeDOB}</p>
			</div>
			<div class="modal-overlay__arrow modal-overlay__arrow--right" id="js-toggle-right">&#62;</div>
    </section>
    `;

	/*
	 * Toggle between the modal cards using the left and right arrows
	 * This event handler takes the index, adds or subtracts by one, and runs the function over again.
	 * If successful, the event on click will replace the card in the overlay with a new card of data.
	 */

	// Set up and event for the "Left" arrow
	const modalLeftArrow = document.querySelector("#js-toggle-left");

	modalLeftArrow.addEventListener("click", () => {
		// If you are at the beginning of the array of employee object, reset to the end of the array
		if (currentIndex == 0) {
			currentIndex = employees.length;
		}

		// Decrease the index number by 1
		currentIndex--;
		// Run the function again with the new index number
		employeeModal(currentIndex);
	});

	// Set up and event for the "Left" arrow
	const modalRightArrow = document.querySelector("#js-toggle-right");

	modalRightArrow.addEventListener("click", () => {

		// If you are at the end of the array of employee object, reset to the beginning of the array
		if (currentIndex == 11) {
			currentIndex = -1;
		}

		// Increase the index number by 1
		currentIndex++;
		// Run the function again with the new index number
		employeeModal(currentIndex);
	});

	/*
	 * On click of the Close icon, hide the overlay and remve the injected data
	 * This handler has to be declared inside the function as it is looking for the current instance.
	 * Else an error will be thrown and the handler will not work.
	 */

	// Grab new instance of the Close icon
	const modalClose = document.getElementById("js-modal-close");

	modalClose.addEventListener("click", () => {
		// Remove the class that shows the overlay
		modalOverlay.classList.remove("visible");
		// "Delete all of the HTML inside the the parent container"
    modalOverlay.innerHTML = "";
	});
}


// ==== Selecting a Card to Open the Modal Overlay ==== //

// Handle a click event where when the user clicks on an employee card, a modal for the employee appears.
directory.addEventListener("click", (e) => {
	// Run code if user clicks on an element that is not ".directory-wrapper"
	if (e.target !== directory) {
		// Show the overlay
		modalOverlay.classList.add("visible");

		// Traverse to the parent container closest to the target clicked.
		const card = e.target.closest(".employee-card");
		// Grab that parent element's index # to pull data for the modal
		const index = card.getAttribute("data-index");

		// Create the data
		employeeModal(index);
	}
});

// ==== Search for  employees by name ==== //
const searchBar = document.getElementById("js-search-bar")
function employeeSearch () {
	// Grab the text entered into the searchbar and make case insensitive.
	const input = searchBar
									.value
									.toLowerCase();
	for(let j = 0; j < employees.length; j++) {
		
		// Grab the name from the object in the Array index instance
		// Check Truthy or falsy if input text is included in the name.
		const search = `${employees[j].name.first} ${employees[j].name.last}`
			.toLowerCase()
			// Following two methods replaces the accents in the name
			// Credit StackOverflow post for the reference
			// https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript/37511463
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.includes(input);

		const cards = document.querySelectorAll(`.employee-card`);
		const employee = cards[j];

		if(!search) {
			employee.style.display = "none";
		} else {
			employee.style.display = "unset";
		}
	}
}

// Trigger search
searchBar.addEventListener("keyup", employeeSearch);