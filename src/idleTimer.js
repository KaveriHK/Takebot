window.onload = (event) => {
  console.log("page is fully loaded");
  fnIdleTimer();
};

function fnIdleTimer() {
  let timer,
    currSeconds = 0;

  function resetTimer() {
    //To hide the timer text element
    // if (document.querySelector(".timertext") != null)
    //   document.querySelector(".timertext").style.display = "none";

    //Clear the previous interval
    clearInterval(timer);

    //Reset the seconds of the timer
    currSeconds = 0;

    //Set a new interval
    timer = setInterval(startIdleTimer, 1000);
  }

  // Define the events that would reset the timer
  window.onload = resetTimer;
  window.onmousemove = resetTimer;
  window.onmousedown = resetTimer;
  window.ontouchstart = resetTimer;
  window.onclick = resetTimer;
  window.onkeypress = resetTimer;

  function startIdleTimer() {
    //Increment the timer seconds
    currSeconds++;

    //Set the timer text to the new value
    //     if (document.querySelector(".secs") != null)
    //       document.querySelector(".secs").textContent = currSeconds;
    //
    //     //Display the timer text
    //     if (document.querySelector(".timertext") != null)
    //       document.querySelector(".timertext").style.display = "block";

    if (currSeconds > 5 * 60) {
      //5 minutes//5min*60sec
      //alert('Your screen is inactive state for a long..!' + $("input[name=__RequestVerificationToken]").val());
      //window.location.reload();
      takeBotIconMsg(
        "bot-msg icon-delay",
        sessionTimeoutMsg,
        500,
        true,
        "text"
      );
      revokeUserInputAction();
      sessionTimeout();
      clearInterval(timer);
      sessionTimeOut = true;
    }
  }
}
