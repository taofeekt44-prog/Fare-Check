const flagForm = document.getElementById("flagForm");

const reason = document.getElementById("reason");

const details = document.getElementById("details");

const characterCount = document.getElementById("characterCount");

const flagButton = document.getElementById("flagButton");


details.addEventListener("input", function () {

    characterCount.textContent = details.value.length;

});


// =========================
// FORM SUBMISSION
// =========================

flagForm.addEventListener("submit", function (event) {

    if (!reason.value) {

        event.preventDefault();

        alert("Please select a reason for flagging this fare.");

        reason.focus();

        return;
    }


    if (!confirmed) {

        event.preventDefault();

        return;
    }


    flagButton.disabled = true;

    flagButton.textContent = "Submitting...";
});