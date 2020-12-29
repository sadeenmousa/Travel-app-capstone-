function validInput(location,date) {
    if (location == "" && date =="" ) {
      alert("location and date can not be empty");
      return false;
    }
  }
  export { validInput };