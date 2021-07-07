// For storing the data from the randomUser API
let randomUserData = []

const directory = document.querySelector(".directory-wrapper")

// Function to take the data of employees and inject them into the DOM as card components
const displayEmployees = (employeeData) => {
  employees = employeeData

  // Loop through data array of employee information.
  // Use 'for' loop instead of 'forEach' for better performance.
  employees.forEach((employee, i) => {
    const { name, picture, email, location } = employee

    // Inject data into the directory-wrap container
    directory.innerHTML += `
					<section class="employee-card" data-index="${i}">
							<img src="${picture.medium}" alt="Picture of ${name.first} ${name.last}" class="employee-card__img">
							<div class="employee-card__text">
									<h2 class="employee-card__name">${name.first} ${name.last}</h2>
									<p class="employee-card__email" aria-label="${email}">${email}</p>
									<p class="employee-card__city" aria-label="${location.city}">${location.city}</p>
							</div>
					</section>
			`
  })
}

// ==== Retrieve data from RandomUser API ==== //

fetch(
  "https://randomuser.me/api/?results=12&inc=name,location,email,dob,cell,picture,nat&nat=us,au,br,ca,ch&noinfo"
)
  // Convert data into JSON
  .then((response) => response.json())
  // Step into the JSON object to easily access the array
  .then((res) => res.results)
  // Display the data to the DOM
  .then((data) => {
    displayEmployees(data)
    randomUserData = data // Initial storage of data on load
  })
  .catch((err) => console.error("There was a problem: ", err))

// ==== Modal Overlay ==== //

// Grab the overlay element for the Single Employee Data
const modalOverlay = document.querySelector(".modal-overlay")

// Create block to display employee data on the modal overlay
function employeeModal(index) {
  let currentIndex = index

  // Desconstruct the data objects for the modal cards
  const { name, picture, email, location, cell, dob } = employees[currentIndex]
  const { city, street, state, postcode } = location
  // Convert dob.date prop value
  const date = new Date(dob.date)

  // Used to determine if left and right arrows should be displayed
  const hasOneResult = employees.length === 1

  // Inject data into the overlay div
  // NOTE: Use '=' instead of '+=' so the injected HTML can be replaced (not added) with the same elements and new data when "toggling" between employees in the overlay (see lines 95-130).
  modalOverlay.innerHTML = `
		<section class="employee-modal employee-card">
      ${
        hasOneResult
          ? ""
          : '<div class="modal-overlay__arrow modal-overlay__arrow--left" id="js-toggle-left">&#60;</div>'
      }
			
			<div class="employee-modal__close" id="js-modal-close">X</div>
			<div class="employee-modal__upper">
					<img src="${picture.large}" alt="Large Picture of ${name.first} ${
    name.last
  }" class="employee-card__img employee-modal__img">
					<h2 class="employee-modal__name">${name.first} ${name.last}</h2>
					<p class="employee-modal__email">${email}</p>
					<p class="employee-modal__city">${city}</p>
			</div>
			<div class="employee-modal__lower">
					<p class="employee-modal__phone">${cell}</p>
					<address class="employee-modal__address">${street.number} ${
    street.name
  }, ${state} ${postcode}</address>
					<p class="employee-modal__birthday">Birthday: ${date.getDay()} - ${date.getDay()} - ${date.getFullYear()}</p>
			</div>
      ${
        hasOneResult
          ? ""
          : '<div class="modal-overlay__arrow modal-overlay__arrow--right" id="js-toggle-right">&#62;</div>'
      }
			
    </section>
    `

  if (!hasOneResult) {
    /*
     * Toggle between the modal cards using the left and right arrows
     * This event handler takes the index, adds or subtracts by one, and runs the function over again.
     * If successful, the event on click will replace the card in the overlay with a new card of data.
     */

    // Set up and event for the "Left" arrow
    const modalLeftArrow = document.querySelector("#js-toggle-left")

    modalLeftArrow.addEventListener("click", () => {
      // If you are at the beginning of the array of employee object, reset to the end of the array
      if (currentIndex == 0) {
        currentIndex = employees.length
      }

      // Decrease the index number by 1
      currentIndex--
      // Run the function again with the new index number
      employeeModal(currentIndex)
    })

    // Set up and event for the "Left" arrow
    const modalRightArrow = document.querySelector("#js-toggle-right")

    modalRightArrow.addEventListener("click", () => {
      // If you are at the end of the array of employee object, reset to the beginning of the array
      // The length is not hard coded because of updating list with the search filter
      if (currentIndex == employees.length - 1) {
        currentIndex = -1
      }

      // Increase the index number by 1
      currentIndex++
      // Run the function again with the new index number
      employeeModal(currentIndex)
    })
  }

  /*
   * On click of the Close icon, hide the overlay and remve the injected data
   * This handler has to be declared inside the function as it is looking for the current instance.
   * Else an error will be thrown and the handler will not work.
   */

  // Grab new instance of the Close icon
  const modalClose = document.getElementById("js-modal-close")

  modalClose.addEventListener("click", () => {
    // Remove the class that shows the overlay
    modalOverlay.classList.remove("visible")
    // "Delete all of the HTML inside the the parent container"
    modalOverlay.innerHTML = ""
  })

  // Close modal when user click overlay (and not the card)
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      // Remove the class that shows the overlay
      modalOverlay.classList.remove("visible")
      // "Delete all of the HTML inside the the parent container"
      modalOverlay.innerHTML = ""
    }
  })
}

// ==== Selecting a Card to Open the Modal Overlay ==== //

// Handle a click event where when the user clicks on an employee card, a modal for the employee appears.
directory.addEventListener("click", (e) => {
  // Run code if user clicks on an element that is not ".directory-wrapper"
  if (e.target !== directory) {
    // Show the overlay
    modalOverlay.classList.add("visible")

    // Traverse to the parent container closest to the target clicked.
    const card = e.target.closest(".employee-card")
    // Grab that parent element's index # to pull data for the modal
    const index = card.getAttribute("data-index")

    // Create the data
    employeeModal(index)
  }
})

// ==== Search for  employees by name ==== //
const searchBar = document.getElementById("js-search-bar")
function employeeSearch() {
  // Grab the text entered into the searchbar and make case insensitive.
  const input = searchBar.value.toLowerCase()

  const newUserList = randomUserData.filter((employee) => {
    const search = `${employee.name.first} ${employee.name.last}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

    return search.includes(input)
  })
  // Clear the directory
  directory.innerHTML = ""
  displayEmployees(newUserList)
}

// Trigger search
searchBar.addEventListener("keyup", employeeSearch)
