
/* ==========================================
   EVENTHUB - EVENT MANAGEMENT WEBSITE
   Main JavaScript File
========================================== */


/* ==========================================
   1. EVENT DATA
========================================== */

const events = [
    {
        id: 1,
        name: "Summer Music Festival",
        category: "Music",
        description: "Experience an unforgettable day of live music, entertainment and amazing performances from talented artists. Enjoy great music, meet new people and create lasting memories.",
        date: "20 December 2026",
        time: "2:00 PM - 10:00 PM",
        venue: "KICC Grounds",
        location: "Nairobi, Kenya",
        price: 2500,
        image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1000"
    },

    {
        id: 2,
        name: "Business Innovation Summit",
        category: "Business",
        description: "Join entrepreneurs, business leaders and professionals to discuss business innovation, entrepreneurship and opportunities for growth.",
        date: "15 January 2027",
        time: "9:00 AM - 5:00 PM",
        venue: "Kenyatta International Convention Centre",
        location: "Nairobi, Kenya",
        price: 3000,
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000"
    },

    {
        id: 3,
        name: "Technology Workshop",
        category: "Technology",
        description: "Explore modern technology, programming and digital innovation. Learn practical skills and interact with technology professionals.",
        date: "25 January 2027",
        time: "10:00 AM - 4:00 PM",
        venue: "University Conference Hall",
        location: "Nairobi, Kenya",
        price: 1500,
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000"
    },

    {
        id: 4,
        name: "City Sports Challenge",
        category: "Sports",
        description: "Participate in an exciting sports event featuring athletics, competitions and various sporting activities.",
        date: "10 February 2027",
        time: "8:00 AM - 5:00 PM",
        venue: "Nyayo National Stadium",
        location: "Nairobi, Kenya",
        price: 1000,
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1000"
    },

    {
        id: 5,
        name: "Career Growth Seminar",
        category: "Education",
        description: "Learn how to develop your professional skills, prepare for employment opportunities and build a successful career.",
        date: "18 February 2027",
        time: "9:00 AM - 3:00 PM",
        venue: "University Auditorium",
        location: "Nairobi, Kenya",
        price: 800,
        image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1000"
    },

    {
        id: 6,
        name: "Community Networking Night",
        category: "Social",
        description: "Meet new people, exchange ideas and build meaningful personal and professional connections in a friendly environment.",
        date: "28 February 2027",
        time: "5:00 PM - 10:00 PM",
        venue: "The Social House",
        location: "Nairobi, Kenya",
        price: 1200,
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000"
    }
];


/* ==========================================
   2. HELPER FUNCTIONS
========================================== */

// Find an event using its ID
function getEventById(id) {
    return events.find(event => event.id === Number(id));
}


// Format prices in Kenyan Shillings
function formatPrice(amount) {
    return "KES " + Number(amount).toLocaleString("en-KE");
}


// Get an event ID from the URL
function getEventIdFromURL() {
    const parameters = new URLSearchParams(window.location.search);

    return parameters.get("id");
}


// Safely display user-provided text in HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}


// Read saved bookings from browser storage
function getBookings() {
    try {
        const savedBookings = localStorage.getItem("eventHubBookings");

        if (!savedBookings) {
            return [];
        }

        const bookings = JSON.parse(savedBookings);

        return Array.isArray(bookings) ? bookings : [];

    } catch (error) {
        console.error("Unable to read bookings:", error);

        return [];
    }
}


// Save bookings in browser storage
function saveBooking(booking) {
    try {
        const bookings = getBookings();

        bookings.push(booking);

        localStorage.setItem(
            "eventHubBookings",
            JSON.stringify(bookings)
        );

        return true;

    } catch (error) {
        console.error("Unable to save booking:", error);

        return false;
    }
}


// Generate a booking reference
function generateBookingReference() {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    return "EVH-" + randomNumber;
}


/* ==========================================
   3. EVENT SEARCH AND FILTERING
========================================== */

function initializeEventFiltering() {

    const searchInput = document.getElementById("eventSearch");

    const categoryFilter = document.getElementById("categoryFilter");

    const eventCards = document.querySelectorAll(
        "#eventsList .event-card"
    );

    const noEventsMessage = document.getElementById("noEventsMessage");


    // Stop if this is not the events page
    if (!searchInput || !categoryFilter) {
        return;
    }


    function filterEvents() {

        const searchText = searchInput.value.toLowerCase().trim();

        const selectedCategory = categoryFilter.value.toLowerCase();

        let visibleEvents = 0;


        eventCards.forEach(card => {

            const eventName = card.querySelector("h3")
                .textContent.toLowerCase();

            const eventDescription = card.querySelector(".event-info p")
                .textContent.toLowerCase();

            const eventCategory = card.dataset.category.toLowerCase();


            const matchesSearch =
                eventName.includes(searchText) ||
                eventDescription.includes(searchText);

            const matchesCategory =
                selectedCategory === "all" ||
                eventCategory === selectedCategory;


            if (matchesSearch && matchesCategory) {

                card.style.display = "";

                visibleEvents++;

            } else {

                card.style.display = "none";

            }

        });


        // Display a message when no events match
        if (noEventsMessage) {

            noEventsMessage.hidden = visibleEvents !== 0;

        }

    }


    // Search while typing
    searchInput.addEventListener("input", filterEvents);


    // Filter when category changes
    categoryFilter.addEventListener("change", filterEvents);

}


/* ==========================================
   4. EVENT DETAILS PAGE
========================================== */

function initializeEventDetails() {

    const detailsContainer = document.getElementById("eventDetails");

    // Only execute on the event details page
    if (!detailsContainer) {
        return;
    }


    const eventId = getEventIdFromURL();

    const selectedEvent = getEventById(eventId);


    // Handle an invalid event ID
    if (!selectedEvent) {

        detailsContainer.innerHTML = `
            <div class="details-content">
                <h2>Event Not Found</h2>

                <p>
                    Sorry, the event you are looking for
                    does not exist.
                </p>

                <a href="events.html" class="btn primary-btn">
                    Browse Events
                </a>
            </div>
        `;

        return;
    }


    // Display event information
    document.getElementById("detailImage").src = selectedEvent.image;

    document.getElementById("detailImage").alt = selectedEvent.name;

    document.getElementById("detailCategory").textContent =
        selectedEvent.category;

    document.getElementById("detailTitle").textContent =
        selectedEvent.name;

    document.getElementById("detailDescription").textContent =
        selectedEvent.description;

    document.getElementById("detailDate").textContent =
        selectedEvent.date;

    document.getElementById("detailTime").textContent =
        selectedEvent.time;

    document.getElementById("detailVenue").textContent =
        selectedEvent.venue;

    document.getElementById("detailLocation").textContent =
        selectedEvent.location;

    document.getElementById("detailPrice").textContent =
        formatPrice(selectedEvent.price);


    // Pass the selected event ID to the booking page
    const bookButton = document.getElementById("bookEventButton");

    bookButton.href = "register.html?id=" + selectedEvent.id;

}


/* ==========================================
   5. BOOKING PAGE INITIALIZATION
========================================== */

function initializeBookingPage() {

    const bookingForm = document.getElementById("bookingForm");

    // Stop if this is not the booking page
    if (!bookingForm) {
        return;
    }


    const eventSelect = document.getElementById("selectedEvent");

    const quantityInput = document.getElementById("ticketQuantity");

    const summaryEvent = document.getElementById("summaryEvent");

    const summaryPrice = document.getElementById("summaryPrice");

    const summaryQuantity = document.getElementById("summaryQuantity");

    const summaryTotal = document.getElementById("summaryTotal");


    // Preselect an event from the URL
    const eventId = getEventIdFromURL();

    if (eventId) {

        const selectedEvent = getEventById(eventId);

        if (selectedEvent) {
            eventSelect.value = String(selectedEvent.id);
        }

    }


    // Update the booking summary
    function updateBookingSummary() {

        const selectedEvent = getEventById(eventSelect.value);

        let quantity = Number(quantityInput.value);

        // Use a default quantity when the field is empty
        if (!Number.isInteger(quantity) || quantity < 1) {
            quantity = 1;
        }


        if (selectedEvent) {

            const total = selectedEvent.price * quantity;

            summaryEvent.textContent = selectedEvent.name;

            summaryPrice.textContent = formatPrice(selectedEvent.price);

            summaryQuantity.textContent = quantity;

            summaryTotal.textContent = formatPrice(total);

        } else {

            summaryEvent.textContent = "Not selected";

            summaryPrice.textContent = "KES 0";

            summaryQuantity.textContent = quantity;

            summaryTotal.textContent = "KES 0";

        }

    }


    // Update summary when event changes
    eventSelect.addEventListener("change", updateBookingSummary);


    // Update summary when quantity changes
    quantityInput.addEventListener("input", updateBookingSummary);


    // Set the initial booking summary
    updateBookingSummary();


    /* ======================================
       6. PROCESS BOOKING FORM
    ====================================== */

    bookingForm.addEventListener("submit", function(event) {

        event.preventDefault();


        // Collect form information
        const fullName = document.getElementById("fullName").value.trim();

        const email = document.getElementById("email").value.trim();

        const phone = document.getElementById("phone").value.trim();

        const selectedEventId = eventSelect.value;

        const quantity = Number(quantityInput.value);

        const specialRequest = document.getElementById("specialRequest").value.trim();

        const termsAccepted = document.getElementById("terms").checked;


        // Find selected event
        const selectedEvent = getEventById(selectedEventId);


        // Validate full name
        if (fullName.length < 3) {

            alert("Please enter your full name.");

            return;

        }


        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            alert("Please enter a valid email address.");

            return;

        }


        // Validate phone number
        const phonePattern = /^(?:\+254|0)\d{9}$/;

        if (!phonePattern.test(phone)) {

            alert("Please enter a valid Kenyan phone number, for example 0712345678 or +254712345678.");

            return;

        }


        // Validate event selection
        if (!selectedEvent) {

            alert("Please select an event.");

            return;

        }


        // Validate ticket quantity
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {

            alert("You can book between 1 and 10 tickets.");

            return;

        }


        // Validate terms and conditions
        if (!termsAccepted) {

            alert("Please accept the booking terms and conditions.");

            return;

        }


        // Calculate total amount
        const totalAmount = selectedEvent.price * quantity;


        // Generate booking information
        const booking = {

            reference: generateBookingReference(),

            customerName: fullName,

            email: email,

            phone: phone,

            eventId: selectedEvent.id,

            eventName: selectedEvent.name,

            eventDate: selectedEvent.date,

            ticketPrice: selectedEvent.price,

            quantity: quantity,

            totalAmount: totalAmount,

            specialRequest: specialRequest,

            bookingDate: new Date().toLocaleString(),

            status: "Confirmed"

        };


        // Save booking
        const bookingSaved = saveBooking(booking);


        if (!bookingSaved) {

            alert("Unable to save your booking. Please check your browser storage and try again.");

            return;

        }


        // Display confirmation
        displayBookingConfirmation(booking);


        // Hide booking form after successful booking
        bookingForm.hidden = true;

        // Hide booking summary
        const bookingSummary = document.querySelector(".booking-summary");

        if (bookingSummary) {
            bookingSummary.hidden = true;
        }


        // Show confirmation section
        const confirmation = document.getElementById("bookingConfirmation");

        confirmation.hidden = false;

        confirmation.scrollIntoView({
            behavior: "smooth"
        });

    });

}


/* ==========================================
   7. DISPLAY BOOKING CONFIRMATION
========================================== */

function displayBookingConfirmation(booking) {

    const confirmationDetails = document.getElementById("confirmationDetails");


    if (!confirmationDetails) {
        return;
    }


    confirmationDetails.innerHTML = `

        <div class="confirmation-card">

            <h3>Booking Receipt</h3>

            <p>
                <strong>Booking Reference:</strong>
                ${escapeHTML(booking.reference)}
            </p>

            <p>
                <strong>Customer Name:</strong>
                ${escapeHTML(booking.customerName)}
            </p>

            <p>
                <strong>Email:</strong>
                ${escapeHTML(booking.email)}
            </p>

            <p>
                <strong>Phone:</strong>
                ${escapeHTML(booking.phone)}
            </p>

            <p>
                <strong>Event:</strong>
                ${escapeHTML(booking.eventName)}
            </p>

            <p>
                <strong>Event Date:</strong>
                ${escapeHTML(booking.eventDate)}
            </p>

            <p>
                <strong>Ticket Price:</strong>
                ${formatPrice(booking.ticketPrice)}
            </p>

            <p>
                <strong>Number of Tickets:</strong>
                ${booking.quantity}
            </p>

            <p>
                <strong>Total Amount:</strong>
                ${formatPrice(booking.totalAmount)}
            </p>

            <p>
                <strong>Booking Status:</strong>
                ${escapeHTML(booking.status)}
            </p>

            <p>
                <strong>Booking Date:</strong>
                ${escapeHTML(booking.bookingDate)}
            </p>

        </div>

    `;


    // Display print button
    const printButton = document.getElementById("printBooking");

    if (printButton) {

        printButton.addEventListener("click", function() {

            window.print();

        });

    }

}


/* ==========================================
   8. CONTACT FORM
========================================== */

function initializeContactForm() {

    const contactForm = document.getElementById("contactForm");

    // Only execute on the contact page
    if (!contactForm) {
        return;
    }


    const feedback = document.getElementById("contactFeedback");


    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const name = document.getElementById("contactName").value.trim();

        const email = document.getElementById("contactEmail").value.trim();

        const subject = document.getElementById("contactSubject").value.trim();

        const message = document.getElementById("contactMessage").value.trim();


        // Validate contact name
        if (name.length < 3) {

            alert("Please enter your full name.");

            return;

        }


        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            alert("Please enter a valid email address.");

            return;

        }


        // Validate subject
        if (subject.length < 3) {

            alert("Please enter a valid subject.");

            return;

        }


        // Validate message
        if (message.length < 10) {

            alert("Your message should contain at least 10 characters.");

            return;

        }


        // Display success feedback
        feedback.textContent =
            "Thank you, " + name + "! Your message has been received in this demonstration.";

        feedback.hidden = false;


        // Clear the form
        contactForm.reset();

    });

}


/* ==========================================
   9. WEBSITE INITIALIZATION
========================================== */

// Run the appropriate functions when the page loads
document.addEventListener("DOMContentLoaded", function() {

    initializeEventFiltering();

    initializeEventDetails();

    initializeBookingPage();

    initializeContactForm();

});
